export namespace Contact {
  type Permission = "OWNER" | "ADMINISTRATOR" | "MEMBER";

  /**
   * 群的信息
   */
  interface Group {
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
  interface Friend extends BaseUser {
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
  interface Member extends BaseUser {
    /**
     * 群名片
     */
    memberName: string;
    /**
     * 群权限 OWNER、ADMINISTRATOR或MEMBER
     */
    permission: Permission;
    /**
     * 所在的群
     */
    group: Group;
  }

  type User = Friend | Member;
}
