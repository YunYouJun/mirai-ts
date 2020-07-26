/**
 * mirai-ts 默认导出内容
 * @packageDocumentation
 */

import Mirai from "./mirai";
import Message from "./message";
import MiraiApiHttp from "./mirai-api-http";
export { Message, MiraiApiHttp };

export default Mirai;
if (typeof module !== 'undefined') {
  module.exports = Mirai;
  module.exports.default = Mirai;
  module.exports.Mirai = Mirai;
}

export interface MiraiInstance extends Mirai { }

// 工具
export * as log from "./utils/log";
export * as check from "./utils/check";

// 类型
export * as Api from "./types/api";
export * as Config from "./types/config";
export * as Contact from "./types/contact";
export * as MessageType from "./types/message-type";
export * as EventType from "./types/event-type";
export { MiraiApiHttpConfig } from "./mirai-api-http";

