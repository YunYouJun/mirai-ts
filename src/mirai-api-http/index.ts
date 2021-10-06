/**
 * mirai-api-http 类，实现了 [mirai-appi-http](https://github.com/project-mirai/mirai-api-http) 文档中的所有请求
 * @packageDocumentation
 */

import { AxiosStatic, AxiosResponse } from "axios";
import { MessageType, Api, Config, EventType } from "..";

// for upload image
import FormData from "form-data";
import WebSocket from "ws";

// nested api url
import { Command } from "./command";
import { Resp } from "./resp";

// 处理状态码
import { getMessageFromStatusCode } from "./utils";
import Logger from "@yunyoujun/logger";
import chalk from "chalk";

// utils
import { toMessageChain } from "./message";
import { MiraiApiHttpSetting } from "../types";

type WsCallbackMap = {
  message: (msg: MessageType.ChatMessage) => any;
  event: (event: EventType.Event) => any;
  all: (data: EventType.Event | MessageType.ChatMessage) => any;
};

export default class MiraiApiHttp {
  sessionKey = "";
  /**
   * WebSocket SessionKey
   */
  ws: {
    sessionKey: string;
    address: string;
    client?: WebSocket;
  } = {
    sessionKey: "",
    address: "",
  };

  qq = 0;
  verified = false;

  address: string;

  command: Command;
  /**
   * [申请事件 | EventType](https://github.com/project-mirai/mirai-api-http/blob/master/docs/EventType.md#%E7%94%B3%E8%AF%B7%E4%BA%8B%E4%BB%B6)
   */
  resp: Resp;

  public logger = new Logger({ prefix: chalk.cyan("[mirai-api-http]") });

