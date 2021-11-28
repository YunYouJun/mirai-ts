/**
 * mirai-ts 默认导出内容
 * @packageDocumentation
 */

import Mirai from "./mirai";
export * from "./mirai";
export default Mirai;

// 必须放在最前面，适配 js require
if (typeof window === "undefined" && typeof module !== "undefined") {
  module.exports = Mirai;
  module.exports.default = Mirai;
  module.exports.Mirai = Mirai;
  exports = module.exports;
}

export type MiraiInstance = Mirai;

import Message from "./message";
import MiraiApiHttp from "./mirai-api-http";

// 工具
export * from "./utils/index";
// https://www.npmjs.com/package/@yunyoujun/logger
import Logger from "@yunyoujun/logger";
import * as check from "./utils/check";
import * as template from "./utils/template";
export { check, template };
// 类型
export * from "./types";

// export
export { Mirai, Message, MiraiApiHttp, Logger };
