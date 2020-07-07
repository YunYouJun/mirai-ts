/**
 * 导出一个 Mirai 类，具体见类的各个属性和方法。
 * @packageDocumentation
 */

import * as axios from "./axios";
import { AxiosStatic } from "axios";
import MiraiApiHttp from "./mirai-api-http";
import { MessageType, MiraiApiHttpConfig } from "..";
import Message from "./message";
import log from "./utils/log";

interface Listener {
  [propName: string]: Function[];
}

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
   * 当前处理的消息
   */
  curMsg: MessageType.SingleMessage;
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
    // ws todo

    this.axios = axios.init(`http://${this.mahConfig.host}:${this.mahConfig.port}`);
    this.api = new MiraiApiHttp(this.mahConfig, this.axios);

    // default
    this.sessionKey = "";
    this.qq = 0;
    this.verified = false;

    this.listener = {};
    this.curMsg = { type: "GroupMessage" };
  }

  /**
   * login 登录 QQ 号
   */
  async login(qq: number) {
    this.qq = qq;
    // Todo
    const { session } = await this.auth();
    this.sessionKey = session;
    await this.vertify();
    return "的美好";
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
  vertify() {
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
  on(type: string, callback: Function) {
    // 说明监听所有
    if (type === 'message') {
      this.addListener('FriendMessage', callback);
      this.addListener('GroupMessage', callback);
      this.addListener('TempMessage', callback);
    } else {
      this.addListener(type, callback);
    }
  }

  /**
   * 添加监听者
   * @param type 
   * @param callback 
   */
  addListener(type: string, callback: Function) {
    if (this.listener[type]) {
      this.listener[type].push(callback);
    } else {
      this.listener[type] = [callback];
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
    srcMsg: MessageType.SingleMessage,
    quote = false
  ) {
    let messageId = 0;

    if (quote && srcMsg.messageChain[0].type === "Source") {
      messageId = (srcMsg.messageChain[0] as MessageType.Source).id;
    }

    if (srcMsg.type === "FriendMessage") {
      const target = (srcMsg.sender as MessageType.FriendSender).id;
      return this.api.sendFriendMessage(msgChain, target, messageId);
    } else if (srcMsg.type === "GroupMessage") {
      const target = (srcMsg.sender as MessageType.GroupSender).group.id;
      return this.api.sendGroupMessage(msgChain, target, messageId);
    }
  }

  /**
   * 为聊天消息类型挂载辅助函数
   * @param msg 
   */
  addHelperForMsg(msg: MessageType.SingleMessage) {
    if (
      msg.type === "FriendMessage" ||
      msg.type === "GroupMessage" ||
      msg.type === "TempMessage"
    ) {
      msg.reply = async (
        msgChain: string | MessageType.MessageChain,
        quote = false
      ) => {
        this.reply(msgChain, msg as MessageType.ChatMessage, quote);
      };

      msg.plain = Message.getPlain(msg.messageChain);
    }
  }

  /**
   * 处理消息
   * @param msg 一条消息
   */
  handle(msg: MessageType.SingleMessage) {
    this.curMsg = msg;
    if (this.listener[msg.type]) {
      this.listener[msg.type].forEach(callback => {
        this.addHelperForMsg(msg);
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
      this.api.all((msg: MessageType.SingleMessage) => {
        this.handle(msg);
      });
    } else {
      log.info("开始监听: http://" + address);
      setInterval(async () => {
        const { data } = await this.api.fetchMessage();
        if (data && data.length) {
          data.forEach((msg: MessageType.SingleMessage) => {
            this.handle(msg);
          });
        }
      }, interval);
    }
  }
}
