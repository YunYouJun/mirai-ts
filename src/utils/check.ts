/**
 * 消息匹配辅助函数，提供了默认的几种匹配检测方式，可以直接导入使用。
 * @packageDocumentation
 */

import type { MessageType } from '../types/message-type'
import type * as EventType from '../types/event-type'

/**
 * 配置类型
 * @packageDocumentation
 */

/**
 * 正则表达式
 */
export interface Re {
  pattern: string
  flags?: string
}

/**
 * 匹配配置
 */
export interface Match {
  re?: Re | string
  is?: string | string[]
  includes?: string | string[]
}

// 匹配
/**
 * 匹配是否相同，当 keywords 为数组时，代表或，有一个相同即可
 * @param str 字符串
 * @param keywords 关键字
 */
export function is(str: string, keywords: string | string[]): boolean {
  if (Array.isArray(keywords))
    return keywords.includes(str)
  else return str === keywords
}

/**
 * 匹配是否包含，当 keywords 为数组时，代表同时包含
 * @param str 字符串
 * @param keywords  关键字
 */
export function includes(str: string, keywords: string | string[]): boolean {
  if (Array.isArray(keywords)) {
    return keywords.every((keyword) => {
      /**
       * 有 false 时跳出循环
       */
      return str.includes(keyword)
    })
  }
  else {
    return str.includes(keywords)
  }
}

/**
 * 正则匹配（存在时，返回匹配的情况，不存在时返回 false）
 * @param str 字符
 * @param config 正则配置，可以是包含 pattern，flags 的对象，也可以是字符串（直接代表 pattern）
 */
export function re(
  str: string,
  config: Re | string,
): RegExpMatchArray | boolean {
  let regExp = null
  if (typeof config === 'string')
    regExp = new RegExp(config)
  else regExp = new RegExp(config.pattern, config.flags || 'i')

  const result = regExp.exec(str)
  if (result && result[0])
    return result
  else return false
}

/**
 * 是否匹配
 * @param str 字符串
 * @param ans 回答的语法配置
 */
export function match(
  str: string,
  ans: Match,
): boolean | RegExpMatchArray | null {
  if (ans.re)
    return re(str, ans.re)
  if (ans.is)
    return is(str, ans.is)
  if (ans.includes)
    return includes(str, ans.includes)
  return false
}

// ------------
// helper
// 检测消息链
/**
 * 是否是聊天信息中的一种
 * ['FriendMessage', 'GroupMessage', 'TempMessage']
 * @param msg 消息链
 */
export function isChatMessage(
  msg: MessageType.ChatMessage | EventType.Event,
): msg is MessageType.ChatMessage {
  const msgType = ['FriendMessage', 'GroupMessage', 'TempMessage']
  return msgType.includes(msg.type)
}

/**
 * 是否被艾特
 * 传入 qq 时，返回是否被艾特
 * 未传入 qq 时，返回艾特消息
 * @param msg
 */
export function isAt(
  msg: MessageType.ChatMessage,
  qq?: number,
): boolean | MessageType.At {
  if (qq) {
    return msg.messageChain.some((singleMessage) => {
      return singleMessage.type === 'At' && singleMessage.target === qq
    })
  }
  else {
    let atMsg: MessageType.At | undefined
    msg.messageChain.some((singleMessage) => {
      if (singleMessage.type === 'At') {
        atMsg = singleMessage
        return true
      }
      return false
    })
    return atMsg || false
  }
}
