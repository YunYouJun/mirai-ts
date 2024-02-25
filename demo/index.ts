import fs from 'node:fs'
import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Mirai } from 'mirai-ts'
import type { MiraiApiHttpSetting } from 'mirai-ts'
import yaml from 'js-yaml'
import consola from 'consola'

const __dirname = dirname(fileURLToPath(import.meta.url))

const qq = 712727946
// setting 可直接读取 setting.yml 或参考 `src/types/setting.ts`
let settingYml = ''
try {
  settingYml = fs.readFileSync(
    path.resolve(
      __dirname,
      '../mcl/config/net.mamoe.mirai-api-http/setting.yml',
    ),
    'utf8',
  )
}
catch (e) {
  consola.error('读取 setting.yml 失败')
  console.error(e)
}

const setting = yaml.load(settingYml) as MiraiApiHttpSetting

const mirai = new Mirai(setting)

async function app() {
  await mirai.link(qq)
  mirai.on('message', (msg) => {
    // eslint-disable-next-line no-console
    console.log(msg)
    // 复读
    msg.reply(msg.messageChain)
  })
  mirai.listen()
}

app()
