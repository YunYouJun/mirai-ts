/**
 * 事件类型，与 [mirai-api-http 事件类型一览](https://github.com/project-mirai/mirai-api-http/blob/master/docs/EventType.md) 保持一致
 * @packageDocumentation
 */

import type {
  BotInvitedJoinGroupRequestOperationType,
  MemberJoinRequestOperationType,
  NewFriendRequestOperationType,
} from '../mirai-api-http/resp'
import type { Api } from '../index'
import type * as Contact from './contact'
import type { MessageType } from './message-type'

/**
 * 内部基类
 */
export interface BaseEvent {
  type: string
  /**
   * reply 辅助函数
   */
  reply?: (msgChain: string | MessageType.MessageChain, quote?: boolean) => Promise<void>
}

/**
 * Bot 登录成功
 */
export interface BotOnlineEvent extends BaseEvent {
  type: 'BotOnlineEvent'
  qq: number
}

/**
 * Bot 主动离线
 */
export interface BotOfflineEventActive extends BaseEvent {
  type: 'BotOfflineEventActive'
  qq: number
}

/**
 * Bot被挤下线
 */
export interface BotOfflineEventForce extends BaseEvent {
  type: 'BotOfflineEventForce'
  qq: number
}

/**
 * Bot被服务器断开或因网络问题而掉线
 */
export interface BotOfflineEventDropped extends BaseEvent {
  type: 'BotOfflineEventDropped'
  qq: number
}

/**
 * Bot主动重新登录.
 */
export interface BotReloginEvent extends BaseEvent {
  type: 'BotReloginEvent'
  qq: number
}

/**
 * 群消息撤回
 */
export interface GroupRecallEvent extends BaseEvent {
  type: 'GroupRecallEvent'
  authorId: number
  messageId: number
  time: number
  group: Contact.Group
  operator: Contact.Member | null
}

/**
 * 好友消息撤回
 */
export interface FriendRecallEvent extends BaseEvent {
  type: 'FriendRecallEvent'
  authorId: number
  messageId: number
  time: number
  operator: number
}

/**
 * Bot在群里的权限被改变. 操作人一定是群主
 */
export interface BotGroupPermissionChangeEvent extends BaseEvent {
  type: 'BotGroupPermissionChangeEvent'
  origin: Contact.Permission
  current: Contact.Permission
  group: Contact.Group
}

/**
 * Bot被禁言
 */
export interface BotMuteEvent extends BaseEvent {
  type: 'BotMuteEvent'
  durationSeconds: number
  operator: Contact.Member
}

/**
 * Bot被取消禁言
 */
export interface BotUnmuteEvent extends BaseEvent {
  type: 'BotUnmuteEvent'
  operator: Contact.Member
}

/**
 * Bot加入了一个新群
 */
export interface BotJoinGroupEvent extends BaseEvent {
  type: 'BotJoinGroupEvent'
  group: Contact.Group
}

/**
 * Bot主动退出一个群
 */
export interface BotLeaveEventActive extends BaseEvent {
  type: 'BotLeaveEventActive'
  group: Contact.Group
}

/**
 * Bot被踢出一个群
 */
export interface BotLeaveEventKick extends BaseEvent {
  type: 'BotLeaveEventKick'
  group: Contact.Group
}

/**
 * 某个群名改变
 */
export interface GroupNameChangeEvent extends BaseEvent {
  type: 'GroupNameChangeEvent'
  origin: string
  current: string
  group: Contact.Group
  operator: Contact.Member | null
}

/**
 * 某群入群公告改变
 */
export interface GroupEntranceAnnouncementChangeEvent extends BaseEvent {
  type: 'GroupEntranceAnnouncementChangeEvent'
  origin: string
  current: string
  group: Contact.Group
  operator: Contact.Member | null
}

/**
 * 全员禁言
 */
export interface GroupMuteAllEvent extends BaseEvent {
  type: 'GroupMuteAllEvent'
  origin: boolean
  current: boolean
  group: Contact.Group
  operator: Contact.Member | null
}

/**
 * 匿名聊天
 */
export interface GroupAllowAnonymousChatEvent extends BaseEvent {
  type: 'GroupAllowAnonymousChatEvent'
  origin: boolean
  current: boolean
  group: Contact.Group
  operator: Contact.Member | null
}

