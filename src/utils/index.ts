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

/**
 * 头像尺寸（允许传入的参数）
 */
export type AvatarSize = 1 | 2 | 3 | 4 | 5 | 40 | 100 | 140 | 640;

/**
 * 获取 QQ 头像链接
 * @param id
 * @param type 类型
 * @param size 尺寸 px (其他数字测试无法获得头像)
 * - 1: 40*40
 * - 2: 40*40
 * - 3: 100*100
 * - 4: 140*140
 * - 5: 640*640
 * - 40: 40*40
 * - 100: 100*100
 * @returns
 */
export function getAvatarById(
  id: number,
  type: "friend" | "group" = "friend",
  size: AvatarSize = 640
): string | null {
  let url = null;
  if (type === "friend") {
    url = `https://q1.qlogo.cn/g?b=qq&nk=${id}&s=${size}`;
  } else if (type === "group") {
    url = `https://p.qlogo.cn/gh/${id}/${id}/${size}`;
  }
  return url;
}
