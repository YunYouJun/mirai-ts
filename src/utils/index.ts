/**
 * mirai-ts 自用的工具方法
 * @packageDocumentation
 */

import * as MessageType from "../types/message-type";

/**
 * 获取纯文本
 * 
 * > getPlain 已自动调用并挂载于 msg 上，你可以直接使用 msg.plain 获取纯文本内容，而无须调用 getPlain。
 * @param messageChain 消息链
 */
function getPlain(messageChain: MessageType.MessageChain) {
  let msg = "";
  messageChain.forEach((chain) => {
    if (chain.type === "Plain") msg += chain.text;
  });
  return msg;
}

export {
  getPlain
};
