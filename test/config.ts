import process from 'node:process'
import dotenv from 'dotenv'

dotenv.config()

export const groupId = 120117362
export const botQQ = Number.parseInt(process.env.BOT_QQ || '')
