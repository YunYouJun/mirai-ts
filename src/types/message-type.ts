/**
 * 消息类型，与 [Mirai-api-http 消息类型一览](https://github.com/project-mirai/mirai-api-http/blob/master/docs/MessageType.md) 保持一致
 * @packageDocumentation
 */

import * as Contact from "./contact";

interface BaseSingleMessage {
  type: string;
}

/**
 * 源消息类型
 */
export interface Source extends BaseSingleMessage {
  type: "Source";
  /**
   * 	消息的识别号，用于引用回复（Source 类型永远为 chain 的第一个元素）
   */
  id: number;
  /**
   * 时间戳
   */
  time: number;
}

/**
 * 引用消息类型
 */
export interface Quote extends BaseSingleMessage {
  type: "Quote";
  /**
   * 	被引用回复的原消息的messageId
   */
  id: number;
  /**
   * 被引用回复的原消息所接收的群号，当为好友消息时为0
   */
  groupId?: number;
  /**
   * 被引用回复的原消息的发送者的QQ号
   */
  senderId?: number;
  /**
   * 被引用回复的原消息的接收者者的QQ号（或群号）
   */
  targetId?: number;
  /**
   * 被引用回复的原消息的消息链对象
   */
  origin?: MessageChain;
}

/**
 * 艾特某人消息
 */
export interface At extends BaseSingleMessage {
  type: "At";
  /**
   * 群员QQ号
   */
  target: number;
  /**
   * 	At时显示的文字，发送消息时无效，自动使用群名片
   */
  display: string;
}

/**
 * 艾特全体成员消息
 */
export interface AtAll extends BaseSingleMessage {
  type: "AtAll";
}

/**
 * 原生表情消息
 */
export interface Face extends BaseSingleMessage {
  type: "Face";
  /**
   * QQ表情编号，可选，优先高于name
   */
  faceId: number;
  /**
   * QQ表情拼音，可选
   */
  name: string;
}

/**
 * 文本消息
 */
export interface Plain extends BaseSingleMessage {
  type: "Plain";
  /**
   * 文字消息
   */
  text: string;
}

/**
 * 图片消息
 */
export interface Image extends BaseSingleMessage {
  type: "Image";
  /**
   * 图片的 imageId，群图片与好友图片格式不同。不为空时将忽略 url 属性
   */
  imageId: string | null;
  /**
   * 图片的 URL，发送时可作网络图片的链接；接收时为腾讯图片服务器的链接，可用于图片下载
   */
  url: string | null;
  /**
   * 图片的路径，发送本地图片，相对路径于 `data/net.mamoe.mirai-api-http/images`
   */
  path: string | null;
}

/**
 * 闪照消息
 */
export interface FlashImage extends BaseSingleMessage {
  type: "FlashImage";
  /**
   * 图片的imageId，群图片与好友图片格式不同。不为空时将忽略url属性
   */
  imageId: string | null;
  /**
   * 图片的URL，发送时可作网络图片的链接；接收时为腾讯图片服务器的链接，可用于图片下载
   */
  url: string | null;
  /**
   * 图片的路径，发送本地图片，相对路径于 `data/net.mamoe.mirai-api-http/images`
   */
  path: string | null;
}

/**
 * 语音消息
 */
export interface Voice extends BaseSingleMessage {
  type: "Voice";
  /**
   * 语音的 voiceId，不为空时将忽略 url 属性
   */
  voiceId: string | null;
  /**
   * 语音的URL，发送时可作网络语音的链接；接收时为腾讯语音服务器的链接，可用于语音下载
   */
  url: string | null;
  /**
   * 语音的路径，发送本地语音，相对路径于 `data/net.mamoe.mirai-api-http/voices`
   */
  path: string | null;
}

/**
 * 富文本消息（譬如合并转发）
 */
export interface Xml extends BaseSingleMessage {
  type: "Xml";
  /**
   * XML文本
   */
  xml: string;
}

export interface Json extends BaseSingleMessage {
  type: "Json";
  /**
   * Json文本
   */
  json: string;
}

/**
 * 小程序消息
 */
export interface App extends BaseSingleMessage {
  type: "App";
  /**
   * 内容
   */
  content: string;
}

/**
 * "Poke": 戳一戳
 * "ShowLove": 比心
 * "Like": 点赞
 * "Heartbroken": 心碎
 * "SixSixSix": 666
 * "FangDaZhao": 放大招
 */
export enum PokeName {
  Poke = "Poke",
  ShowLove = "ShowLove",
  Like = "Like",
  Heartbroken = "Heartbroken",
  SixSixSix = "SixSixSix",
  FangDaZhao = "SixSixSix",
}

/**
 * 戳一戳消息
 */
export interface Poke extends BaseSingleMessage {
  type: "Poke";
  /**
   * 	戳一戳的类型
   */
  name: PokeName;
}

/**
 * FriendMessage | GroupMessage | TempMessage 下的 MessageChain 中的单条消息类型
 * 单条消息 此处命名与 mamoe/mirai-core 保持一致
 */
export type SingleMessage =
  | Source
  | Quote
  | At
  | AtAll
  | Face
  | Plain
  | Image
  | FlashImage
  | Voice
  | Xml
  | Json
  | App
  | Poke;
/**
 * 消息链
 */
export type MessageChain = Array<SingleMessage>;

interface BaseChatMessage extends BaseSingleMessage {
  type: "GroupMessage" | "TempMessage" | "FriendMessage";
  messageChain: MessageChain & {
    0: Source;
  };
  sender: Contact.User;
  /**
   * 快捷回复函数
   */
  reply: (msgChain: string | MessageChain, quote?: boolean) => Promise<void>;
  /**
   * 消息文本
   */
  plain: string;
  /**
   * 是否为某群 groupId 发送
   * msg.group(114514)
   */
  group: (...groupIds: number[]) => Boolean;
  /**
   * 是否为某个好友 qq 发送
   * msg.friend(114514)
   */
  friend: (...qqs: number[]) => Boolean;
}

export interface FriendMessage extends BaseChatMessage {
  type: "FriendMessage";
  sender: Contact.Friend;
}
export interface GroupMessage extends BaseChatMessage {
  type: "GroupMessage";
  sender: Contact.Member;
  /**
   * 判断是否艾特某人（留空则判断是否艾特自己）
   */
  isAt: (qq?: number) => boolean;
}
export interface TempMessage extends BaseChatMessage {
  type: "TempMessage";
  sender: Contact.Member;
}

/**
 * 包括 FriendMessage GroupMessage TempMessage
 */
export type ChatMessage = GroupMessage | TempMessage | FriendMessage;

/**
 * 聊天消息类型
 */
export type ChatMessageType = ChatMessage["type"];

export type ChatMessageMap = {
  message: ChatMessage;
  GroupMessage: GroupMessage;
  FriendMessage: FriendMessage;
  TempMessage: TempMessage;
};
