/**
 * 辅助工具，输出彩色控制台信息。
 * @packageDocumentation
 */

import chalk from "chalk";

const log = (msg: any) => {
  console.log(chalk.cyan("[mirai-ts]"), msg);
};

/**
 * 输出提示信息（蓝色）
 * @param msg 文本
 */
const info = (msg: any) => {
  log(chalk.blue(msg));
};

/**
 * 输出成功信息（绿色）
 * @param msg 文本
 */
const success = (msg: any) => {
  log(chalk.green(msg));
};

/**
 * 输出警告信息（黄色）
 * @param msg 文本
 */
const warning = (msg: any) => {
  log(chalk.yellow(msg));
};

/**
 * 输出错误信息（红色）
 * @param msg 文本
 */
const error = (msg: any) => {
  log(chalk.red(msg));
};

export { info, success, warning, error };
