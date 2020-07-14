import Mirai from "./src";

export 

export namespace EventType {
  type Group = MessageType.Group;
  type GroupMember = MessageType.GroupSender;
  /**
   * 内部基类
   */
  interface BaseEvent {
    type: string;
  }

  interface BotOnlineEvent extends BaseEvent {
    type: "BotOnlineEvent";
    qq: number;
  }
  
  interface BotOfflineEventActive extends BaseEvent {
    type: "BotOfflineEventActive";
    qq: number;
  }
  
  interface BotOfflineEventForce extends BaseEvent {
    type: "BotOfflineEventForce";
    qq: number;
  }
  
  interface BotOfflineEventDropped extends BaseEvent {
    type: "BotOfflineEventDropped";
    qq: number;
  }
  
  interface BotReloginEvent extends BaseEvent {
    type: "BotReloginEvent";
    qq: number;
  }
  
  interface GroupRecallEvent extends BaseEvent {
    type: "GroupRecallEvent";
    authorId: number;
    messageId: number;
    time: number;
    group: Group;
    operator: GroupMember | null;
  }
  
  interface FriendRecallEvent extends BaseEvent {
    type: "FriendRecallEvent";
    authorId: number;
    messageId: number;
    time: number;
    operator: number;
  }
  
  interface BotGroupPermissionChangeEvent extends BaseEvent {
    type: "BotGroupPermissionChangeEvent";
    origin: Permission;
    current: Permission;
    group: Group;
  }
  
  interface BotMuteEvent extends BaseEvent {
    type: "BotMuteEvent";
    durationSeconds: number;
    operator: GroupMember;
  }
  
  interface BotUnmuteEvent extends BaseEvent {
    type: "BotUnmuteEvent";
    operator: GroupMember;
  }
  
  interface BotJoinGroupEvent extends BaseEvent {
    type: "BotJoinGroupEvent";
    group: Group;
  }
  
  interface BotLeaveEventActive extends BaseEvent {
    type: "BotLeaveEventActive";
    group: Group;
  }
  
  interface BotLeaveEventKick extends BaseEvent {
    type: "BotLeaveEventKick";
    group: Group;
  }
  
  interface GroupNameChangeEvent extends BaseEvent {
    type: "GroupNameChangeEvent";
    origin: string;
    current: string;
    group: Group;
    operator: GroupMember | null;
  }
  
  interface GroupEntranceAnnouncementChangeEvent extends BaseEvent {
    type: "GroupEntranceAnnouncementChangeEvent";
    origin: string;
    current: string;
    group: Group;
    operator: GroupMember | null;
  }
  
  interface GroupMuteAllEvent extends BaseEvent {
    type: "GroupMuteAllEvent";
    origin: boolean;
    current: boolean;
    group: Group;
    operator: GroupMember | null;
  }
  
  interface GroupAllowAnonymousChatEvent extends BaseEvent {
    type: "GroupAllowAnonymousChatEvent";
    origin: boolean;
    current: boolean;
    group: Group;
    operator: GroupMember | null;
  }
  
  interface GroupAllowConfessTalkEvent extends BaseEvent {
    type: "GroupAllowConfessTalkEvent";
    origin: boolean;
    current: boolean;
    group: GroupMember;
    isByBot: boolean;
  }
  
  interface GroupAllowMemberInviteEvent extends BaseEvent {
    type: "GroupAllowMemberInviteEvent";
    origin: boolean;
    current: boolean;
    group: Group;
    operator: GroupMember | null;
  }
  
  interface MemberJoinEvent extends BaseEvent {
    type: "MemberJoinEvent";
    member: GroupMember;
  }
  
  interface MemberLeaveEventKick extends BaseEvent {
    type: "MemberLeaveEventKick";
    member: GroupMember;
    operator: GroupMember | null;
  }
  
  interface MemberLeaveEventQuit extends BaseEvent {
    type: "MemberLeaveEventQuit";
    member: GroupMember;
  }
  
  interface MemberCardChangeEvent extends BaseEvent {
    type: "MemberCardChangeEvent";
    origin: string;
    current: string;
    member: GroupMember;
    operator: GroupMember | null;
  }
  
