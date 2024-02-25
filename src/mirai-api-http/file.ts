/**
 * 文件操作
 * @packageDocumentation
 */

import type { AxiosResponse } from 'axios'

import type { Api, Contact } from '..'
import type { MiraiApiHttp } from './index'

export type FileInfoResponse = AxiosResponse<
Api.Response.ResponseType<FileInfo>
>

export interface BaseFileOptions {
  /**
   * 文件 ID
   */
  id: string
  /**
   * 文件夹路径, 文件夹允许重名, 不保证准确, 准确定位使用 id
   */
  path?: string
  /**
   * 群号或好友QQ号
   */
  target?: number
  /**
   * 群号
   */
  group?: number
  /**
   * 好友QQ号
   */
  qq?: number
}

/**
 * 群文件信息
 */
export interface FileInfo {
  /**
   * 文件名字
   */
  name: string
  /**
   * 文件 ID
   */
  id: string
  /**
   * 文件对象, 递归类型. null 为存在根目录
   */
  parent: FileInfo
  /**
   * 群信息或好友信息
   */
  contact: Contact.User
  /**
   * 是否文件
   */
  isFile: boolean
  /**
   * 是否文件夹
   */
  isDirectory: boolean
  /**
   * 文件下载信息
   */
  downloadInfo: {
    /**
     * 下载次数
     */
    downloadTimes: number
    /**
     * 上传者QQ
     */
    uploaderId: number
    /**
     * 上传时间
     */
    uploadTime: number
    /**
     * 最后修改时间
     */
    lastModifyTime: number
    /**
     * 文件 sha1 值
     */
    sha1: string
    /**
     * 文件 md5 值
     */
    md5: string
    /**
     * 文件下载 url
     */
    url: string
  }
}

export interface FileListOptions extends BaseFileOptions {
  /**
   * 是否携带下载信息，额外请求，无必要不要携带
   */
  withDownloadInfo?: number
  /**
   * 分页偏移
   */
  offset?: number
  /**
   * 分页大小
   */
  size?: number
}
export type FileListResponse = AxiosResponse<
Api.Response.ResponseType<FileInfo[]>
>

export interface FileInfoOptions extends BaseFileOptions {
  /**
   * 是否携带下载信息，额外请求，无必要不要携带
   */
  withDownloadInfo?: number
}

export type FileInfoParams = Api.Params.RequestParams<FileInfoOptions>

export interface FileMkdirOptions extends BaseFileOptions {
  /**
   * 新建文件夹名
   */
  directoryName: string
}

export type FileMkdirParams = Api.Params.RequestParams<FileMkdirOptions>

export type FileDeleteOptions = BaseFileOptions
export type FileDeleteParams = Api.Params.RequestParams<BaseFileOptions>

export interface FileRenameOptions extends BaseFileOptions {
  /**
   * 新文件名
   */
  renameTo?: string
}
export type FileRenameParams = Api.Params.RequestParams<FileRenameOptions>

export interface FileMoveOptions extends BaseFileOptions {
  /**
   * 移动目标文件夹 id
   */
  moveTo?: string
  /**
   * 移动目标文件路径, 文件夹允许重名, 不保证准确, 准确定位使用 moveTo
   */
  moveToPath?: string
}
export type FileMoveParams = Api.Params.RequestParams<FileMoveOptions>

/**
 * [文件操作 | mirai-api-http](https://github.com/project-mirai/mirai-api-http/blob/master/docs/api/API.md#%E6%96%87%E4%BB%B6%E6%93%8D%E4%BD%9C)
 * [文件操作 Http Adapter](https://github.com/project-mirai/mirai-api-http/blob/master/docs/adapter/HttpAdapter.md#%E6%96%87%E4%BB%B6%E6%93%8D%E4%BD%9C)
 */
export class File {
  constructor(public api: MiraiApiHttp) {}

  // 群文件管理
  /**
   * 获取群文件列表
   * @param target 指定群的群号
   * @param dir 指定查询目录，不填为根目录
   */

  /**
   * 目前仅支持群文件的操作, 所有好友文件的字段为保留字段
   * @param options
   */
  async list(options: FileListOptions) {
    const { data } = await this.api.axios.get<FileInfoParams, FileListResponse>(
      '/file/list',
      {
        params: {
          sessionKey: this.api.sessionKey,
          ...options,
        },
      },
    )
    return data
  }

  /**
   * 获取文件信息
   * @param options
   */
  async info(options: FileInfoOptions) {
    const { data } = await this.api.axios.get<FileInfoParams, FileInfoResponse>(
      '/file/info',
      {
        params: {
          sessionKey: this.api.sessionKey,
          ...options,
        },
      },
    )
    return data
  }

  /**
   * 创建文件夹
   * @param options
   */
  async mkdir(options: FileMkdirOptions) {
    const { data } = await this.api.axios.post<
    FileMkdirParams,
    FileInfoResponse
    >('/file/mkdir', {
      sessionKey: this.api.sessionKey,
      ...options,
    })
    return data
  }

  /**
   * 删除文件
   */
  async delete(options: FileDeleteOptions) {
    const { data } = await this.api.axios.post<
    FileDeleteParams,
    AxiosResponse<Api.Response.BaseResponse>
    >('/file/delete', {
      sessionKey: this.api.sessionKey,
      ...options,
    })
    return data
  }

  /**
   * 移动文件
   * @param options
   */
  async move(options: FileMoveOptions) {
    const { data } = await this.api.axios.post<
    FileMoveParams,
    AxiosResponse<Api.Response.BaseResponse>
    >('/groupFileMove', {
      sessionKey: this.api.sessionKey,
      ...options,
    })
    return data
  }

  /**
   * 重命名文件
   */
  async rename(options: FileRenameOptions) {
    const { data } = await this.api.axios.post<
    FileRenameParams,
    AxiosResponse<Api.Response.BaseResponse>
    >('/groupFileRename', {
      sessionKey: this.api.sessionKey,
      ...options,
    })
    return data
  }
}
