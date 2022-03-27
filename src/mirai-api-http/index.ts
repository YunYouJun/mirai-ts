/**
 * mirai-api-http 类，实现了 [mirai-api-http](https://github.com/project-mirai/mirai-api-http) 文档中的所有请求
 * [Http Adapter](https://github.com/project-mirai/mirai-api-http/blob/master/docs/adapter/HttpAdapter.md)
 * [API 文档参考](https://github.com/project-mirai/mirai-api-http/blob/master/docs/api/API.md)
 * @packageDocumentation
 */

import type { AxiosResponse, AxiosStatic } from "axios";
import FormData from "form-data";
import WebSocket from "ws";
import { Logger } from "@yunyoujun/logger";
import chalk from "chalk";
import type {
  Api,
  Config,
  EventType,
  MessageType,
  MiraiApiHttpSetting,
  UserProfile,
} from "../types";

// for upload image

// nested api url
import type { Mirai } from "../mirai";
import { Command } from "./command";
import { File } from "./file";
import { Resp } from "./resp";

// 处理状态码
import { getMessageFromStatusCode } from "./utils";

// utils
import { toMessageChain } from "./message";

export * from "./command";
export * from "./message";
export * from "./file";
export * from "./resp";
export * from "./utils";

interface WsCallbackMap {
  message: (msg: MessageType.ChatMessage) => any;
  event: (event: EventType.Event) => any;
  all: (data: EventType.Event | MessageType.ChatMessage) => any;
}

/**
 * 基础的验证参数
 */
interface BaseVerifyParams {
  verifyKey: string;
}

export class MiraiApiHttp {
  setting: MiraiApiHttpSetting;
  sessionKey = "";

  /**
   * http adapter
   */
  http: {
    address: string;
  } = {
    address: "",
  };

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

  command: Command;
  file: File;
  /**
   * [申请事件 | EventType](https://github.com/project-mirai/mirai-api-http/blob/master/docs/EventType.md#%E7%94%B3%E8%AF%B7%E4%BA%8B%E4%BB%B6)
   */
  resp: Resp;

  public logger = new Logger({ prefix: chalk.cyan("[mirai-api-http]") });

  constructor(public mirai: Mirai, public axios: AxiosStatic) {
    this.setting = this.mirai.mahSetting;

    const wsSetting = this.setting.adapterSettings.ws;
    this.ws.address =
      this.mirai.options.ws?.address ||
      `ws://${wsSetting.host}:${wsSetting.port}`;

    const httpSetting = this.setting.adapterSettings.http;
    this.http.address =
      this.mirai.options.http?.address ||
      `http://${httpSetting.host}:${httpSetting.port}`;

    this.axios.defaults.baseURL = this.http.address;
    this.axios.defaults.maxContentLength = Infinity;
    this.axios.defaults.maxBodyLength = Infinity;

    this.command = new Command(this);
    this.file = new File(this);
    this.resp = new Resp(this);
  }