  constructor(public setting: MiraiApiHttpSetting, public axios: AxiosStatic) {
    const wsSetting = this.setting.adapterSettings.ws;
    this.ws.address = `ws://${wsSetting.host}:${wsSetting.port}`;

    const httpSetting = this.setting.adapterSettings.http;
    this.address = `http://${httpSetting.host}:${httpSetting.port}`;
    this.axios.defaults.baseURL = this.address;
    this.axios.defaults.maxContentLength = Infinity;
    this.axios.defaults.maxBodyLength = Infinity;

    this.command = new Command(this);
    this.resp = new Resp(this);
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
              await this.verify();
              await this.bind(this.qq);
            }
          }
        }
        return res;
      },
      (err) => {
        this.logger.error(`响应失败：${err.message}`);
        if (process.env.NODE_ENV !== "production") {
          console.error(err);
        }
        return Promise.reject(err);
      }
    );
  }

  /**
   * 使用此方法获取插件的信息，如版本号
   * data.data: { "version": "v1.0.0" }
   */
  async about(): Promise<Api.Response.About> {
    const { data } = await this.axios.get("/about");
    return data;
  }

  /**
   * 使用此方法验证你的身份，并返回一个会话
   */
  async verify(verifyKey = this.setting.verifyKey): Promise<Api.Response.Auth> {
    this.logger.info(`[http] Address: ${this.address}`);

    const { data } = await this.axios.post("/verify", {
      verifyKey,
    });

    if (data.code === 0) {
      this.sessionKey = data.session;
      this.axios.defaults.headers.common["sessionKey"] = this.sessionKey;
    }
    return data;
  }

  /**
   * 使用此方法校验并激活你的Session，同时将Session与一个已登录的Bot绑定
   */
  async bind(qq: number): Promise<Api.Response.BaseResponse> {
    this.qq = qq;
    const { data } = await this.axios.post("/bind", {
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
  async release(qq = this.qq): Promise<Api.Response.BaseResponse> {
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
  async fetchMessage(count = 10): Promise<Api.Response.FetchMessage> {
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
  async fetchLatestMessage(count = 10): Promise<Api.Response.FetchMessage> {
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
  async peekMessage(count = 10): Promise<Api.Response.FetchMessage> {
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
  async peekLatestMessage(count = 10): Promise<Api.Response.FetchMessage> {
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
  ): Promise<Api.Response.MessageFromId | MessageType.ChatMessage> {
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
  ): Promise<Api.Response.SendMessage> {
    messageChain = toMessageChain(messageChain);
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
  ): Promise<Api.Response.SendMessage> {
    messageChain = toMessageChain(messageChain);
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
  ): Promise<Api.Response.SendMessage> {
    messageChain = toMessageChain(messageChain);
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
  ): Promise<string[]> {
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
   * @param img 图片文件 fs.createReadStream(img)
   */
  async uploadImage(
    type: "friend" | "group" | "temp",
    img: File
  ): Promise<Api.Response.UploadImage> {
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
   * @param voice 语音文件 fs.createReadStream(voice)
   */
  async uploadVoice(
    type: "friend" | "group" | "temp",
    voice: File
  ): Promise<Api.Response.UploadVoice> {
    const form = new FormData();
    form.append("sessionKey", this.sessionKey);
    form.append("type", type);
    form.append("voice", voice);
    const { data } = await this.axios.post("/uploadVoice", form, {
      headers: form.getHeaders(),
    });
    return data;
  }

  /**
   * 文件上传
   * @param type 当前仅支持 "Group"
   * @param target 指定群的群号
   * @param path 文件上传目录与名字
   * @param file 文件内容
   */
  async uploadFileAndSend(
    type: "Group",
    target: number,
    path: string,
    file: File
  ) {
    const form = new FormData();
    form.append("sessionKey", this.sessionKey);
    form.append("type", type);
    form.append("target", target);
    form.append("path", path);
    form.append("file", file);
    const { data } = await this.axios.post("/uploadFileAndSend", form, {
      headers: form.getHeaders(),
    });
    return data;
  }

  /**
   * 撤回消息
   * 使用此方法撤回指定消息。对于bot发送的消息，有2分钟时间限制。对于撤回群聊中群员的消息，需要有相应权限
   * @param target 需要撤回的消息的messageId
   */
  async recall(
    target: number | MessageType.ChatMessage
  ): Promise<Api.Response.BaseResponse> {
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
  async friendList(): Promise<Api.Response.FriendList> {
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
  async groupList(): Promise<Api.Response.GroupList> {
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
  async memberList(target: number): Promise<Api.Response.MemberList> {
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
  async muteAll(target: number): Promise<Api.Response.BaseResponse> {
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
  async unmuteAll(target: number): Promise<Api.Response.BaseResponse> {
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
  async mute(
    target: number,
    memberId: number,
    time = 60
  ): Promise<Api.Response.BaseResponse> {
    const body = {
      target,
      memberId,
      time,
    };
    const { data } = await this.axios.post("/mute", body);
    return data;
  }

  /**
   * 指定群解除群成员禁言
   * @param target	指定群的群号
   * @param memberId 指定群员QQ号
   */
  async unmute(
    target: number,
    memberId: number
  ): Promise<Api.Response.BaseResponse> {
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
  async kick(
    target: number,
    memberId: number,
    msg = "您已被移出群聊"
  ): Promise<Api.Response.BaseResponse> {
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
  async quit(target: number): Promise<Api.Response.BaseResponse> {
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
  async groupConfig(
    target: number,
    config?: Config.GroupConfig
  ): Promise<Api.Response.BaseResponse | Config.GroupConfig> {
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
          sessionKey: this.sessionKey,
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
  async memberInfo(
    target: number,
    memberId: number,
    info: Config.MemberInfo = {}
  ): Promise<Api.Response.BaseResponse | Config.MemberInfo> {
    const { data } = await this.axios.post("/memberInfo", {
      sessionKey: this.sessionKey,
      target,
      memberId,
      info,
    });
    return data;
  }

  /**
   * 构建 WebSocket 通道
   * @param type
   */
  _buildWsChannel<T extends "message" | "event" | "all">(
    type: T,
    callback: WsCallbackMap[T]
  ) {
    const typeName = {
      message: "消息",
      event: "事件",
      all: "消息与事件",
    };
    this.logger.info(
      `[websocket] [${type}](${typeName[type]}) ${this.ws.address}`
    );

    const wsParams = new URLSearchParams();
    wsParams.append("verifyKey", this.setting.verifyKey);
    wsParams.append("qq", this.qq.toString());

    const client = new WebSocket(
      `${this.ws.address}/${type}?${wsParams.toString()}`
    );
    this.ws.client = client;

    client.on("open", () => {
      const interval = setInterval(() => client.ping(), 60000);
      client.on("close", () => clearInterval(interval));
    });
    // 绑定 sessionKey
    client.once("message", (data: WebSocket.Data) => {
      const response = JSON.parse(data.toString());
      if (response.data.session) {
        this.ws.sessionKey = response.data.session;
        this.logger.info(`[ws] Session: ${this.ws.sessionKey}`);
      } else {
        this.logger.error(response);
      }
    });
    client.on("message", (data: WebSocket.Data) => {
      const msg = JSON.parse(data.toString());
      callback(msg.data);
    });
  }

  // Websocket
  /**
   * 监听该接口，插件将推送 Bot 收到的消息
   * @param callback 回调函数
   */
  message(callback: WsCallbackMap["message"]): void {
    this._buildWsChannel("message", callback);
  }

  /**
   * 监听该接口，插件将推送 Bot 收到的事件
   * @param callback 回调函数
   */
  event(callback: WsCallbackMap["event"]) {
    this._buildWsChannel("event", callback);
  }

  /**
   * 监听该接口，插件将推送 Bot 收到的消息和事件
   * @param callback 回调函数
   */
  all(callback: WsCallbackMap["all"]) {
    this._buildWsChannel("all", callback);
  }

  // 配置相关
  /**
   * 获取 Mangers
   */
  async managers(): Promise<number[]> {
    const { data } = await this.axios.get("/managers", {
      params: {
        qq: this.qq,
      },
    });
    return data;
  }

  /**
   * 设置群精华消息
   * @param target 消息ID
   */
  async setEssence(target: number): Promise<Api.Response.BaseResponse> {
    const { data } = await this.axios.post("/setEssence", {
      sessionKey: this.sessionKey,
      target,
    });
    return data;
  }

  /**
   * 戳一戳
   * @param target 戳一戳的目标, QQ号, 可以为 bot QQ号
   * @param subject 戳一戳接受主体(上下文), 戳一戳信息会发送至该主体, 为群号/好友QQ号
   * @param kind 上下文类型
   */
  async sendNudge(
    target: number,
    subject: number,
    kind: "Friend" | "Group" = "Group"
  ): Promise<Api.Response.BaseResponse> {
    const { data } = await this.axios.post("/sendNudge", {
      sessionKey: this.sessionKey,
      target,
      subject,
      kind,
    });
    return data;
  }

  // 群文件管理
  /**
   * 获取群文件列表
   * @param target 指定群的群号
   * @param dir 指定查询目录，不填为根目录
   */
  async groupFileList(
    target: number,
    dir?: string
  ): Promise<Api.Response.GroupFile[]> {
    const { data } = await this.axios.get("/groupFileList", {
      params: {
        sessionKey: this.sessionKey,
        target,
        dir,
      },
    });
    return data;
  }

  /**
   * 获取群文件详细信息
   * @param target 指定群的群号
   * @param id 文件唯一ID
   */
  async groupFileInfo(
    target: number,
    id: string
  ): Promise<Api.Response.GroupFileInfo> {
    const { data } = await this.axios.get("/groupFileInfo", {
      params: {
        sessionKey: this.sessionKey,
        target,
        id,
      },
    });
    return data;
  }

  /**
   * 重命名群文件/目录
   * @param target
   * @param id
   * @param rename
   */
  async groupFileRename(
    target: number,
    id: string,
    rename: string
  ): Promise<Api.Response.BaseResponse> {
    const { data } = await this.axios.post("/groupFileRename", {
      sessionKey: this.sessionKey,
      target,
      id,
      rename,
    });
    return data;
  }

  /**
   * 创建群文件目录
   * @param group
   * @param dir
   */
  async groupMkdir(
    group: number,
    dir: string
  ): Promise<Api.Response.BaseResponse> {
    const { data } = await this.axios.post("/groupMkdir", {
      sessionKey: this.sessionKey,
      group,
      dir,
    });
    return data;
  }

  /**
   * 移动群文件
   * @param target
   * @param id
   * @param movePath 移动到的目录，根目录为/，目录不存在时自动创建
   * @returns
   */
  async groupFileMove(
    target: number,
    id: string,
    movePath: string
  ): Promise<Api.Response.BaseResponse> {
    const { data } = await this.axios.post("/groupFileMove", {
      sessionKey: this.sessionKey,
      target,
      id,
      movePath,
    });
    return data;
  }

  /**
   * 删除群文件/目录
   * @param target
   * @param id
   * @returns
   */
  async groupFileDelete(
    target: number,
    id: string
  ): Promise<Api.Response.BaseResponse> {
    const { data } = await this.axios.post("/groupFileDelete", {
      sessionKey: this.sessionKey,
      target,
      id,
    });
    return data;
  }
}
