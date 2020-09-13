import MiraiApiHttp from "./index";
import { EventType } from "..";

/**
 * - `0` 同意添加好友
 * - `1` 拒绝添加好友
 * - `2` 拒绝添加好友并添加黑名单，不再接收该用户的好友申请
 */
export type NewFriendRequestOperationType = 0 | 1 | 2;

/**
 * - `0` 同意入群
 * - `1` 拒绝入群
 * - `2` 忽略请求
 * - `3` 拒绝入群并添加黑名单，不再接收该用户的入群申请
 * - `4` 忽略入群并添加黑名单，不再接收该用户的入群申请
 */
export type MemberJoinRequestOperationType = 0 | 1 | 2 | 3 | 4;

/**
 * - `1` 同意邀请
 * - `2` 拒绝邀请
 */
export type BotInvitedJoinGroupRequestOperationType = 0 | 1;

/**
 * [EventType](https://github.com/project-mirai/mirai-api-http/blob/master/EventType.md) 中的请求
 * Example: resp.newFriendRequest for `/resp/newFriendRequestEvent`
 */
export class Resp {
  constructor(private api: MiraiApiHttp) {}

  async _request(event: EventType.RequestEvent, operate: number, message = "") {
    await this.api.axios.post(
      `/resp/${event.type[0].toLowerCase()}${event.type.substring(1)}`,
      {
        sessionKey: this.api.sessionKey,
        eventId: event.eventId,
        fromId: event.fromId,
        groupId: event.groupId,
        operate,
        message,
      }
    );
  }

  /**
   * 响应新朋友请求
   * @param event 请求的事件
   * @param operate 操作：0 同意添加好友, 1 拒绝添加好友, 2 拒绝添加好友并添加黑名单，不再接收该用户的好友申请
   * @param message 响应消息
   */
  newFriendRequest(
    event: EventType.NewFriendRequestEvent,
    operate: NewFriendRequestOperationType,
    message?: string
  ) {
    return this._request(event, operate, message);
  }

  /**
   * 响应新入群请求
   * @param event 请求的事件
   * @param operate 操作: 0 同意入群, 1 拒绝入群, 2 忽略请求, 3 拒绝入群并添加黑名单，不再接收该用户的入群申请, 4 忽略入群并添加黑名单，不再接收该用户的入群申请
   * @param message 响应消息
   */
  memberJoinRequest(
    event: EventType.MemberJoinRequestEvent,
    operate: MemberJoinRequestOperationType,
    message?: string
  ) {
    return this._request(event, operate, message);
  }

  /**
   * 响应被邀请入群申请
   * @param event 请求的事件
   * @param operate 操作：1 同意邀请, 2 拒绝邀请
   * @param message 响应消息
   */
  botInvitedJoinGroupRequest(
    event: EventType.BotInvitedJoinGroupRequestEvent,
    operate: BotInvitedJoinGroupRequestOperationType,
    message?: string
  ) {
    return this._request(event, operate, message);
  }
}
