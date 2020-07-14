export namespace Config {
  /**
 * 正则表达式
 */
  interface Re {
    pattern: string;
    flags: string;
  }

  /**
   * 匹配配置
   */
  interface Match {
    re?: Re;
    is?: string | string[];
    includes?: string | string[];
  }

  interface Listen {
    friend?: number[];
    group?: number[];
  }

  interface Target {
    friend?: number[];
    group?: number[];
  }

  interface GroupConfig {
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

  interface MemberInfo {
    /**
     * 群名片
     */
    name?: string;
    /**
     * 群头衔
     */
    specialTitle?: string;
  }
}
