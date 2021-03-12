/**
 * mirai-ts 辅助工具
 * @packageDocumentation
 */

/**
 * 头像尺寸（允许传入的参数）
 */
export type AvatarSize = 1 | 2 | 3 | 4 | 5 | 40 | 100 | 140 | 640;

/**
 * 获取 QQ 头像链接
 * @param id
 * @param type 类型
 * @param size 尺寸 px (其他数字测试无法获得头像)
 * - 1: 40*40
 * - 2: 40*40
 * - 3: 100*100
 * - 4: 140*140
 * - 5: 640*640
 * - 40: 40*40
 * - 100: 100*100
 * @returns
 */
export function getAvatarById(
  id: number,
  type: "friend" | "group" = "friend",
  size: AvatarSize = 640
): string | null {
  let url = null;
  if (type === "friend") {
    url = `https://q1.qlogo.cn/g?b=qq&nk=${id}&s=${size}`;
  } else if (type === "group") {
    url = `https://p.qlogo.cn/gh/${id}/${id}/${size}`;
  }
  return url;
}
