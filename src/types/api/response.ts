/**
 * API 响应格式
 * @packageDocumentation
 */

import * as MessageType from "../message-type";
import * as EventType from '../event-type';

export interface fetchMessage {
  code: number;
  data: (MessageType.ChatMessage | EventType.Event)[];
}

/**
 * 基础响应格式
 */
export interface BaseResponse {
  code: number;
  msg: string;
}

export interface sendMessage extends BaseResponse {
  /**
   * 一个Int类型属性，标识本条消息，用于撤回和引用回复
   */
  messageId: number;
}

export type messageFromId = BaseResponse;
