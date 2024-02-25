/**
 * mirai-ts 内部 helper
 * @packageDocumentation
 */

import type { Mirai } from './mirai'

import { getPlain } from './utils/internal'
import { isAt, isChatMessage } from './utils/check'

import type {
  BotInvitedJoinGroupRequestOperationType,
  MemberJoinRequestOperationType,
  NewFriendRequestOperationType,
} from './mirai-api-http/resp'
import type { MessageType } from './types/message-type'
import type { EventType } from '.'

/**
 * 为消息和事件类型挂载辅助函数
 */
export function createHelperForMsg(
  mirai: Mirai,
  msg: MessageType.ChatMessage | EventType.Event,
) {
  mirai.curMsg = msg

  // 消息类型添加直接获取消息内容的参数
  if (isChatMessage(msg)) {
    msg.plain = getPlain(msg.messageChain)

    if (msg.type === 'GroupMessage') {
      // 添加判断是否被艾特的辅助函数
      msg.isAt = (qq?: number) => {
        return isAt(msg, qq || mirai.qq) as boolean
      }
    }

    // 语法糖
    msg.group = (...groupIds) => {
      return groupIds.includes(
        (msg as MessageType.GroupMessage).sender.group.id,
      )
    }
    msg.friend = (...qqs) => {
      return qqs.includes(msg.sender.id)
    }

    msg.get = (type) => {
      let curSingleMessage: MessageType.SingleMessage | null = null
      msg.messageChain.some((singleMessage) => {
        if (singleMessage.type === type) {
          curSingleMessage = singleMessage
          return true
        }
        return false
      })
      return curSingleMessage
    }
  }

  // 为各类型添加 reply 辅助函数
  (msg as any).reply = async (
    msgChain: string | MessageType.MessageChain,
    quote = false,
  ) => {
    return mirai.reply(msgChain, msg, quote)
  }

  // 为请求类事件添加 respond 辅助函数
  if (msg.type === 'NewFriendRequestEvent') {
    msg.respond = async (
      operate: NewFriendRequestOperationType,
      message?: string,
    ) => {
      return mirai.api.resp.newFriendRequest(msg, operate, message)
    }
  }
  else if (msg.type === 'MemberJoinRequestEvent') {
    msg.respond = async (
      operate: MemberJoinRequestOperationType,
      message?: string,
    ) => {
      return mirai.api.resp.memberJoinRequest(msg, operate, message)
    }
  }
  else if (msg.type === 'BotInvitedJoinGroupRequestEvent') {
    msg.respond = async (
      operate: BotInvitedJoinGroupRequestOperationType,
      message?: string,
    ) => {
      return mirai.api.resp.botInvitedJoinGroupRequest(msg, operate, message)
    }
  }
}
