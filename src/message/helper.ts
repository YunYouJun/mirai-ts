import * as MessageType from "../types/message-type";
import * as EventType from "../types/event-type";

/**
 * 获取纯文本
 * @param messageChain 消息链
 */
function getPlain(messageChain: MessageType.SingleMessage[]) {
  let msg = "";
  messageChain.forEach((chain) => {
    if (chain.type === "Plain") msg += chain.text;
  });
  return msg;
}

/**
 * 是否是文本信息中的一种
 * ['FriendMessage', 'GroupMessage', 'TempMessage']
 * @param msg 消息链
 */
function isMessage(msg: MessageType.ChatMessage | EventType.Event): msg is MessageType.ChatMessage {
  const msgType = ['FriendMessage', 'GroupMessage', 'TempMessage'];
  return msgType.includes(msg.type);
}

/**
 * 是否被艾特
 * 传入 qq 时，返回是否被艾特
 * 未传入 qq 时，返回艾特消息
 * @param msg 
 */
function isAt(msg: MessageType.ChatMessage, qq?: number): boolean | MessageType.At | undefined {
  if (qq) {
    return msg.messageChain.some((singleMessage) => {
      return (singleMessage.type === "At" && singleMessage.target === qq);
    });
  } else {
    let atMsg: MessageType.At | undefined = undefined;
    msg.messageChain.some((singleMessage) => {
      if (singleMessage.type === 'At') {
        atMsg = singleMessage;
        return true;
      }
    });
    return atMsg;
  }
}

// helper
export {
  getPlain,
  isMessage,
  isAt,
};
