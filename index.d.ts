import Mirai from "./src";
export { Api } from "./types/api";
export { Config } from "./types/config";
export { Contact } from "./types/contact";
export { MessageType } from "./types/message-type";
export { MiraiApiHttpConfig } from "./types/mirai-api-http";

export interface MiraiInstance extends Mirai { }
export default Mirai;
