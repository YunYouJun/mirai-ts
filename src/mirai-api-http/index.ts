/**
 * mirai-api-http 类，实现了 [mirai-appi-http](https://github.com/project-mirai/mirai-api-http) 文档中的所有请求
 * @packageDocumentation
 */

import { AxiosStatic, AxiosResponse } from "axios";
import { MessageType, Api, Config, EventType } from "..";
import Message from "../message";

// for upload image
import FormData from "form-data";
import WebSocket from "ws";

// nested api url
import { Command } from "./command";
import { Resp } from "./resp";

// 处理状态码
import { getMessageFromStatusCode } from "./utils";
import Logger from "../utils/logger";
import chalk from "chalk";

/**
 * 与 mirai-api-http [setting.yml](https://github.com/project-mirai/mirai-api-http#settingyml模板) 的配置保持一致
 */
export interface MiraiApiHttpConfig {
  /**
   * 可选，默认值为0.0.0.0
   */
  host?: string;
  /**
   * 可选，默认值为8080
   */
  port?: number;
  /**
   * 可选，默认由 mirai-api-http 随机生成，建议手动指定。未传入该值时，默认为 'el-psy-congroo'
   */
  authKey?: string;
  /**
   * 可选，缓存大小，默认4096.缓存过小会导致引用回复与撤回消息失败
   */
  cacheSize?: number;
  /**
   * 可选，是否开启websocket，默认关闭，建议通过Session范围的配置设置
   */
  enableWebsocket?: boolean;
  /**
   * 可选，配置CORS跨域，默认为*，即允许所有域名
   */
  cors?: string[];
}

export default class MiraiApiHttp {
  sessionKey: string;
  qq: number;
  verified: boolean;

  address: string;
  command: Command;
  /**
   * [EventType](https://github.com/project-mirai/mirai-api-http/blob/master/EventType.md) 中的请求
   */
  resp: Resp;

  logger: Logger;

  constructor(public config: MiraiApiHttpConfig, public axios: AxiosStatic) {
    this.sessionKey = "";
    this.qq = 0;
    this.verified = false;

    if (this.config.enableWebsocket) {
      this.address = `ws://${this.config.host}:${this.config.port}`;
    } else {
      this.address = `http://${this.config.host}:${this.config.port}`;
    }
    this.command = new Command(this);
    this.resp = new Resp(this);

    this.logger = new Logger(chalk.cyan("[mirai-api-http]"));
  }

