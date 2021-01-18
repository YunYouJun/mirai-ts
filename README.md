# [mirai-ts](https://github.com/YunYouJun/mirai-ts)

[![docs](https://github.com/YunYouJun/mirai-ts/workflows/docs/badge.svg)](https://www.yunyoujun.cn/mirai-ts/)
[![Compatible Version](https://img.shields.io/badge/mirai--api--http-v1.9.6-blue)](https://github.com/project-mirai/mirai-api-http)
[![npm](https://img.shields.io/npm/v/mirai-ts)](https://www.npmjs.com/package/mirai-ts)
![GitHub top language](https://img.shields.io/github/languages/top/YunYouJun/mirai-ts)
[![GitHub](https://img.shields.io/github/license/YunYouJun/mirai-ts)](https://github.com/YunYouJun/mirai-ts)

<!-- [![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/project-mirai/mirai-api-http?label=mirai-api-http)](https://github.com/project-mirai/mirai-api-http) -->

[mirai-api-http](https://github.com/mamoe/mirai-api-http) 的 TypeScript SDK，编译为 JavaScript 发布。附带声明文件，拥有良好的注释和类型提示。

> 除此之外，它还兼容浏览器端。这意味着你可以使用它来开发 Web 界面与你的 mirai 机器人进行交互。（可以参考还在咕的 [el-bot-web](https://github.com/ElpsyCN/el-bot-web)）

## 如何使用

```sh
npm install mirai-ts
# yarn add mirai-ts
```

- [API 文档](https://www.yunyoujun.cn/mirai-ts/)

## 快速开始

### JavaScript

```js
const Mirai = require("mirai-ts");

// 你的 QQ 号
const qq = 114514;
// 请与 `mcl/config/net.mamoe.mirai-api-http/setting.yml` 保持一致
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
  await mirai.link(qq);

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
  // 可传入回调函数对监听的函数进行处理，如：
  // mirai.listen((msg) => {
  //   console.log(msg)
  // })
}

app();
```

### TypeScript

```ts
import Mirai from "mirai-ts";

const qq = 114514;
const mahConfig = {
  host: "你的 IP 地址" || "127.0.0.1",
  port: 你的端口号 || 8080,
  authKey: "你的 authKey" || "el-psy-congroo",
  enableWebsocket: false,
};

const mirai = new Mirai(mahConfig);

async function app() {
  await mirai.link(qq);
  mirai.on("message", (msg) => {
    console.log(msg);
    // 复读
    msg.reply(msg.messageChain);
  });
  mirai.listen();
}

app();
```

## 其他

```js
const { Message, log, check, MessageType, EventType } = require("mirai-ts");
```

```ts
import { Message, log, check, MessageType, EventType } from "mirai-ts";
```

### [Message](https://www.yunyoujun.cn/mirai-ts/modules/_src_message_.html)

- `Message`: 生成对应消息的辅助方法，如生成艾特某人的消息 `Message.At(qq)`

> 消息链应当是一个数组，如 `messageChain = [Message.At(qq), Message.Plain('来点色图')]`

### [logger](https://www.yunyoujun.cn/mirai-ts/modules/_src_utils_logger_.html)

```ts
import { Logger } from "mirai-ts";
const logger = new Logger();
logger.success("We are free!");
```

### [check](https://www.yunyoujun.cn/mirai-ts/modules/_src_utils_check_.html)

消息匹配与检测。

如判断消息链是否有艾特某人：

```js
const { check } = require("mirai-ts");
// msg 为消息链 MessageChain
// qq 为 QQ 号
check.isAt(msg, qq);

// or just
msg.isAt(qq);
// 留空则判断是否艾特机器人自身
```

## 结构

`types` 目录下为对应类型定义

- `api`: API 发送与响应格式
- `contact`: 用户信息格式（如 Friend, Member, Group 等）
- `event-type`: 事件类型
- `message-type`: 消息类型

## 示例模版

- [el-bot](https://github.com/YunYouJun/el-bot/)：你可以参考它的使用方式，你也可以直接使用它。

el-bot 展示了整个 mirai-ts 的使用流程，并内置了一些如自动应答、转发、命令行、RSS 等常用功能（默认插件），开箱即用。

你只需要一些自定义的配置，而不再需要编写繁琐的脚本内容。

但这并不是束缚，在插件系统中你仍然可以调用机器人所有的上下文，并通过编写插件的形式快速实现你想要的功能。

> 更多请参见文档 [el-bot | El Bot Docs](https://docs.bot.elpsy.cn/)

## Why Typescript & mirai-ts?

- 更友好的控制台消息错误提示
- 更清晰的语义
- 更易懂的注释
- 更优雅的结构
