const Mirai = require("mirai-ts")
const { Message } = require("mirai-ts")
// 你的 QQ 号
const qq = 712727946
// 请与 plugins/MiraiAPIHTTP/setting.yml 保持一致
const mahConfig = {
  host: "localhost",
  port: 4859,
  authKey: "el-psy-congroo",
  // 推荐 true，websocket 无须轮询，更少占用资源。
  enableWebsocket: true,
}

const mirai = new Mirai(mahConfig)

async function app() {
  // 登录 QQ
  await mirai.login(qq)

  console.log(Message)

  // 对收到的消息进行处理
  // message 本质相当于同时绑定了 FriendMessage GroupMessage TempMessage
  // 你也可以单独对某一类消息进行监听
  // console.log("on message");
  mirai.on("message", (msg) => {
    console.log(msg)
    // 复读
    msg.reply(msg.messageChain)
  })

  // 调用 mirai-ts 封装的 mirai-api-http 发送指令
  console.log("send command help")
  const data = await mirai.api.command.send("help", [])
  console.log("帮助信息:" + data)

  // 处理各种事件类型
  // 事件订阅说明（名称均与 mirai-api-http 中事件名一致）
  // https://github.com/RedBeanN/node-mirai/blob/master/event.md
  // console.log("on other event");
  // https://github.com/project-mirai/mirai-api-http/blob/master/EventType.md#群消息撤回
  mirai.on("GroupRecallEvent", ({ operator }) => {
    const text = `${operator.memberName} 撤回了一条消息，并拜托你不要再发色图了。`
    console.log(text)
    mirai.api.sendGroupMessage(text, operator.group.id)
  })

  // 开始监听
  mirai.listen()
  // 传入参数可以设置轮训间隔的 ms，譬如：
  // mirai.listen(500)
}

app()
