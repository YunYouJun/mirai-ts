/**
 * 实际上你基本不需要用到它，mirai-ts 实例化时已经自动设置。
 * @packageDocumentation
 */

import axios, { AxiosStatic } from "axios";
import { log } from ".";

/**
 * 初始化 axios
 * @param baseURL 请求的基础 URL
 * @param timeout  请求超时时间
 */
export function init(baseURL: string, timeout: number = 3000): AxiosStatic {
  axios.defaults.baseURL = baseURL;
  axios.defaults.timeout = timeout;

  axios.interceptors.request.use(function (config) {
    return config;
  }, function (error) {
    log.error('请求发送失败');
    return Promise.reject(error);
  });

  return axios;
}
