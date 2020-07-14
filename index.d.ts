import Mirai from "./src";
export { Api } from "api";
export { Config } from "config";
export { Contact } from "contact";
export { MessageType } from "message-type";
export { MiraiApiHttpConfig } from "mirai-api-http";

export interface MiraiInstance extends Mirai { }
export default Mirai;