  /**
   * 拦截 mirai 错误信息
   */
  async handleStatusCode() {
    this.axios.interceptors.response.use(
      async (res: AxiosResponse) => {
        if (res.status === 200 && res.data.code) {
          const message = getMessageFromStatusCode(res.data.code);
          if (message) {
            this.logger.error(`Code ${res.data.code}: ${message}`);

            if (res.data.code === 3 || res.data.code === 4) {
              this.logger.warning("正在尝试重新建立连接...");
              await this.auth();
              await this.verify(this.qq);
            }
          }
        }
        return res;
      },
      (err) => {
        this.logger.error(`响应失败：${err.message}`);
        console.error(err);
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
    this.verified = data.code === 0;
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
    }
    return data;
  }

  // 获取 Bot 收到的消息和事件
  /**
   * 使用此方法获取 bot 接收到的最老消息和最老各类事件(会从 MiraiApiHttp 消息记录中删除)
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
   * 使用此方法获取 bot 接收到的最新消息和最新各类事件(会从 MiraiApiHttp 消息记录中删除)
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
   * 使用此方法获取 bot 接收到的最老消息和最老各类事件(不会从 MiraiApiHttp 消息记录中删除)
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
   * 使用此方法获取 bot 接收到的最老消息和最老各类事件(不会从 MiraiApiHttp 消息记录中删除)
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
   * 通过 messageId 获取一条被缓存的消息
   * @param id 获取消息的messageId
   */
  async messageFromId(
    id: number
  ): Promise<Api.Response.messageFromId | MessageType.ChatMessage> {
    const { data } = await this.axios.get("/messageFromId", {
      params: {
        sessionKey: this.sessionKey,
        id,
      },
    });
    if (data.code === 0) {
      return data.data;
    } else {
      return data;
    }
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
  ): Promise<Api.Response.sendMessage> {
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
  ): Promise<Api.Response.sendMessage> {
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
  ): Promise<Api.Response.sendMessage> {
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
   * 使用此方法上传图片文件至服务器并返回 ImageId
   * @param type
   * @param img 图片文件
   */
  async uploadImage(type: "friend" | "group" | "temp", img: string | File) {
    if (typeof img === "string") {
      const fs = require("fs");
      img = fs.createReadStream(img);
    }
    const form = new FormData();
    form.append("sessionKey", this.sessionKey);
    form.append("type", type);
    form.append("img", img);
    const { data } = await this.axios.post("/uploadImage", form, {
      headers: form.getHeaders(), // same as post: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  }

  /**
   * 使用此方法上传语音文件至服务器并返回 VoiceId
   * @param type 当前仅支持 "group"
   * @param voice 语音文件
   */
  async uploadVoice(type: "friend" | "group" | "temp", voice: string | File) {
    if (typeof voice === "string") {
      const fs = require("fs");
      voice = fs.createReadStream(voice);
    }
    const form = new FormData();
    form.append("sessionKey", this.sessionKey);
    form.append("type", type);
    form.append("voice", voice);
    const { data } = await this.axios.post("/uploadVoice", form, {
      headers: form.getHeaders(), // same as post: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  }

  /**
   * 撤回消息
   * 使用此方法撤回指定消息。对于bot发送的消息，有2分钟时间限制。对于撤回群聊中群员的消息，需要有相应权限
   * @param target 需要撤回的消息的messageId
   */
  async recall(target: number | MessageType.ChatMessage) {
    let messageId = target;
    if (typeof target !== "number" && target.messageChain[0].id) {
      messageId = target.messageChain[0].id;
    }
    const { data } = await this.axios.post("/recall", {
      sessionKey: this.sessionKey,
      target: messageId,
    });
    return data;
  }

  /**
   * 获取 bot 的好友列表
   */
  async friendList() {
    const { data } = await this.axios.get("/friendList", {
      params: {
        sessionKey: this.sessionKey,
      },
    });
    return data;
  }

  /**
   * 获取 bot 的群列表
   */
  async groupList() {
    const { data } = await this.axios.get("/groupList", {
      params: {
        sessionKey: this.sessionKey,
      },
    });
    return data;
  }

  /**
   * 获取 BOT 的群成员列表
   * @param target 指定群的群号
   */
  async memberList(target: number) {
    const { data } = await this.axios.get("/memberList", {
      params: {
        sessionKey: this.sessionKey,
        target,
      },
    });
    return data;
  }

  /**
   * 指定群进行全体禁言
   * @param target 指定群的群号
   */
  async muteAll(target: number) {
    const { data } = await this.axios.post("/muteAll", {
      sessionKey: this.sessionKey,
      target,
    });
    return data;
  }

  /**
   * 指定群解除全体禁言
   * @param target 指定群的群号
   */
  async unmuteAll(target: number) {
    const { data } = await this.axios.post("/unmuteAll", {
      sessionKey: this.sessionKey,
      target,
    });
    return data;
  }

  /**
   * 指定群禁言指定群员
   * @param target	指定群的群号
   * @param memberId 指定群员QQ号
   * @param time 禁言时长，单位为秒，最多30天，默认为 60 秒
   */
  async mute(target: number, memberId: number, time = 60) {
    const { data } = await this.axios.post("/mute", {
      sessionKey: this.sessionKey,
      target,
      memberId,
      time,
    });
    return data;
  }

  /**
   * 指定群解除群成员禁言
   * @param target	指定群的群号
   * @param memberId 指定群员QQ号
   */
  async unmute(target: number, memberId: number) {
    const { data } = await this.axios.post("/unmute", {
      sessionKey: this.sessionKey,
      target,
      memberId,
    });
    return data;
  }

  /**
   * 移除群成员
   * @param target 指定群的群号
   * @param memberId 指定群员QQ号
   * @param msg 信息
   */
  async kick(target: number, memberId: number, msg = "您已被移出群聊") {
    const { data } = await this.axios.post("/kick", {
      sessionKey: this.sessionKey,
      target,
      memberId,
      msg,
    });
    return data;
  }

  /**
   * 退出群聊
   * @param target 群号
   * bot为该群群主时退出失败并返回code 10(无操作权限)
   */
  async quit(target: number) {
    const { data } = await this.axios.post("/quit", {
      sessionKey: this.sessionKey,
      target,
    });
    return data;
  }

  /**
   * 传入 config 时，修改群设置
   * 未传入 config 时，获取群设置
   * @param target 指定群的群号
   * @param config 群设置
   */
  async groupConfig(target: number, config?: Config.GroupConfig) {
    if (config) {
      const { data } = await this.axios.post("/groupConfig", {
        sessionKey: this.sessionKey,
        target,
        config,
      });
      return data;
    } else {
      const { data } = await this.axios.get("/groupConfig", {
        params: {
          target,
        },
      });
      return data;
    }
  }

  /**
   * 传入 info 时，修改群员资料
   * 未传入 info 时，获取群员资料
   * @param targer 指定群的群号
   * @param memberId 群员QQ号
   * @param info 群员资料
   */
  async memberInfo(target: number, memberId: number, info?: Config.MemberInfo) {
    if (info) {
      const { data } = await this.axios.post("/groupConfig", {
        sessionKey: this.sessionKey,
        target,
        memberId,
        info,
      });
      return data;
    } else {
      const { data } = await this.axios.get("/groupConfig", {
        params: {
          target,
          memberId,
        },
      });
      return data;
    }
  }

  // Websocket
  /**
   * 监听该接口，插件将推送 Bot 收到的消息
   * @param callback 回调函数
   */
  message(callback: (msg: MessageType.ChatMessage) => any): void {
    this.logger.info(`监听消息: ${this.address}`);
    const ws = new WebSocket(
      this.address + "/message?sessionKey=" + this.sessionKey
    );
    ws.on("message", (data: WebSocket.Data) => {
      const msg = JSON.parse(data.toString());
      callback(msg);
    });
  }

  /**
   * 监听该接口，插件将推送 Bot 收到的事件
   * @param callback 回调函数
   */
  event(callback: (event: EventType.Event) => any) {
    this.logger.info(`监听事件: ${this.address}`);
    const ws = new WebSocket(
      this.address + "/event?sessionKey=" + this.sessionKey
    );
    ws.on("message", (data: WebSocket.Data) => {
      const msg = JSON.parse(data.toString());
      callback(msg);
    });
  }

  /**
   * 监听该接口，插件将推送 Bot 收到的消息和事件
   * @param callback 回调函数
   */
  all(callback: (data: EventType.Event | MessageType.ChatMessage) => any) {
    this.logger.info(`监听消息和事件: ${this.address}`);
    const ws = new WebSocket(
      this.address + "/all?sessionKey=" + this.sessionKey
    );
    ws.on("message", (data: WebSocket.Data) => {
      const msg = JSON.parse(data.toString());
      callback(msg);
    });
  }

  // 配置相关
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
