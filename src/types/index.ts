export * from "./setting";

export * from "./profile";

import * as Api from "./api";
import * as Config from "./config";
import * as Contact from "./contact";
import * as MessageType from "./message-type";
import * as EventType from "./event-type";
export { Api, Config, Contact, MessageType, EventType };

/**
 * mirai-ts 自定义配置项，与 mirai-api-http setting 相区别
 */
export interface MiraiOptions {
  http?: {
    address?: string;
  };
  ws?: {
    address?: string;
    /**
     * 心跳间隔
     * @default 60000
     */
    heartbeatInterval?: number;
  };
}
