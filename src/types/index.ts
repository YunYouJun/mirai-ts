export * from './setting'

export * from './profile'

export * as Api from './api'
export * as Config from './config'
export * as Contact from './contact'
export { MessageType } from './message-type'
export * as EventType from './event-type'

/**
 * mirai-ts 自定义配置项，与 mirai-api-http setting 相区别
 */
export interface MiraiOptions {
  http?: {
    address?: string
  }
  ws?: {
    address?: string
    /**
     * 心跳间隔
     * @default 60000
     */
    heartbeatInterval?: number
  }
}
