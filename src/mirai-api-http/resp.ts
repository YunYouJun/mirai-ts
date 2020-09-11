import MiraiApiHttp from "./index";
import { EventType } from "..";

enum NewFriendRequestEventEnum {
  "allow",
  "deny",
  "black",
}
enum MemberJoinRequestEventEnum {
  "allow",
  "deny",
  "ignore",
  "deny-black",
  "ignore-black",
}
enum DefaultRequestEventEnum {
  "allow",
  "deny",
}

const operations = {
  NewFriendRequestEvent: NewFriendRequestEventEnum,
  MemberJoinRequestEvent: MemberJoinRequestEventEnum,
  BotInvitedJoinGroupRequestEvent: DefaultRequestEventEnum,
};

export type RequestEventOperation<
  T extends EventType.RequestEvent["type"]
> = keyof typeof operations[T];

/**
 * https://github.com/project-mirai/mirai-api-http/blob/master/EventType.md
 * EventType 中的请求
 * resp.xxx 以与 mirai-api-http URL 保持一致
 */
export class Resp {
  constructor(private api: MiraiApiHttp) {}

  async _request<E extends EventType.RequestEvent>(
    event: E,
    operate: keyof typeof operations[E["type"]],
    message = ""
  ) {
    await this.api.axios.post(
      `/resp/${event.type[0].toLowerCase()}${event.type.substring(1)}`,
      {
        sessionKey: this.api.sessionKey,
        eventId: event.eventId,
        fromId: event.fromId,
        groupId: event.groupId,
        operate: operations[event.type][operate as any],
        message,
      }
    );
  }

  /**
   * 响应新朋友请求
   * @param event 请求的事件
   * @param operate 操作 allow 同意添加好友, deny 拒绝添加好友, black 拒绝添加好友并添加黑名单，不再接收该用户的好友申请
   * @param message 响应消息
   */
  newFriendRequest(
    event: EventType.NewFriendRequestEvent,
    operate: keyof typeof operations[typeof event["type"]],
    message?: string
  ) {
    return this._request(event, operate, message);
  }

  /**
   * 响应新入群请求
   * @param event 请求的事件
   * @param operate 操作 allow 同意入群, deny 拒绝入群, ignore 忽略请求, deny-black 拒绝入群并添加黑名单，不再接收该用户的入群申请, ignore-black 忽略入群并添加黑名单，不再接收该用户的入群申请
   * @param message 响应消息
   */
  async memberJoinRequest(
    event: EventType.MemberJoinRequestEvent,
    operate: keyof typeof operations[typeof event["type"]],
    message?: string
  ) {
    return this._request(event, operate, message);
  }

  /**
   * 响应被邀请入群申请
   * @param event 请求的事件
   * @param operate 操作 allow 同意邀请, deny 拒绝邀请
   * @param message 响应消息
   */
  async botInvitedJoinGroupRequest(
    event: EventType.BotInvitedJoinGroupRequestEvent,
    operate: keyof typeof operations[typeof event["type"]],
    message?: string
  ) {
    return this._request(event, operate, message);
  }
}
