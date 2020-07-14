import { MessageType } from "./message-type";
import { EventType } from '..';
export namespace Api {
  interface SendMessage {
    sessionKey: string;
    target: number;
    messageChain: MessageType.MessageChain;
  }

  /**
   * 发送好友消息的请求格式
   */
  interface SendFriendMessage extends SendMessage {
    quote?: number;
  }

  interface SendGroupMessage extends SendMessage {
    quote?: number;
  }

  interface SendTempMessage {
    sessionKey: string;
    messageChain: MessageType.MessageChain;
    qq: number;
    group: number;
    quote?: number;
  }

  namespace Response {
    interface fetchMessage {
      code: number;
      data: (MessageType.MessageEvent | EventType.Event)[];
    }

    interface sendMessage {
      code: number;
      msg: string;
      /**
       * 一个Int类型属性，标识本条消息，用于撤回和引用回复
       */
      messageId: number;
    }
  }
}
