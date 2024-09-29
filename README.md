# [mirai-ts](https://github.com/YunYouJun/mirai-ts)

[![docs](https://github.com/YunYouJun/mirai-ts/workflows/docs/badge.svg)](https://yunyoujun.github.io/mirai-ts/)
[![Compatible Version](https://img.shields.io/badge/mirai--api--http-v2.3.3-blue)](https://github.com/project-mirai/mirai-api-http)
[![npm](https://img.shields.io/npm/v/mirai-ts)](https://www.npmjs.com/package/mirai-ts)
[![GitHub](https://img.shields.io/github/license/YunYouJun/mirai-ts)](https://github.com/YunYouJun/mirai-ts)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/9b332231afb643df83b59cc8b4188278)](https://www.codacy.com/gh/YunYouJun/mirai-ts/dashboard?utm_source=github.com&utm_medium=referral&utm_content=YunYouJun/mirai-ts&utm_campaign=Badge_Grade)

<!-- [![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/project-mirai/mirai-api-http?label=mirai-api-http)](https://github.com/project-mirai/mirai-api-http) -->

[mirai-api-http](https://github.com/mamoe/mirai-api-http) 的 JavaScript/TypeScript SDK，附带声明文件，拥有良好的注释和类型提示。可运行于 Node.js 与浏览器端。

![shindo-ai.gif](https://user-images.githubusercontent.com/25154432/110353530-1f9de280-8072-11eb-94b0-addcd8ca1ca4.png)

> 除了 Node.js，它还兼容浏览器端。这意味着你可以使用它来开发 Web 界面与你的 mirai 机器人进行交互。（可以参考还在咕的 [el-bot-web](https://github.com/ElpsyCN/el-bot-web)）

## 如何使用

> 自行配置好你的 [mirai](https://github.com/mamoe/mirai) 与 [mirai-api-http](https://github.com/project-mirai/mirai-api-http)，确保 `localhost:你配置的端口号/about` 是可访问的。
> [settings.yml](https://github.com/project-mirai/mirai-api-http#settingyml%E6%A8%A1%E6%9D%BF) 中 `adapterSettings` 的 `http` 与 `ws` 是必须的。

```sh
npm install mirai-ts
# yarn add mirai-ts

# 尝试新版本（比如 ES Module）
npm i mirai-ts@next
```

> 由于 mirai-api-http 2.x 已经稳定，mirai-ts@latest 为 2.x 版本，如果您想使用 mirai-api-http 1.x，请安装 [mirai-ts@1.x](https://www.npmjs.com/package/mirai-ts/v/1.1.1) 版本。

- [API 文档](https://yunyoujun.github.io/mirai-ts/)
- [2.x 迁移指南](./migrate.md)

## 快速开始

### JavaScript

[示例代码](./demo/index.js)

```sh
node demo/index.js
```

### TypeScript

[示例代码](./demo/index.ts)

```sh
ts-node demo/index.ts
```

### Browser

基于 mirai-ts 开发面向浏览器端的应用程序时，您还需要安装 [events](https://github.com/browserify/events) 以在浏览器端替代 Node.js 原生 events 模块。

```sh
pnpm i events
# yarn add events
# npm install events mirai-ts
```

## Why Typescript & mirai-ts?

> Make JavaScript Great Again!

- 更友好的提示：TypeScript 配合 VSCode 代码提示有奇效。
- 更清晰的语义：函数命名与 mirai-api-http 保持一致。
- 更易懂的注释：因为会用到 QQ 机器人 99.99% 是国人，所以是全中文注释。
- 更优雅的结构：看起来是在自吹自擂，但自我感觉良好。
- 更广泛的平台：支持 Node.js 与浏览器端，以及 WebSocket。

## 简介

### 结构

`types` 目录下为对应类型定义

- `api`: API 发送与响应
  - `response`: API 响应格式
- `contact`: 用户信息格式（如 Friend, Member, Group 等）
- `event-type`: 事件类型
- `message-type`: 消息类型

### 工具类

```js
const { Message, Logger, check, MessageType, EventType } = require('mirai-ts')
```

```ts
import { EventType, Logger, Message, MessageType, check } from 'mirai-ts'
```

> 详情请参见 [API 文档](https://yunyoujun.github.io/mirai-ts/)。

#### [Message](https://yunyoujun.github.io/mirai-ts/modules.html#message)

- `Message`: 生成对应消息的辅助方法，如生成艾特某人的消息 `Message.At(qq)`

> 消息链应当是一个数组，如 `messageChain = [Message.At(qq), Message.Plain('来点色图')]`

#### [Logger](https://yunyoujun.github.io/mirai-ts/classes/logger.html)

简单的日志工具，当然你可以自由使用其他工具替代它。

```ts
import { Logger } from 'mirai-ts'
// 你可以自定义你的前缀
const logger = new Logger({ prefix: '[mirai-ts]' })
logger.success('We are free!')
```

#### [check](https://yunyoujun.github.io/mirai-ts/modules/check.html)

消息匹配与检测。

如判断消息链是否有艾特某人：

```js
const { check } = require('mirai-ts')
// msg 为消息链 MessageChain
// qq 为 QQ 号
check.isAt(msg, qq)

// or just
msg.isAt(qq)
// 留空则判断是否艾特机器人自身
```

## 示例模版

- [el-bot](https://github.com/YunYouJun/el-bot/)：你可以参考它的使用方式，你也可以直接使用它。

el-bot 展示了整个 mirai-ts 的使用流程，并内置了一些如自动应答、转发、命令行、RSS 等常用功能（默认插件），开箱即用。

你只需要一些自定义的配置，而不再需要编写繁琐的脚本内容。

但这并不是束缚，在插件系统中你仍然可以调用机器人所有的上下文，并通过编写插件的形式快速实现你想要的功能。

> 更多请参见文档 [el-bot | El Bot Docs](https://docs.bot.elpsy.cn/)

## 开发

```bash
# clone 本项目
git clone https://github.com/YunYouJun/mirai-ts
cd mirai-ts

# 安装 mirai-console-loader，放置于 `mirai-ts/mcl` 文件夹下
# https://github.com/iTXTech/mirai-console-loader
mkdir mcl
cd mcl
# 修改链接下载 mcl 对应版本
wget https://github.com/iTXTech/mirai-console-loader/releases/download/v2.1.1/mcl-2.1.1.zip
unzip mcl-2.1.1.zip
chmod +x mcl
./mcl

# 使用 mcl 安装 mirai-api-http
# https://github.com/project-mirai/mirai-api-http#%E5%AE%89%E8%A3%85mirai-api-http
./mcl --update-package net.mamoe:mirai-api-http --channel stable-v2 --type plugin
# mcl 自动更新
./mcl -u

cd ..
pnpm mcl

# 参考 https://github.com/project-mirai/mirai-login-solver-selenium 获取 ticket

# 开发（监听文件变动并构建）（打开新终端窗口）
pnpm dev

# 启动 demo（打开新终端窗口）
pnpm demo
```
