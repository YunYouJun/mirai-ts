/**
 * 消息类型，与 [Mirai-api-http 消息类型一览](https://github.com/project-mirai/mirai-api-http/blob/master/docs/MessageType.md) 保持一致
 * @packageDocumentation
 */

import type { SendMessage } from './api/params'
import type * as Contact from './contact'

export namespace MessageType {
  interface BaseSingleMessage {
    type: string
  }
  /**
   * 源消息类型
   */
  export interface Source extends BaseSingleMessage {
    type: 'Source'
    /**
     * 消息的识别号，用于引用回复（Source 类型永远为 chain 的第一个元素）
     */
    id: number
    /**
     * 时间戳
     */
    time: number
  }

  /**
   * 引用消息类型
   */
  export interface Quote extends BaseSingleMessage {
    type: 'Quote'
    /**
     * 被引用回复的原消息的messageId
     */
    id: number
    /**
     * 被引用回复的原消息所接收的群号，当为好友消息时为0
     */
    groupId?: number
    /**
     * 被引用回复的原消息的发送者的QQ号
     */
    senderId?: number
    /**
     * 被引用回复的原消息的接收者者的QQ号（或群号）
     */
    targetId?: number
    /**
     * 被引用回复的原消息的消息链对象
     */
    origin?: MessageChain
  }

  /**
   * 艾特某人消息
   */
  export interface At extends BaseSingleMessage {
    type: 'At'
    /**
     * 群员QQ号
     */
    target: number
    /**
     * At 时显示的文字，发送消息时无效，自动使用群名片
     */
    display: string
  }

  /**
   * 艾特全体成员消息
   */
  export interface AtAll extends BaseSingleMessage {
    type: 'AtAll'
  }

  /**
   * 原生表情消息
   */
  export interface Face extends BaseSingleMessage {
    type: 'Face'
    /**
     * QQ表情编号，可选，优先高于name
     */
    faceId: number
    /**
     * QQ表情拼音，可选
     */
    name: string
  }

  /**
   * 文本消息
   */
  export interface Plain extends BaseSingleMessage {
    type: 'Plain'
    /**
     * 文字消息
     */
    text: string
  }

  /**
   * 图片消息
   */
  export interface Image extends BaseSingleMessage {
    type: 'Image'
    /**
     * 图片的 imageId，群图片与好友图片格式不同。不为空时将忽略 url 属性
     */
    imageId: string | null
    /**
     * 图片的 URL，发送时可作网络图片的链接；接收时为腾讯图片服务器的链接，可用于图片下载
     */
    url: string | null
    /**
     * 图片的路径，发送本地图片，相对路径于 `data/net.mamoe.mirai-api-http/images`
     */
    path: string | null
    /**
     * 图片的 Base64 编码
     */
    base64: string | null
  }

  /**
   * 闪照消息
   */
  export interface FlashImage extends BaseSingleMessage {
    type: 'FlashImage'
    /**
     * 图片的imageId，群图片与好友图片格式不同。不为空时将忽略url属性
     */
    imageId: string | null
    /**
     * 图片的URL，发送时可作网络图片的链接；接收时为腾讯图片服务器的链接，可用于图片下载
     */
    url: string | null
    /**
     * 图片的路径，发送本地图片，相对路径于 `data/net.mamoe.mirai-api-http/images`
     */
    path: string | null
  }

  /**
   * 语音消息
   */
  export interface Voice extends BaseSingleMessage {
    type: 'Voice'
    /**
     * 语音的 voiceId，不为空时将忽略 url 属性
     */
    voiceId: string | null
    /**
     * 语音的 URL，发送时可作网络语音的链接；接收时为腾讯语音服务器的链接，可用于语音下载
     */
    url: string | null
    /**
     * 语音的路径，发送本地语音，路径相对于 JVM 工作路径（默认是当前路径，可通过 -Duser.dir=...指定），也可传入绝对路径。
     */
    path: string | null
    /**
     * 语音的 Base64 编码
     */
    base64: string | null
    /**
     * 返回的语音长度, 发送消息时可以不传
     */
    length?: number
  }

  /**
   * 富文本消息（譬如合并转发）
   */
  export interface Xml extends BaseSingleMessage {
    type: 'Xml'
    /**
     * XML文本
     */
    xml: string
  }

  export interface Json extends BaseSingleMessage {
    type: 'Json'
    /**
     * Json文本
     */
    json: string
  }

  /**
   * 小程序消息
   */
  export interface App extends BaseSingleMessage {
    type: 'App'
    /**
     * 内容
     */
    content: string
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
    Poke = 'Poke',
    ShowLove = 'ShowLove',
    Like = 'Like',
    Heartbroken = 'Heartbroken',
    SixSixSix = 'SixSixSix',
    FangDaZhao = 'FangDaZhao',
  }

  /**
   * 戳一戳消息
   */
  export interface Poke extends BaseSingleMessage {
    type: 'Poke'
    /**
     * 戳一戳的类型
     */
    name: PokeName
  }

