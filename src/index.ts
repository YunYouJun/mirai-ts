/**
 * mirai-ts 默认导出内容
 * @packageDocumentation
 */

import { Mirai } from "./mirai";
export * from "./mirai";

export type MiraiInstance = Mirai;

export * as Message from "./message";
export * from "./mirai-api-http";

// 工具
export * from "./utils/index";
// https://www.npmjs.com/package/@yunyoujun/logger
import Logger from "@yunyoujun/logger";
export * as check from "./utils/check";
export * as template from "./utils/template";

// 类型
export * from "./types";

// export
export { Logger };
export default Mirai;
