/**
 * 指令系统
 * @packageDocumentation
 */

import MiraiApiHttp from "./index";

interface CommandInfo {
  name: string;
  sender: number;
  group: number;
  args: string[];
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
    const { data } = await this.api.axios.post("/command", {
      verifyKey: this.api.setting.verifyKey,
    });
    return data;
  }

  /**
   * 注册指令
   * @param name 指令名
   * @param alias 指令别名
   * @param description 指令描述
   * @param usage 指令描述，会在指令执行错误时显示
   */
  async register(
    name: string,
    alias: string[],
    description: string,
    usage?: string
  ) {
    const { data } = await this.api.axios.post("/command/register", {
      verifyKey: this.api.setting.verifyKey,
      name,
      alias,
      description,
      usage,
    });
    return data;
  }

  /**
   * 发送指令
   * @param name 指令名
   * @param args 指令参数
   */
  async send(name: string, args: string[]) {
    const { data } = await this.api.axios.post("/command/send", {
      verifyKey: this.api.setting.verifyKey,
      name,
      args,
    });
    return data;
  }
}
