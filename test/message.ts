import { Message, MessageType } from "../src/index";

/**
 * 戳一戳消息
 * @param mirai
 */
export function getPokeMessage() {
  return [Message.Poke(MessageType.PokeName.Poke)];
}

/**
 * 音频消息
 * @param mirai
 */
export function getVoiceMessage() {
  return [Message.Voice(null, null, "adnd.amr")];
}
