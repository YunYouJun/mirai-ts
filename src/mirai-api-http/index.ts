import log from "../utils/log";
import { AxiosStatic, AxiosResponse } from "axios";
import { MessageType, Api, MiraiApiHttpConfig } from "../..";
import Message from "../message";

import FormData from "form-data";
import fs from "fs";

/**
 * 状态码及其对应消息
 * @param code Mirai 状态码
 * Todo: to json
 */
function handleStatusCode(code: number) {
  let msg = "";
  switch (code) {
    case 0:
      msg = "正常";
      break;
    case 1:
      msg = "错误的 auth key";
      break;
    case 2:
      msg = "指定的 Bot 不存在";
      break;
    case 3:
      msg = "Session 失效或不存在";
      break;
    case 4:
      msg = "Session 未认证(未激活)";
      break;
    case 5:
      msg = "发送消息目标不存在(指定对象不存在)";
      break;
    case 6:
      msg = "指定文件不存在，出现于发送本地图片";
      break;
    case 10:
      msg = "无操作权限，指 Bot 没有对应操作的限权";
      break;
    case 20:
      msg = "Bot 被禁言，指 Bot 当前无法向指定群发送消息";
      break;
    case 30:
      msg = "消息过长";
      break;
    case 400:
      msg = "错误的访问，如参数错误等";
      break;
    case 500:
      msg = "服务器端错误的响应（mirai-console/mirai-api-http 背锅）";
      break;
    default:
      break;
  }
  return msg;
}

export default class MiraiApiHttp {
  config: MiraiApiHttpConfig;
  axios: AxiosStatic;
  sessionKey: string;
  qq: number;
  verified: boolean;

  command: object;
  constructor(config: MiraiApiHttpConfig, axios: AxiosStatic) {
    this.config = config;
    this.axios = axios;
    this.sessionKey = "";
    this.qq = 0;
    this.verified = false;

    this.command = {
      axios,
      /**
       * 发送指令
       */
      send: async (name: string, args: string[]) => {
        const { data } = await this.axios.post("/command/send", {
          authKey: config.authKey,
          name,
          args,
        });
        return data;
      },
    };
  }

  /**
   * 拦截 mirai 错误信息
   */
  async handleStatusCode() {
    this.axios.interceptors.response.use(
      async (res: AxiosResponse) => {
        if (res.status === 200 && res.data.code) {
          const message = handleStatusCode(res.data.code);
          if (message) {
            log.error(`Code ${res.data.code}: ${message}`);

            if (res.data.code === 3) {
              log.info("正在自动尝试重新建立连接...");
              await this.auth();
              await this.verify(this.qq);
            }
          }
        }
        return res;
      },
      (err) => {
        log.error("响应失败");
        return Promise.reject(err);
      }
    );
  }

  /**
   * 使用此方法获取插件的信息，如版本号
   * data.data: { "version": "v1.0.0" }
   */
  async about() {
    const { data } = await this.axios.get("/about");
    return data;
  }

  /**
   * 使用此方法验证你的身份，并返回一个会话
   */
  async auth(authKey = this.config.authKey) {
    const { data } = await this.axios.post("/auth", {
      authKey,
    });
    if (data.code === 0) {
      this.sessionKey = data.session;
      log.success(`获取 Session: ${data.session}`);
    }
    return data;
  }

  /**
   * 使用此方法校验并激活你的Session，同时将Session与一个已登录的Bot绑定
   */
  async verify(qq: number) {
    this.qq = qq;
    const { data } = await this.axios.post("/verify", {
      sessionKey: this.sessionKey,
      qq,
    });
    if (data.code === 0) {
      this.verified = true;
      log.success(`Session(${this.sessionKey}) 验证成功`);
    }
    return data;
  }

  /**
   * 使用此方式释放 session 及其相关资源（Bot不会被释放） 不使用的 Session 应当被释放，长时间（30分钟）未使用的 Session 将自动释放。
   * 否则 Session 持续保存Bot收到的消息，将会导致内存泄露(开启websocket后将不会自动释放)
   */
  async release(qq = this.qq) {
    const { data } = await this.axios.post("/release", {
      sessionKey: this.sessionKey,
      qq,
    });
    if (data.code === 0) {
      this.verified = false;
      log.success(`释放 ${qq} Session: ${this.sessionKey}`);
    }
    return data;
  }

