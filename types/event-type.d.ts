import { Contact } from "./contact";

export namespace EventType {
  /**
   * 内部基类
   */
  interface BaseEvent {
    type: string;
  }

  interface BotOnlineEvent extends BaseEvent {
    type: "BotOnlineEvent";
    qq: number;
  }

  interface BotOfflineEventActive extends BaseEvent {
    type: "BotOfflineEventActive";
    qq: number;
  }

  interface BotOfflineEventForce extends BaseEvent {
    type: "BotOfflineEventForce";
    qq: number;
  }

  interface BotOfflineEventDropped extends BaseEvent {
    type: "BotOfflineEventDropped";
    qq: number;
  }

  interface BotReloginEvent extends BaseEvent {
    type: "BotReloginEvent";
    qq: number;
  }

  interface GroupRecallEvent extends BaseEvent {
    type: "GroupRecallEvent";
    authorId: number;
    messageId: number;
    time: number;
    group: Contact.Group;
    operator: Contact.Member | null;
  }

  interface FriendRecallEvent extends BaseEvent {
    type: "FriendRecallEvent";
    authorId: number;
    messageId: number;
    time: number;
    operator: number;
  }

  interface BotGroupPermissionChangeEvent extends BaseEvent {
    type: "BotGroupPermissionChangeEvent";
    origin: Contact.Permission;
    current: Contact.Permission;
    group: Contact.Group;
  }

  interface BotMuteEvent extends BaseEvent {
    type: "BotMuteEvent";
    durationSeconds: number;
    operator: Contact.Member;
  }

  interface BotUnmuteEvent extends BaseEvent {
    type: "BotUnmuteEvent";
    operator: Contact.Member;
  }

  interface BotJoinGroupEvent extends BaseEvent {
    type: "BotJoinGroupEvent";
    group: Contact.Group;
  }

  interface BotLeaveEventActive extends BaseEvent {
    type: "BotLeaveEventActive";
    group: Contact.Group;
  }

  interface BotLeaveEventKick extends BaseEvent {
    type: "BotLeaveEventKick";
    group: Contact.Group;
  }

  interface GroupNameChangeEvent extends BaseEvent {
    type: "GroupNameChangeEvent";
    origin: string;
    current: string;
    group: Contact.Group;
    operator: Contact.Member | null;
  }

  interface GroupEntranceAnnouncementChangeEvent extends BaseEvent {
    type: "GroupEntranceAnnouncementChangeEvent";
    origin: string;
    current: string;
    group: Contact.Group;
    operator: Contact.Member | null;
  }

  interface GroupMuteAllEvent extends BaseEvent {
    type: "GroupMuteAllEvent";
    origin: boolean;
    current: boolean;
    group: Contact.Group;
    operator: Contact.Member | null;
  }

  interface GroupAllowAnonymousChatEvent extends BaseEvent {
    type: "GroupAllowAnonymousChatEvent";
    origin: boolean;
    current: boolean;
    group: Contact.Group;
    operator: Contact.Member | null;
  }

  interface GroupAllowConfessTalkEvent extends BaseEvent {
    type: "GroupAllowConfessTalkEvent";
    origin: boolean;
    current: boolean;
    group: Contact.Member;
    isByBot: boolean;
  }

  interface GroupAllowMemberInviteEvent extends BaseEvent {
    type: "GroupAllowMemberInviteEvent";
    origin: boolean;
    current: boolean;
    group: Contact.Group;
    operator: Contact.Member | null;
  }

  interface MemberJoinEvent extends BaseEvent {
    type: "MemberJoinEvent";
    member: Contact.Member;
  }

  interface MemberLeaveEventKick extends BaseEvent {
    type: "MemberLeaveEventKick";
    member: Contact.Member;
    operator: Contact.Member | null;
  }

  interface MemberLeaveEventQuit extends BaseEvent {
    type: "MemberLeaveEventQuit";
    member: Contact.Member;
  }

  interface MemberCardChangeEvent extends BaseEvent {
    type: "MemberCardChangeEvent";
    origin: string;
    current: string;
    member: Contact.Member;
    operator: Contact.Member | null;
  }

  interface MemberSpecialTitleChangeEvent extends BaseEvent {
    type: "MemberSpecialTitleChangeEvent";
    origin: string;
    current: string;
    member: Contact.Member;
  }

  interface MemberPermissionChangeEvent extends BaseEvent {
    type: "MemberPermissionChangeEvent";
    origin: Contact.Permission;
    current: Contact.Permission;
    member: Contact.Member;
  }

  interface MemberMuteEvent extends BaseEvent {
    type: "MemberMuteEvent";
    durationSeconds: number;
    member: Contact.Member;
    operator: Contact.Member | null;
  }

  interface MemberUnmuteEvent extends BaseEvent {
    type: "MemberUnmuteEvent";
    member: Contact.Member;
    operator: Contact.Member | null;
  }

  interface NewFriendRequestEvent extends BaseEvent {
    type: "NewFriendRequestEvent";
    eventId: number;
    fromId: number;
    groupId: number;
    nick: string;
    message: string;
  }

  interface MemberJoinRequestEvent extends BaseEvent {
    type: "MemberJoinRequestEvent";
    eventId: number;
    fromId: number;
    groupId: number;
    groupName: string;
    nick: string;
    message: string;
  }

  interface BotInvitedJoinGroupRequestEvent extends BaseEvent {
    type: "BotInvitedJoinGroupRequestEvent";
    eventId: number;
    fromId: number;
    groupId: number;
    groupName: string;
    nick: string;
    message: string;
  }

  type Event =
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

  type EventType = Event["type"];

  type EventMap = {
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
}
