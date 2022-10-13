import type * as Config from '../config'
import type { MessageType } from '../message-type'

export interface BaseRequestParams {
  sessionKey: string
}

export type RequestParams<T> = T & BaseRequestParams

/**
 * 基础的发送消息格式
 */
export type SendMessage = RequestParams<{
  target: number
  messageChain: MessageType.MessageChain
}>

/**
 * 发送好友消息的请求格式
 */
export interface SendFriendMessage extends SendMessage {
  quote?: number
}

export interface SendGroupMessage extends SendMessage {
  quote?: number
}

export type SendTempMessage = RequestParams<{
  messageChain: MessageType.MessageChain
  qq: number
  group: number
  quote?: number
}>

export type SendImageMessage = RequestParams<{
  urls: string[]
  target?: number
  qq?: number
  group?: number
}>

export type Recall = RequestParams<{
  /**
   * 好友id或群id
   */
  target: number
  messageId: number
}>

export type Unmute = RequestParams<{
  target: number
  memberId: number
}>

export interface Mute extends Unmute {
  time: number
}

export type MuteAll = RequestParams<{
  target: number
}>

export type UnmuteAll = MuteAll

export type Kick = RequestParams<{
  target: number
  memberId: number
  msg: string
}>

export type Quit = MuteAll

export type GroupConfig = RequestParams<{
  target: number
  config?: Config.GroupConfig
}>

export type MemberInfo = RequestParams<{
  target: number
  memberId: number
  info?: Config.MemberInfo
}>

export type SetEssence = RequestParams<{
  target: number
}>

export type SendNudge = RequestParams<{
  target: number
  subject: number
  kind: 'Friend' | 'Group' | 'Stranger'
}>

// file

export type GroupFileRename = RequestParams<{
  target: number
  id: string
  rename: string
}>

export type GroupMkdir = RequestParams<{
  group: number
  dir: string
}>

export type GroupFileMove = RequestParams<{
  target: number
  id: string
  movePath: string
}>
