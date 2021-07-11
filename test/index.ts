import Mirai, { MessageType } from "../src/index";
import { getPokeMessage, getVoiceMessage } from "./message";
import { miraiApiTest } from "./api";

const qq = 712727946;
const mahConfig = {
  host: "127.0.0.1",
  port: 4859,
  verifyKey: "el-psy-congroo",
  enableWebsocket: true,
};

const mirai = new Mirai(mahConfig);

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