  export interface Dice extends BaseSingleMessage {
    type: 'Dice'
    /**
     * 点数
     */
    value: number
  }

  export type ForwardNode =
    | {
      /**
         * 发送者 id
         */
      senderId: number
      /**
         * 时间戳, 单位 秒
         */
      time: number
      /**
         * 发送者姓名
         */
      senderName: string
      messageChain: MessageChain
    }
    | {
      /**
         * 可以只使用消息messageId，从缓存中读取一条消息作为节点
         */
      messageId: number
    }

  /**
   * 转发
   */
  export interface Forward extends BaseSingleMessage {
    type: 'Forward'
    /**
     * 标题，XX的聊天记录
     */
    title: string
    /**
     * 简介，[聊天记录]
     */
    brief: string
    /**
     * 源
     */
    source: string
    /**
     * 摘要，查看 3 条转发消息
     */
    summary: string
    /**
     * 转发内容
     */
    nodeList: ForwardNode[]
  }

  export interface File {
    type: 'File'
    /**
     * 文件识别 id
     */
    id: string
    /**
     * 文件名字
     */
    name: string
    /**
     * 文件大小
     */
    size: number
  }

  export type MusicShareKind = 'NeteaseCloudMusic' | 'QQMusic' | 'MiguMusic'

  /**
   * 音乐分享
   */
  export interface MusicShare {
    type: 'MusicShare'
    /**
     * 音乐应用类型
     */
    kind: 'NeteaseCloudMusic' | 'QQMusic' | 'MiguMusic'
    /**
     * 消息卡片标题
     */
    title: string
    /**
     * 消息卡片内容
     */
    summary: string
    /**
     * 点击卡片跳转网页 URL
     */
    jumpUrl: string
    /**
     * 消息卡片图片 URL
     */
    pictureUrl: string
    /**
     * 音乐文件 URL
     */
    musicUrl: string
    /**
     * 简介，在消息列表显示，默认为 `[分享]$title`
     */
    brief?: string
  }

  export interface MiraiCode {
    type: 'MiraiCode'
    /**
     * MiraiCode
     * @example hello[mirai:at:1234567]
     */
    code: string
  }

  export interface SingleMessageMap {
    Source: Source
    Quote: Quote
    At: At
    AtAll: AtAll
    Face: Face
    Plain: Plain
    Image: Image
    FlashImage: FlashImage
    Voice: Voice
    Xml: Xml
    Json: Json
    App: App
    Poke: Poke
    Dice: Dice
    Forward: Forward
    MusicShare: MusicShare
    File: File
    MiraiCode: MiraiCode
  }

  export type SingleMessageType = keyof SingleMessageMap
  /**
   * FriendMessage | GroupMessage | TempMessage 下的 MessageChain 中的单条消息类型
   * 单条消息 此处命名与 mamoe/mirai-core 保持一致
   */
  export type SingleMessage = SingleMessageMap[SingleMessageType]

  /**
   * 消息链
   */
  export type MessageChain = Array<SingleMessage>

  interface BaseChatMessage extends BaseSingleMessage {
    type: 'GroupMessage' | 'TempMessage' | 'FriendMessage'
    messageChain: MessageChain & {
      0: Source
    }
    sender: Contact.User
    /**
     * 快捷回复函数
     */
    reply: (msgChain: string | MessageChain, quote?: boolean) => Promise<SendMessage>
    /**
     * 消息文本
     */
    plain: string
    /**
     * 是否为某群 groupId 发送
     * msg.group(114514)
     */
    group: (...groupIds: number[]) => Boolean
    /**
     * 是否为某个好友 qq 发送
     * msg.friend(114514)
     */
    friend: (...qqs: number[]) => Boolean
    /**
     * 获取消息链中第一次出现的消息类型
     * 例如：msg.get('Quote')
     */
    get: <T extends SingleMessage['type']>(
      type: T
    ) => SingleMessageMap[T] | null
  }

  export interface FriendMessage extends BaseChatMessage {
    type: 'FriendMessage'
    sender: Contact.Friend
  }
  export interface GroupMessage extends BaseChatMessage {
    type: 'GroupMessage'
    sender: Contact.Member
    /**
     * 判断是否艾特某人（留空则判断是否艾特自己）
     */
    isAt: (qq?: number) => boolean
  }
  export interface TempMessage extends BaseChatMessage {
    type: 'TempMessage'
    sender: Contact.Member
  }

  /**
   * 包括 FriendMessage GroupMessage TempMessage
   */
  export type ChatMessage = GroupMessage | TempMessage | FriendMessage

  /**
   * 聊天消息类型
   */
  export type ChatMessageType = ChatMessage['type']

  export interface ChatMessageMap {
    message: ChatMessage
    GroupMessage: GroupMessage
    FriendMessage: FriendMessage
    TempMessage: TempMessage
  }
}
