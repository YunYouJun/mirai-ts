/* eslint-disable no-console */
import fs from "fs";
import path from "path";
import Mirai from "mirai-ts";
import type { MessageType, MiraiApiHttpSetting } from "mirai-ts";
import yaml from "js-yaml";
import { getPokeMessage, getVoiceMessage } from "./message";
import { miraiApiTest } from "./api";

import { botQQ } from "./config";

// setting 可直接读取 setting.yml 或参考 `src/types/setting.ts`
const setting = yaml.load(
  fs.readFileSync(
    path.resolve(
      __dirname,
      "../mcl/config/net.mamoe.mirai-api-http/setting.yml"
    ),
    "utf8"
  )
) as MiraiApiHttpSetting;

const mirai = new Mirai(setting);

// 你也可以使用默认配置，但最好配置一下你的 verifyKey
// const mirai = new Mirai();

async function app() {
  await mirai.link(botQQ);
  mirai.on("message", (msg) => {
    console.log(msg);

    let msgChain: MessageType.MessageChain;
    // send message to test
    switch (msg.plain) {
      case "Poke":
        msgChain = getPokeMessage();
        break;
      case "Voice":
        msgChain = getVoiceMessage();
        break;
      default:
        msgChain = msg.messageChain;
        break;
    }
    console.log(msgChain);
    msg.reply(msgChain);
  });

  await miraiApiTest(mirai);

  mirai.listen();
}

app();