  interface MemberSpecialTitleChangeEvent extends BaseEvent {
    type: "MemberSpecialTitleChangeEvent";
    origin: string;
    current: string;
    member: GroupMember;
  }
  
  interface MemberPermissionChangeEvent extends BaseEvent {
    type: "MemberPermissionChangeEvent";
    origin: Permission;
    current: Permission;
    member: GroupMember;
  }
  
  interface MemberMuteEvent extends BaseEvent {
    type: "MemberMuteEvent";
    durationSeconds: number;
    member: GroupMember;
    operator: GroupMember | null;
  }
  
  interface MemberUnmuteEvent extends BaseEvent {
    type: "MemberUnmuteEvent";
    member: GroupMember;
    operator: GroupMember | null;
  }
  
  interface NewFriendRequestEvent extends BaseEvent {
    type: "NewFriendRequestEvent";
    eventId: number;
    fromId: number;
    groupId: number;
    nick: string;
    message: string;
  }
  
  interface MemberJoinRequestEvent extends BaseEvent {
    type: "MemberJoinRequestEvent";
    eventId: number;
    fromId: number;
    groupId: number;
    groupName: string;
    nick: string;
    message: string;
  }
  
  interface BotInvitedJoinGroupRequestEvent extends BaseEvent {
    type: "BotInvitedJoinGroupRequestEvent";
    eventId: number;
    fromId: number;
    groupId: number;
    groupName: string;
    nick: string;
    message: string;
  }
  
  type Event =
    | BotOnlineEvent
    | BotOfflineEventActive
    | BotOfflineEventForce
    | BotOfflineEventDropped
    | BotReloginEvent
    | GroupRecallEvent
    | FriendRecallEvent
    | BotGroupPermissionChangeEvent
    | BotMuteEvent
    | BotUnmuteEvent
    | BotJoinGroupEvent
    | BotLeaveEventActive
    | BotLeaveEventKick
    | GroupNameChangeEvent
    | GroupEntranceAnnouncementChangeEvent
    | GroupMuteAllEvent
    | GroupAllowAnonymousChatEvent
    | GroupAllowConfessTalkEvent
    | GroupAllowMemberInviteEvent
    | MemberJoinEvent
    | MemberLeaveEventKick
    | MemberLeaveEventQuit
    | MemberCardChangeEvent
    | MemberSpecialTitleChangeEvent
    | MemberPermissionChangeEvent
    | MemberMuteEvent
    | MemberUnmuteEvent
    | NewFriendRequestEvent
    | MemberJoinRequestEvent
    | BotInvitedJoinGroupRequestEvent;
  
  type EventType = Event["type"];

  type EventMap = {
    BotOnlineEvent: BotOnlineEvent;
    BotOfflineEventActive: BotOfflineEventActive;
    BotOfflineEventForce: BotOfflineEventForce;
    BotOfflineEventDropped: BotOfflineEventDropped;
    BotReloginEvent: BotReloginEvent;
    GroupRecallEvent: GroupRecallEvent;
    FriendRecallEvent: FriendRecallEvent;
    BotGroupPermissionChangeEvent: BotGroupPermissionChangeEvent;
    BotMuteEvent: BotMuteEvent;
    BotUnmuteEvent: BotUnmuteEvent;
    BotJoinGroupEvent: BotJoinGroupEvent;
    BotLeaveEventActive: BotLeaveEventActive;
    BotLeaveEventKick: BotLeaveEventKick;
    GroupNameChangeEvent: GroupNameChangeEvent;
    GroupEntranceAnnouncementChangeEvent: GroupEntranceAnnouncementChangeEvent;
    GroupMuteAllEvent: GroupMuteAllEvent;
    GroupAllowAnonymousChatEvent: GroupAllowAnonymousChatEvent;
    GroupAllowConfessTalkEvent: GroupAllowConfessTalkEvent;
    GroupAllowMemberInviteEvent: GroupAllowMemberInviteEvent;
    MemberJoinEvent: MemberJoinEvent;
    MemberLeaveEventKick: MemberLeaveEventKick;
    MemberLeaveEventQuit: MemberLeaveEventQuit;
    MemberCardChangeEvent: MemberCardChangeEvent;
    MemberSpecialTitleChangeEvent: MemberSpecialTitleChangeEvent;
    MemberPermissionChangeEvent: MemberPermissionChangeEvent;
    MemberMuteEvent: MemberMuteEvent;
    MemberUnmuteEvent: MemberUnmuteEvent;
    NewFriendRequestEvent: NewFriendRequestEvent;
    MemberJoinRequestEvent: MemberJoinRequestEvent;
    BotInvitedJoinGroupRequestEvent: BotInvitedJoinGroupRequestEvent;
  };
}

