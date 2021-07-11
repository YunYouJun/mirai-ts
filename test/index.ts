import Mirai, { MessageType, MiraiApiHttpSetting } from "../src/index";
import { getPokeMessage, getVoiceMessage } from "./message";
import { miraiApiTest } from "./api";

import fs from "fs";
import path from "path";
import yaml from "js-yaml";

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

const qq = 712727946;
const mirai = new Mirai(setting);

async function app() {
  await mirai.link(qq);
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
