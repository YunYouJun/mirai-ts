import { Message, MessageType } from '../src/index'

/**
 * 戳一戳消息
 */
export function getPokeMessage() {
  return [Message.Poke(MessageType.PokeName.Poke)]
}

/**
 * 音频消息
 */
export function getVoiceMessage() {
  return [Message.Voice(null, null, 'adnd.amr')]
}
