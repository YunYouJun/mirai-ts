/**
 * 与 mirai-api-http [setting.yml](https://github.com/project-mirai/mirai-api-http#settingyml模板) 的配置保持一致
 * @packageDocumentation
 */

export type Adapter = 'http' | 'ws' | 'reverse-ws' | 'webhook'

/**
 * 提供基于轮询的 http 接口
 */
export interface HttpAdapter {
  /**
   * http server 监听的本地地址
   * 一般为 localhost 即可, 如果多网卡等情况，自定设置
   * @default "localhost"
   */
  host: string
  /**
   * http server 监听的端口
   * 与 websocket server 可以重复, 由于协议与路径不同, 不会产生冲突
   * @default 4859
   */
  port: number
  /**
   * 配置跨域, * 默认允许来自所有域名
   */
  cors?: string[]
}

/**
 * 提供基于 websocket server 的接口
 */
export interface WebsocketAdapter {
  /**
   * websocket server 监听的本地地址
   * 一般为 localhost 即可, 如果多网卡等情况，自定设置
   * @default "localhost"
   */
  host: string
  /**
   * websocket server 监听的端口
   * 与 http server 可以重复, 由于协议与路径不同, 不会产生冲突
   * @default 4859
   */
  port: number
  /**
   * websocket 用于消息同步的字段为 syncId, 一般值为请求时的原值，用于同步一次请求与响应
   * 对于由 websocket server 主动发出的通知, 固定使用一个 syncId, 默认为 ”-1“
   */
  reservedSyncId?: string
}

/**
 * 提供基于 websocket client 的接口
 */
export interface ReverseWebsocketAdapter {
  /**
   * 远端 server host
   */
  destinations: {
    host: string
    port: number
    /**
     * 请求路径
     */
    path: string
    /**
     * 协议
     */
    protocol: ('ws' | 'wss')[]
    /**
     * 请求方式，通常为 GET
     */
    method: string
    /**
     * 额外参数，该连接有效
     */
    extraParameters?: Record<string, string>
    /**
     * 额外请求头，该连接有效
     */
    extraHeaders?: Record<string, string>
  }

  /**
   * 额外请求参数，全 client 有效; 会被具体 destination 中的覆盖
   */
  extraParameters?: Record<string, string>

  /**
   * 额外请求头，全 client 有效; 会被具体 destination 中的覆盖
   */
  extraHeaders?: Record<string, string>

  /**
   * websocket 用于消息同步的字段为 syncId, 一般值为请求时的原值，用于同步一次请求与响应
   * 对于由 websocket client 主动发出的通知, 固定使用一个 syncId, 默认为 ”-1“
   */
  reservedSyncId?: string
}

/**
 * 提供 http 回调形式的接口, 可单纯做上报使用
 */
export interface WebhookAdapter {
  /**
   * 回调(上报)地址
   */
  destinations: string[]
  /**
   * 额外自定义请求头
   */
  extraHeaders: {
    Authorization: string
    [key: string]: string
  }
}

/**
 * setting.yml
 */
export interface MiraiApiHttpSetting {
  /**
   * 启用的 adapter, 内置有 http, ws, reverse-ws, webhook
   */
  adapters: Adapter[]

  /**
   * 是否开启认证流程, 若为 true 则建立连接时需要验证 verifyKey
   * @default true
   */
  enableVerify: boolean
  /**
   * 默认由 mirai-api-http 随机生成，建议手动指定。
   * @default "el-psy-congroo"
   */
  verifyKey: string

  /**
   * 开启一些调试信息
   * @default true
   */
  debug?: boolean

  /**
   * 是否开启单 session 模式, 若为 true，则自动创建 session 绑定 console 中登录的 bot
   * 开启后，接口中任何 sessionKey 不需要传递参数
   * 若 console 中有多个 bot 登录，则行为未定义
   * 确保 console 中只有一个 bot 登陆时启用
   * @default false
   */
  singleMode: boolean

  /**
   * 历史消息的缓存大小
   * 同时，也是 http adapter 的消息队列容量
   * @default 4096
   */
  cacheSize: number

  /**
   * adapter 的单独配置，键名与 adapters 项配置相同
   */
  adapterSettings: {
    http: HttpAdapter
    ws: WebsocketAdapter
    'reverse-ws'?: ReverseWebsocketAdapter
    webhook?: WebhookAdapter
  }
}
