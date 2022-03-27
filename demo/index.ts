import fs from "fs";
import path from "path";
import { Mirai } from "mirai-ts";
import type { MiraiApiHttpSetting } from "mirai-ts";
import yaml from "js-yaml";

const qq = 712727946;
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

async function app() {
  await mirai.link(qq);
  mirai.on("message", (msg) => {
    // eslint-disable-next-line no-console
    console.log(msg);
    // 复读
    msg.reply(msg.messageChain);
  });
  mirai.listen();
}

app();