  // 获取 Bot 收到的消息和事件
  /**
   * 使用此方法获取bot接收到的最老消息和最老各类事件(会从MiraiApiHttp消息记录中删除)
   * { code: 0, data: [] }
   * @param count 获取消息和事件的数量
   */
  async fetchMessage(count = 10): Promise<Api.Response.fetchMessage> {
    const { data } = await this.axios.get("/fetchMessage", {
      params: {
        sessionKey: this.sessionKey,
        count,
      },
    });
    return data;
  }

  /**
   * 使用此方法获取bot接收到的最新消息和最新各类事件(会从MiraiApiHttp消息记录中删除)
   * @param count 获取消息和事件的数量
   */
  async fetchLatestMessage(count = 10): Promise<Api.Response.fetchMessage> {
    const { data } = await this.axios.get("/fetchLatestMessage", {
      params: {
        sessionKey: this.sessionKey,
        count,
      },
    });
    return data;
  }

  /**
   * 使用此方法获取bot接收到的最老消息和最老各类事件(不会从MiraiApiHttp消息记录中删除)
   * @param count 获取消息和事件的数量
   */
  async peekMessage(count = 10): Promise<Api.Response.fetchMessage> {
    const { data } = await this.axios.get("/peekMessage", {
      params: {
        sessionKey: this.sessionKey,
        count,
      },
    });
    return data;
  }

  /**
   * 使用此方法获取bot接收到的最老消息和最老各类事件(不会从MiraiApiHttp消息记录中删除)
   * @param count 获取消息和事件的数量
   */
  async peekLatestMessage(count = 10): Promise<Api.Response.fetchMessage> {
    const { data } = await this.axios.get("/peekLatestMessage", {
      params: {
        sessionKey: this.sessionKey,
        count,
      },
    });
    return data;
  }

  /**
   * 使用此方法获取bot接收到的消息和各类事件
   * @param id 获取消息的messageId
   */
  async messageFromId(id: number): Promise<MessageType.SingleMessage> {
    const { data } = await this.axios.get("/messageFromId", {
      params: {
        sessionKey: this.sessionKey,
        id,
      },
    });
    return data;
  }

  /**
   * 使用此方法向指定好友发送消息
   * @param messageChain 消息链，是一个消息对象构成的数组
   * @param target 发送消息目标好友的 QQ 号
   * @param quote 引用一条消息的messageId进行回复
   * @returns { code: 0, msg: "success", messageId: 123456 } messageId 一个Int类型属性，标识本条消息，用于撤回和引用回复
   */
  async sendFriendMessage(
    messageChain: string | MessageType.MessageChain,
    target: number,
    quote?: number
  ): Promise<object> {
    if (typeof messageChain === "string") {
      messageChain = [Message.Plain(messageChain)];
    }
    const payload: Api.SendFriendMessage = {
      sessionKey: this.sessionKey,
      target,
      messageChain,
    };
    if (quote) {
      payload.quote = quote;
    }
    const { data } = await this.axios.post("/sendFriendMessage", payload);
    return data;
  }

  /**
   * 使用此方法向指定群发送消息
   * @param messageChain 消息链，是一个消息对象构成的数组
   * @param target 发送消息目标群的群号
   * @param quote 引用一条消息的messageId进行回复
   * @return { code: 0, msg: "success", messageId: 123456 } messageId 一个Int类型属性，标识本条消息，用于撤回和引用回复
   */
  async sendGroupMessage(
    messageChain: string | MessageType.MessageChain,
    target: number,
    quote?: number
  ): Promise<object> {
    if (typeof messageChain === "string") {
      messageChain = [Message.Plain(messageChain)];
    }
    const payload: Api.SendGroupMessage = {
      sessionKey: this.sessionKey,
      target,
      messageChain,
    };
    if (quote) {
      payload.quote = quote;
    }
    const { data } = await this.axios.post("/sendGroupMessage", payload);
    return data;
  }

