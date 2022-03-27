/**
 * 群设置与成员信息设置
 * @packageDocumentation
 */

/**
 * 群设置
 */
export interface GroupConfig {
  /**
   * 群名
   */
  name?: string
  /**
   * 群公告
   */
  announcement?: string
  /**
   * 是否开启坦白说
   */
  confessTalk?: boolean
  /**
   * 是否允许群员邀请
   */
  allowMemberInvite?: boolean
  /**
   * 是否开启自动审批入群
   */
  autoApprove?: boolean
  /**
   * 是否允许匿名聊天
   */
  anonymousChat?: boolean
}

/**
 * 群员信息
 */
export interface MemberInfo {
  /**
   * 群名片
   */
  name?: string
  /**
   * 群头衔
   */
  specialTitle?: string
}
