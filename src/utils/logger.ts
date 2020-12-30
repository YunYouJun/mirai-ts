/**
 * 辅助工具，输出彩色控制台信息。
 * @packageDocumentation
 */

import chalk from "chalk";

/**
 * 日志工具类
 */
export default class Logger {
  constructor(public prefix = chalk.cyan("[mirai-ts]")) {}

  /**
   * 输出成功信息（绿色）
   * @param msg 文本
   */
  success(msg: any) {
    console.log(this.prefix, chalk.green("[success]"), msg);
  }

  /**
   * 输出警告信息（黄色）
   * @param msg 文本
   */
  warning(msg: any) {
    console.log(this.prefix, chalk.yellow("[warning]"), msg);
  }

  /**
   * 输出错误信息（红色）
   * @param msg 文本
   */
  error(msg: any) {
    console.log(this.prefix, chalk.red("[error]"), msg);
  }

  /**
   * 输出提示信息（蓝色）
   * @param msg 文本
   */
  info(msg: any) {
    console.log(this.prefix, chalk.blue("[info]"), msg);
  }
}
