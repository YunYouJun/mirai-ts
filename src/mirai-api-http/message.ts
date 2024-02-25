import type { MessageType } from '../types/message-type'
import * as Message from '../message'

/**
 * 转化为标准的 MessageChain
 */
export function toMessageChain(
  messageChain: string | MessageType.SingleMessage | MessageType.MessageChain,
): MessageType.MessageChain {
  if (typeof messageChain === 'string')
    messageChain = [Message.Plain(messageChain)]
  else if (!Array.isArray(messageChain))
    messageChain = [messageChain]

  return messageChain
}
