/**
 * mirai-ts 内部自用的工具方法（不导出）
 * @packageDocumentation
 */

import * as MessageType from "../types/message-type";

/**
 * 获取纯文本
 *
 * > getPlain 已自动调用并挂载于 msg 上，你可以直接使用 msg.plain 获取纯文本内容，而无须调用 getPlain。
 * @param messageChain 消息链
 */
export function getPlain(messageChain: MessageType.MessageChain) {
  let msg = "";
  messageChain.forEach((chain) => {
    if (chain.type === "Plain") msg += chain.text;
  });
  return msg;
}

/**
 * 分离文本
 * @param text
 */
export function splitText(text: string): string[] {
  const sections = [];
  if (text.length < 900) {
    sections.push(text);
  } else {
    const number = Math.ceil(text.length / 800);
    for (let i = 0; i < number; i++) {
      const section = text.slice(i * 800, (i + 1) * 800);
      sections.push(section);
    }
  }
  return sections;
}
