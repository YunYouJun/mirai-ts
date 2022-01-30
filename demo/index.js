const { Mirai } = require("mirai-ts");
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
// const { Message } = require("mirai-ts");

// 你的 QQ 号
const qq = 712727946;
// 读取你的 `mcl/config/net.mamoe.mirai-api-http/setting.yml` 并解析为 JSON
// 或手动书写对象
const setting = yaml.load(
  fs.readFileSync(
    path.resolve(
      __dirname,
      "../mcl/config/net.mamoe.mirai-api-http/setting.yml"
    ),
    "utf8"
  )
);

const mirai = new Mirai(setting);

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
  const data = await mirai.api.command.send("/help", []);
  console.log("帮助信息:" + data);

  // 处理各种事件类型
  // 事件订阅说明（名称均与 mirai-api-http 中事件名一致）
  // console.log("on other event");
  // https://github.com/project-mirai/mirai-api-http/blob/master/docs/EventType.md#群消息撤回
  mirai.on("GroupRecallEvent", ({ operator }) => {
    const text = `${operator.memberName} 撤回了一条消息，并拜托你不要再发色图了。`;
    mirai.api.sendGroupMessage(text, operator.group.id);
  });

  // 开始监听
  // mirai.listen()
  // 可传入回调函数对监听的函数进行处理，如：
  mirai.listen((msg) => {
    console.log(msg);
  });
}

app();
