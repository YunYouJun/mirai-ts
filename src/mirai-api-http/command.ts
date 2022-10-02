/**
 * 指令系统
 * @packageDocumentation
 * https://github.com/project-mirai/mirai-api-http/blob/master/mirai-api-http/src/main/kotlin/net/mamoe/mirai/api/http/adapter/internal/consts/paths.kt
 */

import type { AxiosResponse } from 'axios'
import type { Api, MessageType } from '../types'
import type { MiraiApiHttp } from './index'

export interface CommandInfo {
  name: string
  sender: number
  group: number
  args: string[]
}

/**
 * [插件相关、Console相关 | mirai-api-http](https://github.com/project-mirai/mirai-api-http#%E6%8F%92%E4%BB%B6%E7%9B%B8%E5%85%B3console%E7%9B%B8%E5%85%B3)
 */
export class Command {
  constructor(public api: MiraiApiHttp) {}

  /**
   * 监听指令
   * - 当指令通过好友消息发送时，sender 为好友 QQ 号，group 为 0
   * - 当指令通过群组消息发送时，sender 为发送人 QQ 号，group 为群号
   * - 当指令通过其他方式发送时，如控制台、HTTP 接口等，sender 和 group 均为 0
   */
  async listen(): Promise<CommandInfo> {
    const { data } = (await this.api.axios.post('/cmd', {
      sessionKey: this.api.sessionKey,
    })) as AxiosResponse<CommandInfo>
    return data
  }

  /**
   * 注册指令
   * @param name 指令名
   * @param alias 指令别名
   * @param description 指令描述
   * @param usage 使用说明，会在指令执行错误时显示
   */
  async register(
    name: string,
    alias: string[],
    description: string,
    usage?: string,
  ) {
    const { data } = await this.api.axios.post<Api.Params.RequestParams<{
      name: string
      alias: string[]
      description: string
      usage?: string
    }>>('/cmd/register', {
      sessionKey: this.api.sessionKey,
      name,
      alias,
      description,
      usage,
    })
    return data
  }

  /**
   * 发送指令
   * @param command 命令与参数
   */
  async execute(command: string[]) {
    const { data } = await this.api.axios.post<
      Api.Params.RequestParams<{ command: MessageType.MessageChain }>,
      AxiosResponse<Api.Response.BaseResponse>
    >('/cmd/execute', {
      sessionKey: this.api.sessionKey,
      command: [{
        type: 'Plain',
        text: command.join(' '),
      }],
    })
    return data
  }
}
