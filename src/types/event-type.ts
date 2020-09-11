/**
 * 事件类型，与 [Mirai-api-http 事件类型一览](https://github.com/project-mirai/mirai-api-http/blob/master/EventType.md) 保持一致
 * @packageDocumentation
 */

import * as Contact from "./contact";
import { MessageChain } from "./message-type";
import { RequestEventOperation } from "../mirai-api-http/resp";

/**
 * 内部基类
 */
export interface BaseEvent {
  type: string;
  /**
   * reply 辅助函数
   */
  reply?: (msgChain: string | MessageChain, quote?: boolean) => Promise<void>;
}

/**
 * Bot 登录成功
 */
export interface BotOnlineEvent extends BaseEvent {
  type: "BotOnlineEvent";
  qq: number;
}

/**
 * Bot 主动离线
 */
export interface BotOfflineEventActive extends BaseEvent {
  type: "BotOfflineEventActive";
  qq: number;
}

/**
 * Bot被挤下线
 */
export interface BotOfflineEventForce extends BaseEvent {
  type: "BotOfflineEventForce";
  qq: number;
}

/**
 * Bot被服务器断开或因网络问题而掉线
 */
export interface BotOfflineEventDropped extends BaseEvent {
  type: "BotOfflineEventDropped";
  qq: number;
}

/**
 * Bot主动重新登录.
 */
export interface BotReloginEvent extends BaseEvent {
  type: "BotReloginEvent";
  qq: number;
}

/**
 * 群消息撤回
 */
export interface GroupRecallEvent extends BaseEvent {
  type: "GroupRecallEvent";
  authorId: number;
  messageId: number;
  time: number;
  group: Contact.Group;
  operator: Contact.Member | null;
}

/**
 * 好友消息撤回
 */
export interface FriendRecallEvent extends BaseEvent {
  type: "FriendRecallEvent";
  authorId: number;
  messageId: number;
  time: number;
  operator: number;
}

/**
 * Bot在群里的权限被改变. 操作人一定是群主
 */
export interface BotGroupPermissionChangeEvent extends BaseEvent {
  type: "BotGroupPermissionChangeEvent";
  origin: Contact.Permission;
  current: Contact.Permission;
  group: Contact.Group;
}

/**
 * Bot被禁言
 */
export interface BotMuteEvent extends BaseEvent {
  type: "BotMuteEvent";
  durationSeconds: number;
  operator: Contact.Member;
}

/**
 * Bot被取消禁言
 */
export interface BotUnmuteEvent extends BaseEvent {
  type: "BotUnmuteEvent";
  operator: Contact.Member;
}

/**
 * Bot加入了一个新群
 */
export interface BotJoinGroupEvent extends BaseEvent {
  type: "BotJoinGroupEvent";
  group: Contact.Group;
}

/**
 * Bot主动退出一个群
 */
export interface BotLeaveEventActive extends BaseEvent {
  type: "BotLeaveEventActive";
  group: Contact.Group;
}

/**
 * Bot被踢出一个群
 */
export interface BotLeaveEventKick extends BaseEvent {
  type: "BotLeaveEventKick";
  group: Contact.Group;
}

/**
 * 某个群名改变
 */
export interface GroupNameChangeEvent extends BaseEvent {
  type: "GroupNameChangeEvent";
  origin: string;
  current: string;
  group: Contact.Group;
  operator: Contact.Member | null;
}

/**
 * 某群入群公告改变
 */
export interface GroupEntranceAnnouncementChangeEvent extends BaseEvent {
  type: "GroupEntranceAnnouncementChangeEvent";
  origin: string;
  current: string;
  group: Contact.Group;
  operator: Contact.Member | null;
}

/**
 * 全员禁言
 */
export interface GroupMuteAllEvent extends BaseEvent {
  type: "GroupMuteAllEvent";
  origin: boolean;
  current: boolean;
  group: Contact.Group;
  operator: Contact.Member | null;
}

/**
 * 匿名聊天
 */
export interface GroupAllowAnonymousChatEvent extends BaseEvent {
  type: "GroupAllowAnonymousChatEvent";
  origin: boolean;
  current: boolean;
  group: Contact.Group;
  operator: Contact.Member | null;
}

/**
 * 坦白说
 */
export interface GroupAllowConfessTalkEvent extends BaseEvent {
  type: "GroupAllowConfessTalkEvent";
  origin: boolean;
  current: boolean;
  group: Contact.Member;
  isByBot: boolean;
}

/**
 * 允许群员邀请好友加群
 */
export interface GroupAllowMemberInviteEvent extends BaseEvent {
  type: "GroupAllowMemberInviteEvent";
  origin: boolean;
  current: boolean;
  group: Contact.Group;
  operator: Contact.Member | null;
}

/**
 * 新人入群的事件
 */
export interface MemberJoinEvent extends BaseEvent {
  type: "MemberJoinEvent";
  member: Contact.Member;
}

/**
 * 成员被踢出群（该成员不是Bot）
 */
export interface MemberLeaveEventKick extends BaseEvent {
  type: "MemberLeaveEventKick";
  member: Contact.Member;
  operator: Contact.Member | null;
}

/**
 * 成员主动离群（该成员不是Bot）
 */
export interface MemberLeaveEventQuit extends BaseEvent {
  type: "MemberLeaveEventQuit";
  member: Contact.Member;
}

/**
 * 群名片改动
 */
export interface MemberCardChangeEvent extends BaseEvent {
  type: "MemberCardChangeEvent";
  origin: string;
  current: string;
  member: Contact.Member;
  operator: Contact.Member | null;
}