/**
 * 坦白说
 */
export interface GroupAllowConfessTalkEvent extends BaseEvent {
  type: 'GroupAllowConfessTalkEvent'
  origin: boolean
  current: boolean
  group: Contact.Member
  isByBot: boolean
}

/**
 * 允许群员邀请好友加群
 */
export interface GroupAllowMemberInviteEvent extends BaseEvent {
  type: 'GroupAllowMemberInviteEvent'
  origin: boolean
  current: boolean
  group: Contact.Group
  operator: Contact.Member | null
}

/**
 * 新人入群的事件
 */
export interface MemberJoinEvent extends BaseEvent {
  type: 'MemberJoinEvent'
  member: Contact.Member
}

/**
 * 成员被踢出群（该成员不是Bot）
 */
export interface MemberLeaveEventKick extends BaseEvent {
  type: 'MemberLeaveEventKick'
  member: Contact.Member
  operator: Contact.Member | null
}

/**
 * 成员主动离群（该成员不是Bot）
 */
export interface MemberLeaveEventQuit extends BaseEvent {
  type: 'MemberLeaveEventQuit'
  member: Contact.Member
}

/**
 * 群名片改动
 */
export interface MemberCardChangeEvent extends BaseEvent {
  type: 'MemberCardChangeEvent'
  origin: string
  current: string
  member: Contact.Member
  operator: Contact.Member | null
}

/**
 * 群头衔改动（只有群主有操作限权）
 */
export interface MemberSpecialTitleChangeEvent extends BaseEvent {
  type: 'MemberSpecialTitleChangeEvent'
  origin: string
  current: string
  member: Contact.Member
}

/**
 * 成员权限改变的事件（该成员不可能是Bot，见 BotGroupPermissionChangeEvent）
 */
export interface MemberPermissionChangeEvent extends BaseEvent {
  type: 'MemberPermissionChangeEvent'
  origin: Contact.Permission
  current: Contact.Permission
  member: Contact.Member
}

/**
 * 群成员被禁言事件（该成员不可能是Bot，见 BotMuteEvent）
 */
export interface MemberMuteEvent extends BaseEvent {
  type: 'MemberMuteEvent'
  durationSeconds: number
  member: Contact.Member
  operator: Contact.Member | null
}

/**
 * 群成员被取消禁言事件（该成员不可能是Bot，见 BotUnmuteEvent）
 */
export interface MemberUnmuteEvent extends BaseEvent {
  type: 'MemberUnmuteEvent'
  member: Contact.Member
  operator: Contact.Member | null
}

/**
 * 基础请求事件格式
 */
interface BaseRequestEvent extends BaseEvent {
  /**
   * 事件标识，响应该事件时的标识
   */
  eventId: number
}

/**
 * 添加好友申请
 */
export interface NewFriendRequestEvent extends BaseRequestEvent {
  type: 'NewFriendRequestEvent'
  /**
   * 申请人QQ号
   */
  fromId: number
  /**
   * 申请人如果通过某个群添加好友，该项为该群群号；否则为 0
   */
  groupId: number
  /**
   * 申请人的昵称或群名片
   */
  nick: string
  /**
   * 申请消息
   */
  message: string
  respond: (
    operate: NewFriendRequestOperationType,
    message?: string
  ) => Promise<Api.Response.NewFriendRequestEvent>
}

/**
 * 用户入群申请（Bot需要有管理员权限）
 */
export interface MemberJoinRequestEvent extends BaseRequestEvent {
  type: 'MemberJoinRequestEvent'
  /**
   * 申请人 QQ号
   */
  fromId: number
  /**
   * 申请人申请入群的群号
   */
  groupId: number
  /**
   * 申请人申请入群的群名称
   */
  groupName: string
  /**
   * 申请人的昵称或群名片
   */
  nick: string
  /**
   * 申请消息
   */
  message: string
  respond: (
    operate: MemberJoinRequestOperationType,
    message?: string
  ) => Promise<Api.Response.MemberJoinRequestEvent>
}

/**
 * Bot被邀请入群申请
 */
