/**
 * 联系实体类型，参考 [mirai-core 命名](https://github.com/mamoe/mirai/tree/master/mirai-core/src/commonMain/kotlin/net.mamoe.mirai/contact)
 * @packageDocumentation
 */

export type Permission = "OWNER" | "ADMINISTRATOR" | "MEMBER";

/**
 * 群的信息
 */
export interface Group {
  /**
   * 群号
   */
  id: number;
  /**
   * 群的群名称
   */
  name: string;
  /**
   * 群中，Bot的群限权
   */
  permission: Permission;
}

/**
 * 基础用户信息
 */
interface BaseUser {
  /**
   * QQ 号
   */
  id: number;
}

/**
 * 好友信息类型
 */
export interface Friend extends BaseUser {
  /**
   * 用户昵称
   */
  nickname: string;
  /**
   * 用户备注
   */
  remark: string;
}

/**
 * 群成员信息类型
 */
export interface Member extends BaseUser {
  /**
   * 群名片
   */
  memberName: string;
  /**
   * 群权限 OWNER、ADMINISTRATOR 或 MEMBER
   */
  permission: Permission;
  /**
   * 群头衔
   */
  specialTitle: string;
  /**
   * 入群时间戳
   */
  joinTimestamp: number;
  /**
   * 上一次发言时间戳
   */
  lastSpeakTimestamp: number;
  /**
   * 剩余禁言时间
   */
  muteTimeRemaining: number;
  /**
   * 所在的群
   */
  group: Group;
}

export type User = Friend | Member;