/**
 * 群头衔改动（只有群主有操作限权）
 */
export interface MemberSpecialTitleChangeEvent extends BaseEvent {
  type: "MemberSpecialTitleChangeEvent";
  origin: string;
  current: string;
  member: Contact.Member;
}

/**
 * 成员权限改变的事件（该成员不可能是Bot，见 BotGroupPermissionChangeEvent）
 */
export interface MemberPermissionChangeEvent extends BaseEvent {
  type: "MemberPermissionChangeEvent";
  origin: Contact.Permission;
  current: Contact.Permission;
  member: Contact.Member;
}

/**
 * 群成员被禁言事件（该成员不可能是Bot，见 BotMuteEvent）
 */
export interface MemberMuteEvent extends BaseEvent {
  type: "MemberMuteEvent";
  durationSeconds: number;
  member: Contact.Member;
  operator: Contact.Member | null;
}

/**
 * 群成员被取消禁言事件（该成员不可能是Bot，见 BotUnmuteEvent）
 */
export interface MemberUnmuteEvent extends BaseEvent {
  type: "MemberUnmuteEvent";
  member: Contact.Member;
  operator: Contact.Member | null;
}

/**
 * 添加好友申请
 */
export interface NewFriendRequestEvent extends BaseRequestEvent {
  type: "NewFriendRequestEvent";
  eventId: number;
  fromId: number;
  groupId: number;
  nick: string;
  message: string;
}

/**
 * 用户入群申请（Bot需要有管理员权限）
 */
export interface MemberJoinRequestEvent extends BaseRequestEvent {
  type: "MemberJoinRequestEvent";
  eventId: number;
  fromId: number;
  groupId: number;
  groupName: string;
  nick: string;
  message: string;
}

/**
 * Bot被邀请入群申请
 */
export interface BotInvitedJoinGroupRequestEvent extends BaseRequestEvent {
  type: "BotInvitedJoinGroupRequestEvent";
  eventId: number;
  fromId: number;
  groupId: number;
  groupName: string;
  nick: string;
  message: string;
}

interface BaseRequestEvent extends BaseEvent {
  type: any;
  respond: (
    operate: RequestEventOperation<this["type"]>,
    message?: string
  ) => Promise<void>;
}

export type RequestEvent =
  | NewFriendRequestEvent
  | MemberJoinRequestEvent
  | BotInvitedJoinGroupRequestEvent;

export type Event =
  | BotOnlineEvent
  | BotOfflineEventActive
  | BotOfflineEventForce
  | BotOfflineEventDropped
  | BotReloginEvent
  | GroupRecallEvent
  | FriendRecallEvent
  | BotGroupPermissionChangeEvent
  | BotMuteEvent
  | BotUnmuteEvent
  | BotJoinGroupEvent
  | BotLeaveEventActive
  | BotLeaveEventKick
  | GroupNameChangeEvent
  | GroupEntranceAnnouncementChangeEvent
  | GroupMuteAllEvent
  | GroupAllowAnonymousChatEvent
  | GroupAllowConfessTalkEvent
  | GroupAllowMemberInviteEvent
  | MemberJoinEvent
  | MemberLeaveEventKick
  | MemberLeaveEventQuit
  | MemberCardChangeEvent
  | MemberSpecialTitleChangeEvent
  | MemberPermissionChangeEvent
  | MemberMuteEvent
  | MemberUnmuteEvent
  | NewFriendRequestEvent
  | MemberJoinRequestEvent
  | BotInvitedJoinGroupRequestEvent;

export type EventType = Event["type"];

export type EventMap = {
  BotOnlineEvent: BotOnlineEvent;
  BotOfflineEventActive: BotOfflineEventActive;
  BotOfflineEventForce: BotOfflineEventForce;
  BotOfflineEventDropped: BotOfflineEventDropped;
  BotReloginEvent: BotReloginEvent;
  GroupRecallEvent: GroupRecallEvent;
  FriendRecallEvent: FriendRecallEvent;
  BotGroupPermissionChangeEvent: BotGroupPermissionChangeEvent;
  BotMuteEvent: BotMuteEvent;
  BotUnmuteEvent: BotUnmuteEvent;
  BotJoinGroupEvent: BotJoinGroupEvent;
  BotLeaveEventActive: BotLeaveEventActive;
  BotLeaveEventKick: BotLeaveEventKick;
  GroupNameChangeEvent: GroupNameChangeEvent;
  GroupEntranceAnnouncementChangeEvent: GroupEntranceAnnouncementChangeEvent;
  GroupMuteAllEvent: GroupMuteAllEvent;
  GroupAllowAnonymousChatEvent: GroupAllowAnonymousChatEvent;
  GroupAllowConfessTalkEvent: GroupAllowConfessTalkEvent;
  GroupAllowMemberInviteEvent: GroupAllowMemberInviteEvent;
  MemberJoinEvent: MemberJoinEvent;
  MemberLeaveEventKick: MemberLeaveEventKick;
  MemberLeaveEventQuit: MemberLeaveEventQuit;
  MemberCardChangeEvent: MemberCardChangeEvent;
  MemberSpecialTitleChangeEvent: MemberSpecialTitleChangeEvent;
  MemberPermissionChangeEvent: MemberPermissionChangeEvent;
  MemberMuteEvent: MemberMuteEvent;
  MemberUnmuteEvent: MemberUnmuteEvent;
  NewFriendRequestEvent: NewFriendRequestEvent;
  MemberJoinRequestEvent: MemberJoinRequestEvent;
  BotInvitedJoinGroupRequestEvent: BotInvitedJoinGroupRequestEvent;
};
