/**
 * 生成对应消息格式
 * @packageDocumentation
 */

import * as MessageType from "./types/message-type";

/**
 * 生成引用的消息格式
 * @param messageId 消息 ID
 */
function Quote(messageId: number): MessageType.Quote {
  return {
    type: "Quote",
    id: messageId,
  };
}

/**
 * 生成艾特默认的消息格式
 * @param target QQ 号
 */
function At(target: number): MessageType.At {
  return {
    type: "At",
    target,
    display: "",
  };
}

/**
 * 生成艾特全体成员的消息格式
 */
function AtAll(): MessageType.AtAll {
  return {
    type: "AtAll",
  };
}

/**
 * 生成 QQ 原生表情消息格式
 * @param faceId QQ表情编号
 * @param name QQ表情拼音，可选
 */
function Face(faceId: number, name = ""): MessageType.Face {
  return {
    type: "Face",
    faceId,
    name,
  };
}

/**
 * 生成文本消息格式
 * @param text 文本
 */
function Plain(text: string): MessageType.Plain {
  return {
    type: "Plain",
    text,
  };
}

/**
 * 生成图片消息格式
 * @param imageId 图片的imageId，群图片与好友图片格式不同。不为空时将忽略url属性
 * @param url 图片的URL，发送时可作网络图片的链接；接收时为腾讯图片服务器的链接，可用于图片下载
 * @param path 图片的路径，发送本地图片，相对路径于 `data/net.mamoe.mirai-api-http/images`
 */
function Image(
  imageId: string | null = null,
  url: string | null = null,
  path: string | null = null
): MessageType.Image {
  return {
    type: "Image",
    imageId,
    url,
    path,
  };
}

/**
 * 生成闪照消息格式
 * @param imageId 图片的imageId，群图片与好友图片格式不同。不为空时将忽略url属性
 * @param url 图片的URL，发送时可作网络图片的链接；接收时为腾讯图片服务器的链接，可用于图片下载
 * @param path 图片的路径，发送本地图片，相对路径于 `data/net.mamoe.mirai-api-http/images`
 */
function FlashImage(
  imageId: string | null = null,
  url: string | null = null,
  path: string | null = null
): MessageType.FlashImage {
  return {
    type: "FlashImage",
    imageId,
    url,
    path,
  };
}

/**
 * 需要 mirai-api-http 1.8.2 以上，mirai-console 1.0 以上
 * 生成语音消息格式
 * @param voiceId 语音的 voiceId，不为空时将忽略 url 属性
 * @param url 语音的URL，发送时可作网络语音的链接；接收时为腾讯语音服务器的链接，可用于语音下载
 * @param path 语音的路径，发送本地语音，相对路径于 `data/net.mamoe.mirai-api-http/voices`
 */
function Voice(
  voiceId: string | null = null,
  url: string | null = null,
  path: string | null = null
): MessageType.Voice {
  return {
    type: "Voice",
    voiceId,
    url,
    path,
  };
}

/**
 * 富文本消息（譬如合并转发）
 * @param xml
 */
function Xml(xml: string): MessageType.Xml {
  return {
    type: "Xml",
    xml,
  };
}

/**
 * Json 消息格式（我也还没看懂这哪里用，欢迎 PR）
 * @param json
 */
function Json(json: string): MessageType.Json {
  return {
    type: "Json",
    json,
  };
}

/**
 * 小程序
 * @param content
 */
function App(content: string): MessageType.App {
  return {
    type: "App",
    content,
  };
}

/**
 * - "Poke": 戳一戳
 * - "ShowLove": 比心
 * - "Like": 点赞
 * - "Heartbroken": 心碎
 * - "SixSixSix": 666
 * - "FangDaZhao": 放大招
 * @param name 戳一戳的类型
 */
function Poke(name: MessageType.PokeName): MessageType.Poke {
  return {
    type: "Poke",
    name,
  };
}

/**
 * 音乐分享
 * @param kind 音乐应用类型
 * @param title 消息卡片标题
 * @param summary 消息卡片内容
 * @param jumpUrl 点击卡片跳转网页 URL
 * @param pictureUrl 消息卡片图片 URL
 * @param musicUrl 音乐文件 URL
 * @param brief 在消息列表显示，可选，默认为 `[分享]$title`
 * @returns
 */
function MusicShare(
  kind: MessageType.MusicShareKind,
  title: string,
  summary: string,
  jumpUrl: string,
  pictureUrl: string,
  musicUrl: string,
  brief?: string
): MessageType.MusicShare {
  const musicShare = {
    kind,
    title,
    summary,
    jumpUrl,
    pictureUrl,
    musicUrl,
    brief,
  };
  if (brief) {
    musicShare.brief = brief;
  }
  return musicShare;
}

export default {
  Quote,
  At,
  AtAll,
  Face,
  Plain,
  Image,
  FlashImage,
  Voice,
  Xml,
  Json,
  App,
  Poke,
  MusicShare,
};
