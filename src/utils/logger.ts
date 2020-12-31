/**
 * 辅助工具，输出彩色控制台信息。
 * @packageDocumentation
 */

import chalk from "chalk";

type Color = "green" | "yellow" | "red" | "blue";
interface ColorMap {
  [propName: string]: Color;
}

/**
 * 日志工具类
 */
export default class Logger {
  /**
   * 启用
   */
  enable = true;
  constructor(public prefix = chalk.cyan("[mirai-ts]")) {}

  /**
   * 打印消息
   * @param type 类型
   * @param msg 消息
   */
  print(type: string, msg: any) {
    if (!this.enable) return;

    const color: ColorMap = {
      success: "green",
      warning: "yellow",
      error: "red",
      info: "blue",
    };

    const typeColor = color[type];
    const typeName = `[${type}]`;
    const content = [chalk[typeColor as Color](typeName), msg];

    if (this.prefix) {
      content.unshift(this.prefix);
    }

    console.log(...content);
  }

  /**
   * 输出成功信息（绿色）
   * @param msg 文本
   */
  success(msg: any) {
    this.print("success", msg);
  }

  /**
   * 输出警告信息（黄色）
   * @param msg 文本
   */
  warning(msg: any) {
    this.print("warning", msg);
  }

  /**
   * 输出错误信息（红色）
   * @param msg 文本
   */
  error(msg: any) {
    this.print("error", msg);
  }

  /**
   * 输出提示信息（蓝色）
   * @param msg 文本
   */
  info(msg: any) {
    this.print("info", msg);
  }
}
