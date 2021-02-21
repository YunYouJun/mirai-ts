/**
 * [状态码 | mirai-api-http](https://github.com/project-mirai/mirai-api-http/blob/master/docs/API.md#%E7%8A%B6%E6%80%81%E7%A0%81)
 */
export enum StatusCode {
  NORMAL = 0,
  ERROR_AUTH_KEY = 1,
  BOT_NOT_EXIST = 2,
  SESSION_INVALID = 3,
  SESSION_INACTIVATED = 4,
  TARGET_NOT_EXIST = 5,
  FILE_NOT_EXIST = 6,
  NO_OPERATION_AUTH = 10,
  BOT_MUTED = 20,
  MESSAGE_TOO_LONG = 30,
  WRONG_VISIT = 400,
  ERROR_SERVER = 500,
}

const StatusCodeMap = new Map([
  [StatusCode.NORMAL, "正常"],
  [StatusCode.ERROR_AUTH_KEY, "错误的 auth key"],
  [StatusCode.BOT_NOT_EXIST, "指定的 Bot 不存在"],
  [StatusCode.SESSION_INVALID, "Session 失效或不存在"],
  [StatusCode.SESSION_INACTIVATED, "Session 未认证(未激活)"],
  [StatusCode.TARGET_NOT_EXIST, "发送消息目标不存在(指定对象不存在)"],
  [StatusCode.FILE_NOT_EXIST, "指定文件不存在，出现于发送本地图片"],
  [StatusCode.NO_OPERATION_AUTH, "无操作权限，指 Bot 没有对应操作的限权"],
  [StatusCode.BOT_MUTED, "Bot 被禁言，指 Bot 当前无法向指定群发送消息"],
  [StatusCode.MESSAGE_TOO_LONG, "消息过长"],
  [StatusCode.WRONG_VISIT, "错误的访问，如参数错误等"],
  [
    StatusCode.ERROR_SERVER,
    "服务器端错误的响应（mirai-console/mirai-api-http 背锅）",
  ],
]);

/**
 * 状态码及其对应消息
 * @param code Mirai 状态码
 */
export function getMessageFromStatusCode(code: StatusCode) {
  return StatusCodeMap.get(code) || "未知的错误";
}
