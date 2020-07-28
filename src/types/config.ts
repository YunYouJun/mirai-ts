/**
 * 配置类型，为了保证 mirai-ts 纯净，未来可能会被分离
 * @packageDocumentation
 */

/**
 * 正则表达式
 */
export interface Re {
  pattern: string;
  flags: string;
}

/**
 * 匹配配置
 */
export interface Match {
  re?: Re;
  is?: string | string[];
  includes?: string | string[];
}

export interface Listen {
  friend?: number[];
  group?: number[];
}

export interface Target {
  friend?: number[];
  group?: number[];
}

/**
 * 群设置
 */
export interface GroupConfig {
  /**
   * 群名
   */
  name?: string;
  /**
   * 群公告
   */
  announcement?: string;
  /**
   * 是否开启坦白说
   */
  confessTalk?: boolean;
  /**
   * 是否允许群员邀请
   */
  allowMemberInvite?: boolean;
  /**
   * 是否开启自动审批入群
   */
  autoApprove?: boolean;
  /**
   * 是否允许匿名聊天
   */
  anonymousChat?: boolean;
}

export interface MemberInfo {
  /**
   * 群名片
   */
  name?: string;
  /**
   * 群头衔
   */
  specialTitle?: string;
}
