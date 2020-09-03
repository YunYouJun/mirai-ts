/**
 * 指令系统
 * @packageDocumentation
 */

import MiraiApiHttp from "./index";

/**
 * https://github.com/project-mirai/mirai-api-http#%E6%8F%92%E4%BB%B6%E7%9B%B8%E5%85%B3console%E7%9B%B8%E5%85%B3
 */
export class Command {
  constructor(public api: MiraiApiHttp) {}

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
      authKey: this.api.config.authKey,
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
      authKey: this.api.config.authKey,
      name,
      args,
    });
    return data;
  }
}
