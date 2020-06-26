import chalk from "chalk";

const info = (msg: any) => {
  console.log(chalk.blue(msg));
};

const success = (msg: any) => {
  console.log(chalk.green(msg));
};

const warning = (msg: any) => {
  console.log(chalk.yellow(msg));
};

const error = (msg: any) => {
  console.log(chalk.red(msg));
};

export default {
  info,
  success,
  warning,
  error,
};
