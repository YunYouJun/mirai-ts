import type { MiraiApiHttp } from "./index";
import type { Api, EventType } from "..";
import type { AxiosResponse } from "axios";

/**
 * - `0` 同意添加好友
 * - `1` 拒绝添加好友
 * - `2` 拒绝添加好友并添加黑名单，不再接收该用户的好友申请
 */
export enum NewFriendRequestOperationType {
  /**
   * 同意添加好友
   */
  Accept = 0,
  /**
   * 拒绝添加好友
   */
  Refuse = 1,
  /**
   * 拒绝添加好友并添加黑名单，不再接收该用户的好友申请
   */
  RefuseAndBlock = 2,
}

/**
 * - `0` 同意入群
 * - `1` 拒绝入群
 * - `2` 忽略请求
 * - `3` 拒绝入群并添加黑名单，不再接收该用户的入群申请
 * - `4` 忽略入群并添加黑名单，不再接收该用户的入群申请
 */
export enum MemberJoinRequestOperationType {
  /**
   * 同意入群
   */
  Accept = 0,
  /**
   * 拒绝入群
   */
  Refuse = 1,
  /**
   * 忽略请求
   */
  Ignore = 2,
  /**
   * 拒绝入群并添加黑名单，不再接收该用户的入群申请
   */
  RefuseAndBlock = 3,
  /**
   * 忽略入群并添加黑名单，不再接收该用户的入群申请
   */
  IgnoreAndBlock = 4,
}

/**
 * - `0` 同意邀请
 * - `1` 拒绝邀请
 */
export enum BotInvitedJoinGroupRequestOperationType {
  /**
   * 同意邀请
   */
  Accept = 0,
  /**
   * 拒绝邀请
   */
  Refuse = 1,
}

/**
 * [申请事件 | EventType](https://github.com/project-mirai/mirai-api-http/blob/master/docs/EventType.md#%E7%94%B3%E8%AF%B7%E4%BA%8B%E4%BB%B6)
 * Example: resp.newFriendRequest for `/resp/newFriendRequestEvent`
 */
export class Resp {
  constructor(private api: MiraiApiHttp) {}

  async _request(event: EventType.RequestEvent, operate: number, message = "") {
    const { data } = await this.api.axios.post<
      null,
      AxiosResponse<
        | Api.Response.NewFriendRequestEvent
        | Api.Response.MemberJoinRequestEvent
        | Api.Response.BotInvitedJoinGroupRequestEvent
      >
    >(`/resp/${event.type[0].toLowerCase()}${event.type.substring(1)}`, {
      sessionKey: this.api.sessionKey,
      eventId: event.eventId,
      fromId: event.fromId,
      groupId: event.groupId,
      operate,
      message,
    });
    return data;
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
    return this._request(
      event,
      operate,
      message
    ) as Promise<Api.Response.NewFriendRequestEvent>;
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
    return this._request(
      event,
      operate,
      message
    ) as Promise<Api.Response.MemberJoinRequestEvent>;
  }

  /**
   * 响应被邀请入群申请
   * @param event 请求的事件
   * @param operate 操作：0 同意邀请, 1 拒绝邀请
   * @param message 响应消息
   */
  botInvitedJoinGroupRequest(
    event: EventType.BotInvitedJoinGroupRequestEvent,
    operate: BotInvitedJoinGroupRequestOperationType,
    message?: string
  ) {
    return this._request(
      event,
      operate,
      message
    ) as Promise<Api.Response.BotInvitedJoinGroupRequestEvent>;
  }
}