export namespace MessageType {
  type Permission = "OWNER" | "ADMINISTRATOR" | "MEMBER";

  /**
   * 群的信息
   */
  interface Group {
    /**
     * 群号
     */
    id: number;
    /**
     * 群的群名称
     */
    name: string;
    /**
     * 群中，Bot的群限权
     */
    permission: Permission;
  }
  /*
   * 内部基类
   */
  interface BaseSender {
    /**
     * QQ 号
     */
    id: number;
  }

  /**
   *
   */
  interface FriendSender extends BaseSender {
    /**
     * 发送者的昵称
     */
    nickname: string;
    /**
     * 发送者的备注
     */
    remark: string;
  }

  /**
   * 消息发送群的信息
   */
  interface GroupSender extends BaseSender {
    /**
     * 群名片
     */
    memberName: string;
    /**
     * 群权限 OWNER、ADMINISTRATOR或MEMBER
     */
    permission: string;
    group: Group;
  }

  /**
   * 发送者信息
   */
  type Sender = FriendSender | GroupSender;

  /*
   * 内部基类
   */
  interface BaseSingleMessage {
    type: string;
  }

  interface Source extends BaseSingleMessage {
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

  interface Quote extends BaseSingleMessage {
    type: "Quote"
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
   * 艾特某人
   */
  interface At extends BaseSingleMessage {
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
   * 艾特全体成员
   */
  interface AtAll extends BaseSingleMessage {
    type: "AtAll";
  }

  /**
   * 原生表情
   */
  interface Face extends BaseSingleMessage {
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
   * 文本
   */
  interface Plain extends BaseSingleMessage {
    type: "Plain";
    /**
     * 	文字消息
     */
    text: string;
  }

  /**
   * 图片
   */
  interface Image extends BaseSingleMessage {
    type: "Image";
    /**
     * 图片的imageId，群图片与好友图片格式不同。不为空时将忽略url属性
     */
    imageId: string;
    /**
     * 图片的URL，发送时可作网络图片的链接；接收时为腾讯图片服务器的链接，可用于图片下载
     */
    url: string;
    /**
     * 图片的路径，发送本地图片，相对路径于plugins/MiraiAPIHTTP/images
     */
    path: string;
  }

  /**
   * 闪照
   */
  interface FlashImage extends BaseSingleMessage {
    type: "FlashImage";
    /**
     * 图片的imageId，群图片与好友图片格式不同。不为空时将忽略url属性
     */
    imageId: string;
    /**
     * 图片的URL，发送时可作网络图片的链接；接收时为腾讯图片服务器的链接，可用于图片下载
     */
    url: string;
    /**
     * 图片的路径，发送本地图片，相对路径于plugins/MiraiAPIHTTP/images
     */
    path: string;
  }

  /**
   * 富文本消息（譬如合并转发）
   */
  interface Xml extends BaseSingleMessage {
    type: "Xml";
    /**
     * XML文本
     */
    xml: string;
  }

  interface Json extends BaseSingleMessage {
    type: "Json";
    /**
     * Json文本
     */
    json: string;
  }

  /**
   * 小程序
   */
  interface App extends BaseSingleMessage {
    type: "App"
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
  enum Pokes {
    Poke,
    ShowLove,
    Like,
    Heartbroken,
    SixSixSix,
    FangDaZhao,
  }

  interface Poke extends BaseSingleMessage {
    type: "Poke";
    /**
     * 	戳一戳的类型
     */
    name: Pokes;
  }