export interface BotInvitedJoinGroupRequestEvent extends BaseRequestEvent {
  type: 'BotInvitedJoinGroupRequestEvent'
  /**
   * 邀请人（好友）的 QQ号
   */
  fromId: number
  /**
   * 被邀请进入群的群号
   */
  groupId: number
  /**
   * 被邀请进入群的群名称
   */
  groupName: string
  /**
   * 邀请人（好友）的昵称
   */
  nick: string
  /**
   * 邀请消息
   */
  message: string
  respond: (
    operate: BotInvitedJoinGroupRequestOperationType,
    message?: string
  ) => Promise<Api.Response.BotInvitedJoinGroupRequestEvent>
}

export type RequestEvent =
  | NewFriendRequestEvent
  | MemberJoinRequestEvent
  | BotInvitedJoinGroupRequestEvent

export type RequestEventType = RequestEvent['type']

export interface NudgeEvent extends BaseEvent {
  type: 'NudgeEvent'
  /**
   * 戳一戳发起人 QQ 号
   */
  fromId: number
  /**
   * 被戳人的 QQ 号
   */
  target: number
  /**
   * 动作，如：戳一戳
   */
  action: string
  /**
   * 后缀，如：脸
   */
  suffix: string
  /**
   * 戳一戳事件发生的主体 (上下文)
   */
  subject: {
    /**
     * 事件发生主体的 ID (群号 / 好友 QQ 号)
     */
    id: number
    /**
     * 戳一戳事件发生的主体的类型
     */
    kind: 'Friend' | 'Group'
  }
}

export interface CommandExecutedEvent extends BaseEvent {
  type: 'CommandExecutedEvent'
  /**
   * 命令名称
   */
  name: string
  /**
   * 发送命令的好友, 从控制台发送为 null
   */
  friend: Contact.Friend | null
  /**
   * 发送命令的群成员, 从控制台发送为 null
   */
  member: Contact.Member | null
  /**
   * 指令的参数, 以消息类型传递
   */
  args: MessageType.MessageChain
  reply?: undefined
}

export interface EventMap {
  BotOnlineEvent: BotOnlineEvent
  BotOfflineEventActive: BotOfflineEventActive
  BotOfflineEventForce: BotOfflineEventForce
  BotOfflineEventDropped: BotOfflineEventDropped
  BotReloginEvent: BotReloginEvent
  GroupRecallEvent: GroupRecallEvent
  FriendRecallEvent: FriendRecallEvent
  BotGroupPermissionChangeEvent: BotGroupPermissionChangeEvent
  BotMuteEvent: BotMuteEvent
  BotUnmuteEvent: BotUnmuteEvent
  BotJoinGroupEvent: BotJoinGroupEvent
  BotLeaveEventActive: BotLeaveEventActive
  BotLeaveEventKick: BotLeaveEventKick
  GroupNameChangeEvent: GroupNameChangeEvent
  GroupEntranceAnnouncementChangeEvent: GroupEntranceAnnouncementChangeEvent
  GroupMuteAllEvent: GroupMuteAllEvent
  GroupAllowAnonymousChatEvent: GroupAllowAnonymousChatEvent
  GroupAllowConfessTalkEvent: GroupAllowConfessTalkEvent
  GroupAllowMemberInviteEvent: GroupAllowMemberInviteEvent
  MemberJoinEvent: MemberJoinEvent
  MemberLeaveEventKick: MemberLeaveEventKick
  MemberLeaveEventQuit: MemberLeaveEventQuit
  MemberCardChangeEvent: MemberCardChangeEvent
  MemberSpecialTitleChangeEvent: MemberSpecialTitleChangeEvent
  MemberPermissionChangeEvent: MemberPermissionChangeEvent
  MemberMuteEvent: MemberMuteEvent
  MemberUnmuteEvent: MemberUnmuteEvent
  // 请求事件
  NewFriendRequestEvent: NewFriendRequestEvent
  MemberJoinRequestEvent: MemberJoinRequestEvent
  BotInvitedJoinGroupRequestEvent: BotInvitedJoinGroupRequestEvent

  NudgeEvent: NudgeEvent

  // 命令事件
  CommandExecutedEvent: CommandExecutedEvent
}

// string union of event type
export type EventType = keyof EventMap
export type Event = EventMap[EventType]