  /**
   * 拦截 mirai 错误信息
   */
  async handleStatusCode() {
    this.axios.interceptors.response.use(
      async (res) => {
        if (res.status === 200 && res.data) {
          const statusCode = (res.data as any).code;
          const message = getMessageFromStatusCode(statusCode);
          if (statusCode && message) {
            this.logger.error(`Code ${statusCode}: ${message}`);

            if (statusCode === 3 || statusCode === 4) {
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
        if (process.env.NODE_ENV !== "production") console.error(err);

        return Promise.reject(err);
      }
    );
  }

  /**
   * 使用此方法获取插件的信息，如版本号
   * data.data: { "version": "v1.0.0" }
   */
  async about() {
    const { data } = await this.axios.get<
      null,
      AxiosResponse<Api.Response.About>
    >("/about");
    return data;
  }

  /**
   * 使用此方法验证你的身份，并返回一个会话
   */
  async verify(verifyKey = this.setting.verifyKey): Promise<Api.Response.Auth> {
    this.logger.info(`[http] Address: ${this.http.address}`);

    const { data } = await this.axios.post<
      BaseVerifyParams,
      AxiosResponse<Api.Response.Auth>
    >("/verify", {
      verifyKey,
    });

    if (data.code === 0) {
      this.sessionKey = data.session;
      if (this.axios.defaults.headers) {
        (this.axios.defaults.headers.common as any).sessionKey =
          this.sessionKey;
      }
    }
    return data;
  }

  /**
   * 使用此方法校验并激活你的Session，同时将Session与一个已登录的Bot绑定
   */
  async bind(qq: number) {
    this.qq = qq;
    const { data } = await this.axios.post<
      Api.Params.RequestParams<{ qq: number }>,
      AxiosResponse<Api.Response.BaseResponse>
    >("/bind", {
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
    const { data } = await this.axios.post<
      Api.Params.RequestParams<{ qq: number }>,
      AxiosResponse<Api.Response.BaseResponse>
    >("/release", {
      sessionKey: this.sessionKey,
      qq,
    });
    if (data.code === 0) this.verified = false;

    return data;
  }

  // 获取 Bot 收到的消息和事件
  /**
   * 使用此方法获取 bot 接收到的最老消息和最老各类事件(会从 MiraiApiHttp 消息记录中删除)
   * { code: 0, data: [] }
   * @param count 获取消息和事件的数量
   */
  async fetchMessage(count = 10) {
    const { data } = await this.axios.get<
      Api.Params.RequestParams<{ count: number }>,
      AxiosResponse<Api.Response.FetchMessage>
    >("/fetchMessage", {
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
  async fetchLatestMessage(count = 10) {
    const { data } = await this.axios.get<
      Api.Params.RequestParams<{ count: number }>,
      AxiosResponse<Api.Response.FetchMessage>
    >("/fetchLatestMessage", {
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
  async peekMessage(count = 10) {
    const { data } = await this.axios.get<
      Api.Params.RequestParams<{ count: number }>,
      AxiosResponse<Api.Response.FetchMessage>
    >("/peekMessage", {
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
  async peekLatestMessage(count = 10) {
    const { data } = await this.axios.get<
      Api.Params.RequestParams<{ count: number }>,
      AxiosResponse<Api.Response.FetchMessage>
    >("/peekLatestMessage", {
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
  async messageFromId(id: number) {
    const { data } = await this.axios.get<
      Api.Params.RequestParams<{ id: number }>,
      AxiosResponse<Api.Response.MessageFromId>
    >("/messageFromId", {
      params: {
        sessionKey: this.sessionKey,
        id,
      },
    });
    if (data.code === 0) return data.data;
    else return data;
  }

  /**
   * 使用此方法向指定好友发送消息
   * @param messageChain 消息链，是一个消息对象构成的数组
   * @param target 发送消息目标好友的 QQ 号
   * @param quote 引用一条消息的messageId进行回复
   * @returns '{ code: 0, msg: "success", messageId: 123456 }' messageId 一个Int类型属性，标识本条消息，用于撤回和引用回复
   */
  async sendFriendMessage(
    messageChain: string | MessageType.MessageChain,
    target: number,
    quote?: number
  ) {
    messageChain = toMessageChain(messageChain);
    const payload: Api.Params.SendFriendMessage = {
      sessionKey: this.sessionKey,
      target,
      messageChain,
    };
    if (quote) payload.quote = quote;

    const { data } = await this.axios.post<
      Api.Params.SendFriendMessage,
      AxiosResponse<Api.Response.SendMessage>
    >("/sendFriendMessage", payload);
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
  ) {
    messageChain = toMessageChain(messageChain);
    const payload: Api.Params.SendGroupMessage = {
      sessionKey: this.sessionKey,
      target,
      messageChain,
    };
    if (quote) payload.quote = quote;

    const { data } = await this.axios.post<
      Api.Params.SendGroupMessage,
      AxiosResponse<Api.Response.SendMessage>
    >("/sendGroupMessage", payload);
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
  ) {
    messageChain = toMessageChain(messageChain);
    const payload: Api.Params.SendTempMessage = {
      sessionKey: this.sessionKey,
      qq,
      group,
      messageChain,
    };
    if (quote) payload.quote = quote;

    const { data } = await this.axios.post<
      Api.Params.SendTempMessage,
      AxiosResponse<Api.Response.SendMessage>
    >("/sendTempMessage", payload);
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
    const { data } = await this.axios.post<
      Api.Params.SendImageMessage,
      AxiosResponse<string[]>
    >("/sendImageMessage", {
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
  async uploadImage(type: "friend" | "group" | "temp", img: File) {
    const form = new FormData();
    form.append("sessionKey", this.sessionKey);
    form.append("type", type);
    form.append("img", img);
    const { data } = await this.axios.post<
      FormData,
      AxiosResponse<Api.Response.UploadImage>
    >("/uploadImage", form, {
      headers: form.getHeaders(), // same as post: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  }

  /**
   * 使用此方法上传语音文件至服务器并返回 VoiceId
   * @param type 当前仅支持 "group"
   * @param voice 语音文件 fs.createReadStream(voice)
   */
  async uploadVoice(type: "friend" | "group" | "temp", voice: File) {
    const form = new FormData();
    form.append("sessionKey", this.sessionKey);
    form.append("type", type);
    form.append("voice", voice);
    const { data } = await this.axios.post<
      FormData,
      AxiosResponse<Api.Response.UploadVoice>
    >("/uploadVoice", form, {
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
  async recall(target: Api.Params.Recall["target"]) {
    let messageId = target;
    if (typeof target !== "number" && target.messageChain[0].id)
      messageId = target.messageChain[0].id;

    const { data } = await this.axios.post<
      Api.Params.Recall,
      AxiosResponse<Api.Response.BaseResponse>
    >("/recall", {
      sessionKey: this.sessionKey,
      target: messageId,
    });
    return data;
  }

  /**
   * 获取 bot 的好友列表
   */
  async friendList() {
    const { data } = await this.axios.get<
      Api.Params.BaseRequestParams,
      AxiosResponse<Api.Response.FriendList>
    >("/friendList", {
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
    const { data } = await this.axios.get<
      Api.Params.BaseRequestParams,
      AxiosResponse<Api.Response.GroupList>
    >("/groupList", {
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
    const { data } = await this.axios.get<
      Api.Params.RequestParams<{ target: number }>,
      AxiosResponse<Api.Response.MemberList>
    >("/memberList", {
      params: {
        sessionKey: this.sessionKey,
        target,
      },
    });
    return data;
  }

  /**
   * 此接口获取 session 绑定 bot 的详细资料
   * @returns
   */
  async botProfile(): Promise<UserProfile> {
    const { data } = await this.axios.get("/botProfile");
    return data;
  }

  /**
   * 此接口获取好友的详细资料
   * @returns
   */
  async friendProfile(): Promise<UserProfile> {
    const { data } = await this.axios.get("/friendProfile");
    return data;
  }

  /**
   * 此接口获取群成员的消息资料
   * @returns
   */
  async memberProfile(): Promise<UserProfile> {
    const { data } = await this.axios.get("/memberProfile");
    return data;
  }

  /**
   * 指定群进行全体禁言
   * @param target 指定群的群号
   */
  async muteAll(target: Api.Params.MuteAll["target"]) {
    const { data } = await this.axios.post<
      Api.Params.MuteAll,
      AxiosResponse<Api.Response.BaseResponse>
    >("/muteAll", {
      sessionKey: this.sessionKey,
      target,
    });
    return data;
  }

  /**
   * 指定群解除全体禁言
   * @param target 指定群的群号
   */
  async unmuteAll(target: Api.Params.UnmuteAll["target"]) {
    const { data } = await this.axios.post<
      Api.Params.UnmuteAll,
      AxiosResponse<Api.Response.BaseResponse>
    >("/unmuteAll", {
      sessionKey: this.sessionKey,
      target,
    });
    return data;
  }

  /**
   * 指定群禁言指定群员
   * @param target 指定群的群号
   * @param memberId 指定群员QQ号
   * @param time 禁言时长，单位为秒，最多30天，默认为 60 秒
   */
  async mute(target: number, memberId: number, time = 60) {
    const { data } = await this.axios.post<
      Api.Params.Mute,
      AxiosResponse<Api.Response.BaseResponse>
    >("/mute", {
      sessionKey: this.sessionKey,
      target,
      memberId,
      time,
    });
    return data;
  }

  /**
   * 指定群解除群成员禁言
   * @param target 指定群的群号
   * @param memberId 指定群员QQ号
   */
  async unmute(target: number, memberId: number) {
    const { data } = await this.axios.post<
      Api.Params.Unmute,
      AxiosResponse<Api.Response.BaseResponse>
    >("/unmute", {
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
    const { data } = await this.axios.post<
      Api.Params.Kick,
      AxiosResponse<Api.Response.BaseResponse>
    >("/kick", {
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
    const { data } = await this.axios.post<
      Api.Params.Quit,
      AxiosResponse<Api.Response.BaseResponse>
    >("/quit", {
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
      const { data } = await this.axios.post<
        Api.Params.GroupConfig,
        AxiosResponse<Api.Response.BaseResponse>
      >("/groupConfig", {
        sessionKey: this.sessionKey,
        target,
        config,
      });
      return data;
    } else {
      const { data } = await this.axios.get<
        Api.Params.GroupConfig,
        AxiosResponse<Config.GroupConfig>
      >("/groupConfig", {
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
   * @param target 指定群的群号
   * @param memberId 群员QQ号
   * @param info 群员资料
   */
  async memberInfo(
    target: number,
    memberId: number,
    info?: Api.Params.MemberInfo["info"]
  ) {
    if (info) {
      const { data } = await this.axios.post<
        Api.Params.MemberInfo,
        AxiosResponse<Api.Response.BaseResponse>
      >("/memberInfo", {
        sessionKey: this.sessionKey,
        target,
        memberId,
        info,
      });
      return data;
    } else {
      const { data } = await this.axios.get<
        Api.Params.MemberInfo,
        AxiosResponse<Config.MemberInfo>
      >("/memberInfo", {
        params: {
          sessionKey: this.sessionKey,
          target,
          memberId,
        },
      });
      return data;
    }
  }

  /**
   * 构建 WebSocket 通道
   * @param type
   */
  private _buildWsChannel<T extends "message" | "event" | "all">(
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
      const interval = setInterval(
        () => client.ping(),
        this.mirai.options.ws?.heartbeatInterval || 60000
      );
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
  async managers() {
    const { data } = await this.axios.get<null, AxiosResponse<number[]>>(
      "/managers",
      {
        params: {
          qq: this.qq,
        },
      }
    );
    return data;
  }

  /**
   * 设置群精华消息
   * @param target 消息ID
   */
  async setEssence(target: number) {
    const { data } = await this.axios.post<
      Api.Params.SetEssence,
      AxiosResponse<Api.Response.BaseResponse>
    >("/setEssence", {
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
    kind: Api.Params.SendNudge["kind"] = "Group"
  ) {
    const { data } = await this.axios.post<
      Api.Params.SendNudge,
      AxiosResponse<Api.Response.BaseResponse>
    >("/sendNudge", {
      sessionKey: this.sessionKey,
      target,
      subject,
      kind,
    });
    return data;
  }
}
