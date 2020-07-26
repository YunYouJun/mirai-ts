/**
 * 导出一个 Mirai 类，具体见类的各个属性和方法。
 * @packageDocumentation
 */

import * as axios from "./axios";
import { AxiosStatic } from "axios";
import MiraiApiHttp from "./mirai-api-http";
import { MessageType, EventType, MiraiApiHttpConfig } from ".";
import log from "./utils/log";
import { getPlain } from "./utils";

type Listener = Map<MessageType.ChatMessageType | EventType.EventType, Function[]>;

type Data<T extends "message" | EventType.EventType | MessageType.ChatMessageType> =
  T extends EventType.EventType
  ? EventType.EventMap[T]
  : (T extends MessageType.ChatMessageType
    ? MessageType.ChatMessageMap[T]
    : MessageType.ChatMessage);

/**
 * Mirai SDK 初始化类
 */
export default class Mirai {
  /**
   * 封装 mirai-api-http 的固有方法
   */
  api: MiraiApiHttp;
  mahConfig: MiraiApiHttpConfig;
  /**
   * 请求工具
   */
  axios: AxiosStatic;
  /**
   * sessionKey 是使用以下方法必须携带的 sessionKey 使用前必须进行校验和绑定指定的Bot，每个 Session 只能绑定一个 Bot，但一个 Bot 可有多个Session。
   * sessionKey 在未进行校验的情况下，一定时间后将会被自动释放。
   */
  sessionKey: string;
  qq: number;
  /**
   * 是否验证成功
   */
  verified: boolean;
  /**
   * 监听者（回调函数）
   */
  listener: Listener;
  /**
   * 当前处理的信息
   */
  curMsg?: MessageType.ChatMessage | EventType.Event;
  constructor(
    mahConfig: MiraiApiHttpConfig = {
      host: "0.0.0.0",
      port: 8080,
      authKey: "el-psy-congroo",
      cacheSize: 4096,
      enableWebsocket: false,
      cors: ["*"],
    }
  ) {
    this.mahConfig = mahConfig;
    this.axios = axios.init(`http://${this.mahConfig.host}:${this.mahConfig.port}`);
    this.api = new MiraiApiHttp(this.mahConfig, this.axios);

    // default
    this.sessionKey = "";
    this.qq = 0;
    this.verified = false;

    this.listener = new Map();
  }

  /**
   * login 登录 QQ 号
   */
  async login(qq: number) {
    this.qq = qq;
    // Todo
    const { session } = await this.auth();
    this.sessionKey = session;
    return await this.verify();
  }

  /**
   * 获取 Session
   */
  auth() {
    return this.api.auth();
  }

  /**
   * 激活 Session，绑定 QQ
   */
  verify() {
    return this.api.verify(this.qq);
  }

  /**
   * 释放 Session
   */
  release() {
    return this.api.release();
  }

  /**
   * 绑定事件列表
   * message: FriendMessage | GroupMessage | TempMessage
   * [mirai-api-http事件类型一览](https://github.com/project-mirai/mirai-api-http/blob/master/EventType.md)
   * mirai.on('MemberMuteEvent', ()=>{})
   * @param type
   * @param callback
   */
  on<T extends "message" | EventType.EventType | MessageType.ChatMessageType>(type: T, callback: (data: Data<T>) => any) {
    // too complex for typescript so that in some case it cannot identify the type correctly
    // 说明监听所有
    if (type === 'message') {
      this.addListener('FriendMessage', callback as any);
      this.addListener('GroupMessage', callback as any);
      this.addListener('TempMessage', callback as any);
    } else {
      this.addListener<Exclude<T, "message">>(type as any, callback);
    }
  }

  /**
   * 添加监听者
   * @param type 
   * @param callback 
   */
  addListener<T extends EventType.EventType | MessageType.ChatMessageType>(type: T, callback: (data: Data<T>) => any) {
    const set = this.listener.get(type);
    if (set) {
      set.push(callback);
    } else {
      this.listener.set(type, [callback]);
    }
  }

  /**
   * 快速回复
   * @param msg 发送内容（消息链/纯文本皆可）
   * @param srcMsg 回复哪条消息
   * @param quote 是否引用回复
   */
  reply(
    msgChain: string | MessageType.MessageChain,
    srcMsg: MessageType.ChatMessage,
    quote = false
  ) {
    let messageId = 0;

    if (quote && srcMsg.messageChain[0].type === "Source") {
      messageId = srcMsg.messageChain[0].id;
    }

    if (srcMsg.type === "FriendMessage") {
      const target = srcMsg.sender.id;
      return this.api.sendFriendMessage(msgChain, target, messageId);
    } else if (srcMsg.type === "GroupMessage") {
      const target = srcMsg.sender.group.id;
      return this.api.sendGroupMessage(msgChain, target, messageId);
    }
  }

  /**
   * 为聊天消息类型挂载辅助函数
   * @param msg 
   */
  addHelperForMsg(msg: MessageType.ChatMessage) {
    msg.reply = async (
      msgChain: string | MessageType.MessageChain,
      quote = false
    ) => {
      this.reply(msgChain, msg, quote);
    };
    msg.plain = getPlain(msg.messageChain);
  }

  /**
   * 处理消息
   * @param msg 一条消息
   */
  handle(msg: MessageType.ChatMessage | EventType.Event) {
    this.curMsg = msg;
    const set = this.listener.get(msg.type);
    if (set) {
      set.forEach(callback => {
        if (
          msg.type === "FriendMessage" ||
          msg.type === "GroupMessage" ||
          msg.type === "TempMessage"
        ) {
          this.addHelperForMsg(msg);
        }
        callback(msg);
      });
    }
  }

  /**
   * 监听消息和事件
   * @param interval 拉起消息时间间隔，默认 200 ms，仅在未开启 Websocket 时有效
   */
  listen(interval: number = 200) {
    const address = this.mahConfig.host + ':' + this.mahConfig.port;
    if (this.mahConfig.enableWebsocket) {
      this.api.all((msg) => {
        this.handle(msg);
      });
    } else {
      log.info("开始监听: http://" + address);
      setInterval(async () => {
        const { data } = await this.api.fetchMessage();
        if (data && data.length) {
          data.forEach((msg) => {
            this.handle(msg);
          });
        }
      }, interval);
    }
  }
}