  /**
   * 发送临时会话消息
   * @param messageChain 消息链，是一个消息对象构成的数组
   * @param qq 临时会话对象QQ号
   * @param group 临时会话群号
   * @param quote 引用一条消息的messageId进行回复
   */
  async sendTempMessage(
    messageChain: string | MessageType.MessageChain,
    qq: number,
    group: number,
    quote?: number
  ): Promise<object> {
    if (typeof messageChain === "string") {
      messageChain = [Message.Plain(messageChain)];
    }
    const payload: Api.SendTempMessage = {
      sessionKey: this.sessionKey,
      qq,
      group,
      messageChain,
    };
    if (quote) {
      payload.quote = quote;
    }
    const { data } = await this.axios.post("/sendTempMessage", payload);
    return data;
  }

  /**
   * 使用此方法向指定对象（群或好友）发送图片消息 除非需要通过此手段获取imageId，否则不推荐使用该接口
   * @param urls 是一个url字符串构成的数组
   * @param target 发送对象的QQ号或群号，可能存在歧义
   * @param qq 发送对象的QQ号
   * @param group 发送对象的群号
   */
  async sendImageMessage(
    urls: string[],
    target?: number,
    qq?: number,
    group?: number
  ) {
    const { data } = await this.axios.post("/sendImageMessage", {
      sessionKey: this.sessionKey,
      target,
      qq,
      group,
      urls,
    });
    return data;
  }

  /**
   * 使用此方法上传图片文件至服务器并返回ImageId
   * @param type "friend" 或 "group" 或 "temp"
   * @param img 图片文件
   */
  async uploadImage(type: string, img: string | fs.ReadStream) {
    if (typeof img === "string") img = fs.createReadStream(img);
    const form = new FormData();
    form.append("sessionKey", this.sessionKey);
    form.append("type", type);
    form.append("img", img);
    this.axios.post("/uploadImage", form, { headers: form.getHeaders() });
  }

  /**
   * 撤回消息
   * 使用此方法撤回指定消息。对于bot发送的消息，有2分钟时间限制。对于撤回群聊中群员的消息，需要有相应权限
   * @param target 需要撤回的消息的messageId
   */
  async recall(target: number | MessageType.SingleMessage) {
    let messageId = target;
    if (typeof target !== "number" && target.messageChain[0].id) {
      messageId = target.messageChain[0].id;
    }
    const { data } = await this.axios.post('/recall', {
      sessionKey: this.sessionKey,
      target: messageId
    });
    return data;
  }

  /**
   * 获取 bot 的好友列表
   */
  async friendList() {
    const { data } = await this.axios.get('/friendList', {
      params: {
        sessionKey: this.sessionKey
      }
    });
    return data;
  }

  /**
   * 获取 bot 的群列表
   */
  async groupList() {
    const { data } = await this.axios.get('/groupList', {
      params: {
        sessionKey: this.sessionKey
      }
    });
    return data;
  }

  /**
   * 获取 BOT 的群成员列表
   * @param target 指定群的群号
   */
  async memberList(target: number) {
    const { data } = await this.axios.get('/memberList', {
      params: {
        sessionKey: this.sessionKey,
        target
      }
    });
    return data;
  }

  /**
   * 指定群进行全体禁言
   * @param target 指定群的群号
   */
  async muteAll(target: number) {
    const { data } = await this.axios.post('/muteAll', {
      params: {
        sessionKey: this.sessionKey,
        target
      }
    });
    return data;
  }

  /**
   * 指定群解除全体禁言
   * @param target 指定群的群号
   */
  async unmuteAll(target: number) {
    const { data } = await this.axios.post('/unmuteAll', {
      params: {
        sessionKey: this.sessionKey,
        target
      }
    });
    return data;
  }

  /**
   * 获取 Mangers
   */
  async managers() {
    const { data } = await this.axios.get("/managers", {
      params: {
        qq: this.qq,
      },
    });
    return data;
  }
}
