import { AnyEvent } from "ts-events";
import * as IEvent from "./types/event-type";
import { ChatMessageMap } from "./types/message-type";

export class EventEmtter {
  /**
   * Bot 登录成功
   */
  BotOnlineEvent = new AnyEvent<IEvent.BotOnlineEvent>();

  /**
   * Bot 主动离线
   */
  BotOfflineEventActive = new AnyEvent<IEvent.BotOfflineEventActive>();

  /**
   * Bot被挤下线
   */
  BotOfflineEventForce = new AnyEvent<IEvent.BotOfflineEventForce>();

  /**
   * Bot被服务器断开或因网络问题而掉线
   */
  BotOfflineEventDropped = new AnyEvent<IEvent.BotOfflineEventDropped>();

  /**
   * Bot主动重新登录.
   */
  BotReloginEvent = new AnyEvent<IEvent.BotReloginEvent>();

  /**
   * 群消息撤回
   */
  GroupRecallEvent = new AnyEvent<IEvent.GroupRecallEvent>();

  /**
   * 好友消息撤回
   */
  FriendRecallEvent = new AnyEvent<IEvent.FriendRecallEvent>();

  /**
   * Bot在群里的权限被改变. 操作人一定是群主
   */
  BotGroupPermissionChangeEvent = new AnyEvent<IEvent.BotGroupPermissionChangeEvent>();

  /**
   * Bot被禁言
   */
  BotMuteEvent = new AnyEvent<IEvent.BotMuteEvent>();

  /**
   * Bot被取消禁言
   */
  BotUnmuteEvent = new AnyEvent<IEvent.BotUnmuteEvent>();

  /**
   * Bot加入了一个新群
   */
  BotJoinGroupEvent = new AnyEvent<IEvent.BotJoinGroupEvent>();

  /**
   * Bot主动退出一个群
   */
  BotLeaveEventActive = new AnyEvent<IEvent.BotLeaveEventActive>();

  /**
   * Bot被踢出一个群
   */
  BotLeaveEventKick = new AnyEvent<IEvent.BotLeaveEventKick>();

  /**
   * 某个群名改变
   */
  GroupNameChangeEvent = new AnyEvent<IEvent.GroupNameChangeEvent>();

  /**
   * 某群入群公告改变
   */
  GroupEntranceAnnouncementChangeEvent = new AnyEvent<IEvent.GroupEntranceAnnouncementChangeEvent>();

  /**
   * 全员禁言
   */
  GroupMuteAllEvent = new AnyEvent<IEvent.GroupMuteAllEvent>();

  /**
   * 匿名聊天
   */
  GroupAllowAnonymousChatEvent = new AnyEvent<IEvent.GroupAllowAnonymousChatEvent>();

  /**
   * 坦白说
   */
  GroupAllowConfessTalkEvent = new AnyEvent<IEvent.GroupAllowConfessTalkEvent>();

  /**
   * 允许群员邀请好友加群
   */
  GroupAllowMemberInviteEvent = new AnyEvent<IEvent.GroupAllowMemberInviteEvent>();

  /**
   * 新人入群的事件
   */
  MemberJoinEvent = new AnyEvent<IEvent.MemberJoinEvent>();

  /**
   * 成员被踢出群（该成员不是Bot）
   */
  MemberLeaveEventKick = new AnyEvent<IEvent.MemberLeaveEventKick>();

  /**
   * 成员主动离群（该成员不是Bot）
   */
  MemberLeaveEventQuit = new AnyEvent<IEvent.MemberLeaveEventQuit>();

  /**
   * 群名片改动
   */
  MemberCardChangeEvent = new AnyEvent<IEvent.MemberCardChangeEvent>();

  /**
   * 群头衔改动（只有群主有操作限权）
   */
  MemberSpecialTitleChangeEvent = new AnyEvent<IEvent.MemberSpecialTitleChangeEvent>();

  /**
   * 成员权限改变的事件（该成员不可能是Bot，见 BotGroupPermissionChangeEvent）
   */
  MemberPermissionChangeEvent = new AnyEvent<IEvent.MemberPermissionChangeEvent>();

  /**
   * 群成员被禁言事件（该成员不可能是Bot，见 BotMuteEvent）
   */
  MemberMuteEvent = new AnyEvent<IEvent.MemberMuteEvent>();

  /**
   * 群成员被取消禁言事件（该成员不可能是Bot，见 BotUnmuteEvent）
   */
  MemberUnmuteEvent = new AnyEvent<IEvent.MemberUnmuteEvent>();

  /**
   * 添加好友申请
   */
  NewFriendRequestEvent = new AnyEvent<IEvent.NewFriendRequestEvent>();

  /**
   * 用户入群申请（Bot需要有管理员权限）
   */
  MemberJoinRequestEvent = new AnyEvent<IEvent.MemberJoinRequestEvent>();

  /**
   * Bot被邀请入群申请
   */
  BotInvitedJoinGroupRequestEvent = new AnyEvent<IEvent.BotInvitedJoinGroupRequestEvent>();

  GroupMessage = new AnyEvent<ChatMessageMap["GroupMessage"]>();
  TempMessage = new AnyEvent<ChatMessageMap["TempMessage"]>();
  FriendMessage = new AnyEvent<ChatMessageMap["FriendMessage"]>();
  message = new AnyEvent<ChatMessageMap["message"]>();
}
