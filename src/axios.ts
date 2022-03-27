/**
 * 实际上你基本不需要用到它，mirai-ts 实例化时已经自动设置。
 * @packageDocumentation
 */

import type { AxiosStatic } from 'axios'
import axios from 'axios'

/**
 * 初始化 axios
 * @param baseURL 请求的基础 URL
 * @param timeout  请求超时时间
 */
export function init(baseURL?: string, timeout = 0): AxiosStatic {
  if (baseURL) axios.defaults.baseURL = baseURL

  axios.defaults.timeout = timeout

  axios.interceptors.request.use(
    (config) => {
      return config
    },
    (err) => {
      if (process.env.NODE_ENV !== 'production') console.error(err)

      return Promise.reject(err)
    },
  )

  return axios
}
