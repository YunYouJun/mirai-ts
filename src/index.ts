/**
 * mirai-ts 默认导出内容
 * @packageDocumentation
 */

import { Mirai } from './mirai'

export * from './mirai'

export type MiraiInstance = Mirai

export * as Message from './message'
export * from './mirai-api-http'

// 工具
export * from './utils'
// https://www.npmjs.com/package/@yunyoujun/logger
export { Logger } from '@yunyoujun/logger'

// 类型
export * from './types'

export default Mirai