  /**
   * fetchMessage 获取的消息或事件
   * 单条消息 此处命名与 mamoe/mirai-core 保持一致
   */
  type SingleMessage = Source | Quote | At | AtAll | Face | Plain | Image | FlashImage | Xml | Json | App;

  /**
   * 消息链
   */
  type MessageChain = Array<SingleMessage>;
  
  interface BaseChatMessage extends BaseSingleMessage {
    type: "GroupMessage" | "TempMessage" | "FriendMessage";
    messageChain: MessageChain & {
      0: Source;
    };
    sender: Sender;
    reply: (msgChain: string | MessageType.MessageChain, quote = false) => Promise<void>;
    plain: string;
  }
  interface GroupMessage extends BaseChatMessage {
    type: "GroupMessage";
    sender: GroupSender;
  }
  interface TempMessage extends BaseChatMessage {
    type: "TempMessage";
    sender: GroupSender;
  }
  interface FriendMessage extends BaseChatMessage {
    type: "FriendMessage";
    sender: FriendSender;
  }
  /**
   * 包括 FriendMessage GroupMessage TempMessage
   */
  type ChatMessage = GroupMessage | TempMessage | FriendMessage;


  type ChatMessageType = ChatMessage["type"];
  type ChatMessageMap = {
    GroupMessage: MessageType.GroupMessage;
    FriendMessage: MessageType.FriendMessage;
    TempMessage: MessageType.TempMessage;
  };
  type Message = ChatMessage | SingleMessage;
}

export namespace Api {
  interface SendMessage {
    sessionKey: string;
    target: number;
    messageChain: MessageType.MessageChain;
  }

  /**
   * 发送好友消息的请求格式
   */
  interface SendFriendMessage extends SendMessage {
    quote?: number;
  }

  interface SendGroupMessage extends SendMessage {
    quote?: number;
  }

  interface SendTempMessage {
    sessionKey: string;
    messageChain: MessageType.MessageChain;
    qq: number;
    group: number;
    quote?: number;
  }

  namespace Response {
    interface fetchMessage {
      code: number;
      data: MessageType.ChatMessage[];
    }

    interface sendMessage {
      code: number;
      msg: string;
      /**
       * 一个Int类型属性，标识本条消息，用于撤回和引用回复
       */
      messageId: number;
    }
  }
}

export namespace Config {
  /**
 * 正则表达式
 */
  interface Re {
    pattern: string;
    flags: string;
  }

  /**
   * 匹配配置
   */
  interface Match {
    re?: Re;
    is?: string | string[];
    includes?: string | string[];
  }

  interface Listen {
    friend?: number[];
    group?: number[];
  }

  interface Target {
    friend?: number[];
    group?: number[];
  }

  interface GroupConfig {
    /**
     * 群名
     */
    name?: string;
    /**
     * 群公告
     */
    announcement?: string;
    /**
     * 是否开启坦白说
     */
    confessTalk?: boolean;
    /**
     * 是否允许群员邀请
     */
    allowMemberInvite?: boolean;
    /**
     * 是否开启自动审批入群
     */
    autoApprove?: boolean;
    /**
     * 是否允许匿名聊天
     */
    anonymousChat?: boolean;
  }

  interface MemberInfo {
    /**
     * 群名片
     */
    name?: string;
    /**
     * 群头衔
     */
    specialTitle?: string;
  }
}

/**
 * Mirai Api Http 的相关配置
 */
export interface MiraiApiHttpConfig {
  /**
   * 可选，默认值为0.0.0.0
   */
  host: string;
  /**
   * 可选，默认值为8080
   */
  port: number;
  /**
   * 可选，默认由 mirai-api-http 随机生成，建议手动指定。未传入该值时，默认为 'el-psy-congroo'
   */
  authKey: string;
  /**
   * 可选，缓存大小，默认4096.缓存过小会导致引用回复与撤回消息失败
   */
  cacheSize?: number;
  /**
   * 可选，是否开启websocket，默认关闭，建议通过Session范围的配置设置
   */
  enableWebsocket?: boolean;
  /**
   * 可选，配置CORS跨域，默认为*，即允许所有域名
   */
  cors?: string[];
}

export interface MiraiInstance extends Mirai { }

export default Mirai;
