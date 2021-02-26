import Mirai from "../src/index";
import { getPokeMessage, getVoiceMessage } from "./message";

const qq = 712727946;
const mahConfig = {
  host: "127.0.0.1",
  port: 4859,
  authKey: "el-psy-congroo",
  enableWebsocket: true,
};

const mirai = new Mirai(mahConfig);

async function app() {
  await mirai.link(qq);
  mirai.on("message", (msg) => {
    console.log(msg);

    // send message to test
    switch (msg.plain) {
      case "Poke":
        msg.reply(getPokeMessage());
        break;
      case "Voice":
        msg.reply(getVoiceMessage());
        break;
      default:
        break;
    }
  });
  mirai.listen();
}

app();
