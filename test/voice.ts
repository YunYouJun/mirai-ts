import Mirai, { Message } from "../src/index";

const groupId = 120117362;

/**
 * 发送音频文件
 * @param mirai
 */
export function sendVoiceMessage(mirai: Mirai) {
  const messageChain = [Message.Voice(null, null, "adnd.amr")];
  mirai.api.sendGroupMessage(messageChain, groupId);
}
