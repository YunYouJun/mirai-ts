import Mirai from "mirai-ts";

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
    // 复读
    msg.reply(msg.messageChain);
  });
  mirai.listen();
}

app();
