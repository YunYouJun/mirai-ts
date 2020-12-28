import { AnyEvent } from "ts-events";
import * as IEvent from "./types/event-type";

/**
 * Bot 登陆成功发射机
 */
export const BotOnlineEventEmitter = new AnyEvent<IEvent.BotOnlineEvent>();

export const BotOfflineEventActiveEmitter = new AnyEvent<IEvent.BotOfflineEventActive>();

export const BotOfflineEventForceEmitter = new AnyEvent<IEvent.BotOfflineEventForce>();

export const BotOfflineEventDroppedEmitter = new AnyEvent<IEvent.BotOfflineEventDropped>();

export const BotReloginEventEmitter = new AnyEvent<IEvent.BotReloginEvent>();

export const GroupRecallEventEmitter = new AnyEvent<IEvent.GroupRecallEvent>();

export const FriendRecallEventEmitter = new AnyEvent<IEvent.FriendRecallEvent>();

export const BotGroupPermissionChangeEventEmitter = new AnyEvent<IEvent.BotGroupPermissionChangeEvent>();

export const BotMuteEventEmitter = new AnyEvent<IEvent.BotMuteEvent>();

export const BotUnmuteEventEmitter = new AnyEvent<IEvent.BotUnmuteEvent>();

export const BotJoinGroupEventEmitter = new AnyEvent<IEvent.BotJoinGroupEvent>();

export const BotLeaveEventActiveEmitter = new AnyEvent<IEvent.BotLeaveEventActive>();

export const BotLeaveEventKickEmitter = new AnyEvent<IEvent.BotLeaveEventKick>();

export const GroupNameChangeEventEmitter = new AnyEvent<IEvent.GroupNameChangeEvent>();

export const GroupEntranceAnnouncementChangeEventEmitter = new AnyEvent<IEvent.GroupEntranceAnnouncementChangeEvent>();

export const GroupMuteAllEventEmitter = new AnyEvent<IEvent.GroupMuteAllEvent>();
