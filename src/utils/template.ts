type BaseCardType = "bilibili";

/**
 * 获取卡片类型
 * @param type
 */
function getInfoByType(type: BaseCardType) {
  const info = {
    icon: "",
    name: "",
  };
  switch (type) {
    case "bilibili":
      info.name = "哔哩哔哩";
      info.icon =
        "http://miniapp.gtimg.cn/public/appicon/432b76be3a548fc128acaa6c1ec90131_200.jpg";
      break;

    default:
      break;
  }
  return info;
}

/**
 * 卡片信息格式
 */
interface CardInfo {
  type?: BaseCardType;
  /**
   * 简介
   */
  brief?: string;
  /**
   * 卡片链接
   */
  url: string;
  /**
   * 卡片标题
   */
  title?: string;
  /**
   * 卡片摘要
   */
  summary?: string;
  /**
   * 卡片封面图
   */
  cover: string;
  /**
   * 卡片图标
   */
  icon?: string;
  /**
   * 卡片名称
   */
  name?: string;
}

/**
 * 生成卡片 XML 消息模版
 * Example:
 * msg.reply([
 *   Message.Xml(
 *     template.card({
 *       type: "bilibili",
 *       url: "https://www.bilibili.com/video/BV1bs411b7aE",
 *       cover:
 *         "https://cdn.jsdelivr.net/gh/YunYouJun/cdn/img/meme/love-er-ci-yuan-is-sick.jpg",
 *       summary: "咱是摘要", // 从前有座山...
 *       title: "咱是标题", // 震惊，xxx！
 *       brief: "咱是简介", // QQ小程序[哔哩哔哩]
 *     })
 *   )
 * ]);
 * @param info
 */
export function card(info: CardInfo) {
  if (info.type) {
    info = Object.assign(getInfoByType(info.type), info);
  }
  return `<?xml version='1.0' encoding='UTF-8' standalone='yes'?><msg templateID="123" url="${info.url}" serviceID="1" action="web" actionData="" a_actionData="" i_actionData="" brief="${info.brief}" flag="0"><item layout="2"><picture cover="${info.cover}"/><title>${info.title}</title><summary>${info.summary}</summary></item><source url="${info.url}" icon="${info.icon}" name="${info.name}" appid="0" action="web" actionData="" a_actionData="tencent0://" i_actionData=""/></msg>`;
}
