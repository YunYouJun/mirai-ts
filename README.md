# [mirai-ts](https://github.com/YunYouJun/mirai-ts)

[![docs](https://github.com/YunYouJun/mirai-ts/workflows/docs/badge.svg)](https://www.yunyoujun.cn/mirai-ts/)
[![npm](https://img.shields.io/npm/v/mirai-ts)](https://www.npmjs.com/package/mirai-ts)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/YunYouJun/mirai-ts.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/YunYouJun/mirai-ts/context:javascript)
![GitHub top language](https://img.shields.io/github/languages/top/YunYouJun/mirai-ts)
[![GitHub](https://img.shields.io/github/license/YunYouJun/mirai-ts)](https://github.com/YunYouJun/mirai-ts)

[mirai-api-http](https://github.com/mamoe/mirai-api-http) 的 TypeScript SDK，编译为 JavaScript 发布。附带声明文件，拥有良好的注释和类型提示。

您也可以直接引用其中的 TypeScript。

## 如何使用

```sh
npm install mirai-ts
# yarn add mirai-ts
```

- [API 文档](https://www.yunyoujun.cn/mirai-ts/)

## 快速开始

```js
const Mirai = require("mirai-ts");

// 你的 QQ 号
const qq = 114514;
// 请与 plugins/MiraiAPIHTTP/setting.yml 保持一致
const mahConfig = {
  host: "你的 IP 地址" || "127.0.0.1",
  port: 你的端口号 || 4859,
  authKey: "你的 authKey" || "el-psy-congroo",
  // 推荐 true，websocket 无须轮询，更少占用资源。
  enableWebsocket: false,
};

const mirai = new Mirai(mahConfig);

async function app() {
  // 登录 QQ
  await mirai.login(qq);

  // 对收到的消息进行处理
  // message 本质相当于同时绑定了 FriendMessage GroupMessage TempMessage
  // 你也可以单独对某一类消息进行监听
  // console.log("on message");
  mirai.on("message", (msg) => {
    console.log(msg);
    // 复读
    msg.reply(msg.messageChain);
  });

  // 调用 mirai-ts 封装的 mirai-api-http 发送指令
  console.log("send command help");
  const data = await mirai.api.command.send("help", []);
  console.log("帮助信息:" + data);

  // 处理各种事件类型
  // 事件订阅说明（名称均与 mirai-api-http 中事件名一致）
  // https://github.com/RedBeanN/node-mirai/blob/master/event.md
  // console.log("on other event");
  // https://github.com/project-mirai/mirai-api-http/blob/master/EventType.md#群消息撤回
  mirai.on("GroupRecallEvent", ({ operator }) => {
    const text = `${operator.memberName} 撤回了一条消息，并拜托你不要再发色图了。`;
    console.log(text);
    mirai.api.sendGroupMessage(text, operator.group.id);
  });

  // 开始监听
  mirai.listen();
  // 传入参数可以设置轮训间隔的 ms，譬如：
  // mirai.listen(500)
}

app();
```

### TypeScript

```ts
import Mirai from "mirai-ts"

const qq = 114514;
const mahConfig = {
  host: '你的 IP 地址' || '127.0.0.1',
  port: 你的端口号 || 8080,
  authKey: "你的 authKey" || "el-psy-congroo",
  enableWebsocket: false,
};

const mirai = new Mirai(mahConfig);

async function app() {
  await mirai.login(qq);
  mirai.on("message", (msg) => {
    console.log(msg);
    // 复读
    msg.reply(msg.messageChain);
  });
  mirai.listen()
}

app();
```

## 示例模版

- [el-bot](https://github.com/ElpsyCN/el-bot/)：你可以参考它的使用方式，你也可以直接使用它。

el-bot 展示了整个 mirai-ts 的使用流程，并内置了一些如自动应答、转发、命令行、RSS 等常用功能（默认插件），开箱即用。

你只需要一些自定义的配置，而不再需要编写繁琐的脚本内容。

但这并不是束缚，在插件系统中你仍然可以调用机器人所有的上下文，并通过编写插件的形式快速实现你想要的功能。

> 更多请参见文档 [el-bot | El Bot Docs](https://docs.bot.elpsy.cn/js/)

## Why Typescript & mirai-ts?

- 更友好的控制台消息错误提示
- 更清晰的语义
- 更易懂的注释
- 更优雅的结构
