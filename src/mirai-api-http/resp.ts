import MiraiApiHttp from "./index";
import { EventType } from "..";

/**
 * https://github.com/project-mirai/mirai-api-http/blob/master/EventType.md
 * EventType 中的请求
 * resp.xxx 以与 mirai-api-http URL 保持一致
 */
export class Resp {
  /**
   * 将请求事件类型映射到合适的响应方法
   */
  mapper: {
    [type in EventType.RequestEvent["type"]]: (
      event: EventType.EventMap[type],
      operate: EventType.EventMap[type]["operations"][number],
      message?: string
    ) => Promise<void>;
  };

  constructor(private api: MiraiApiHttp) {
    this.mapper = {
      NewFriendRequestEvent: this.newFriendRequest,
      MemberJoinRequestEvent: this.memberJoinRequest,
      BotInvitedJoinGroupRequestEvent: this.botInvitedJoinGroupRequest,
    };
  }

  /**
   * 响应新朋友请求
   * @param event 请求的事件
   * @param operate 操作 allow 同意添加好友, deny 拒绝添加好友, black 拒绝添加好友并添加黑名单，不再接收该用户的好友申请
   * @param message 响应消息
   */
  async newFriendRequest(
    event: EventType.NewFriendRequestEvent,
    operate: typeof event["operations"][number],
    message = ""
  ) {
    await this.api.axios.post("/resp/newFriendRequestEvent", {
      sessionKey: this.api.sessionKey,
      eventId: event.eventId,
      fromId: event.fromId,
      groupId: event.groupId,
      operate: event.operations.indexOf(operate),
      message,
    });
  }

  /**
   * 响应新入群请求
   * @param event 请求的事件
   * @param operate 操作 allow 同意入群, deny 拒绝入群, ignore 忽略请求, deny-black 拒绝入群并添加黑名单，不再接收该用户的入群申请, ignore-black 忽略入群并添加黑名单，不再接收该用户的入群申请
   * @param message 响应消息
   */
  async memberJoinRequest(
    event: EventType.MemberJoinRequestEvent,
    operate: typeof event["operations"][number],
    message = ""
  ) {
    await this.api.axios.post("/resp/memberJoinRequestEvent", {
      sessionKey: this.api.sessionKey,
      eventId: event.eventId,
      fromId: event.fromId,
      groupId: event.groupId,
      operate: event.operations.indexOf(operate),
      message,
    });
  }

  /**
   * 响应被邀请入群申请
   * @param event 请求的事件
   * @param operate 操作 allow 同意邀请, deny 拒绝邀请
   * @param message 响应消息
   */
  async botInvitedJoinGroupRequest(
    event: EventType.BotInvitedJoinGroupRequestEvent,
    operate: typeof event["operations"][number],
    message = ""
  ) {
    await this.api.axios.post("/resp/botInvitedJoinGroupRequestEvent", {
      sessionKey: this.api.sessionKey,
      eventId: event.eventId,
      fromId: event.fromId,
      groupId: event.groupId,
      operate: event.operations.indexOf(operate),
      message,
    });
  }
}
