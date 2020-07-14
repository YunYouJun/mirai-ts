import Mirai from "./src";
import { Api } from "./types/api";
import { Config } from "./types/config";
import { Contact } from "./types/contact";
import { MessageType } from "./types/message-type";
import { MiraiApiHttpConfig } from "./types/mirai-api-http";
import { EventType } from 'event-type';

export interface MiraiInstance extends Mirai { }

export {
  Api,
  Contact,
  Config,
  MessageType,
  EventType,
  MiraiApiHttpConfig
};
export default Mirai;
