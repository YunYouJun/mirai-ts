/**
 * 生成对应消息格式
 * @packageDocumentation
 */

import { MessageType } from "../..";

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
 * @param path 图片的路径，发送本地图片，相对路径于plugins/MiraiAPIHTTP/images
 */
function Image(imageId: string = "", url: string = "", path = ""): MessageType.Image {
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
 * @param path 图片的路径，发送本地图片，相对路径于plugins/MiraiAPIHTTP/images
 */
function FlashImage(imageId: string, url: string, path = ""): MessageType.FlashImage {
  return {
    type: "FlashImage",
    imageId,
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
function Poke(name: MessageType.Pokes): MessageType.Poke {
  return {
    type: "Poke",
    name,
  };
}

// helper
// ------------
/**
 * 获取纯文本
 * @param messageChain 消息链
 */
function getPlain(messageChain: MessageType.SingleMessage[]) {
  let msg = "";
  messageChain.forEach((chain) => {
    if (chain.type === "Plain") msg += chain.text;
  });
  return msg;
}

/**
 * 是否是文本信息中的一种
 * ['FriendMessage', 'GroupMessage', 'TempMessage']
 * @param msg 消息链
 */
function isMessage(msg: MessageType.MessageEvent) {
  const msgType = ['FriendMessage', 'GroupMessage', 'TempMessage'];
  return msgType.includes(msg.type);
}

/**
 * 是否被艾特
 * 传入 qq 时，返回是否被艾特
 * 未传入 qq 时，返回艾特消息
 * @param msg 
 */
function isAt(msg: MessageType.ChatMessage, qq?: number) {
  if (qq) {
    return msg.messageChain.some((singleMessage) => {
      return (singleMessage.type === "At" && singleMessage.target === qq);
    });
  } else {
    let atMsg = {};
    msg.messageChain.some((singleMessage) => {
      if (singleMessage.type === 'At') {
        atMsg = singleMessage;
        return true;
      }
    });
    return atMsg;
  }
}

// helper
export {
  getPlain,
  isMessage,
  isAt,
};

export default {
  Quote,
  At,
  AtAll,
  Face,
  Plain,
  Image,
  FlashImage,
  Xml,
  Json,
  App,
  Poke,
};
