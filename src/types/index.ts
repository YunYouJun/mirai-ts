export interface BaseType {
  type: string;
  /**
   * 是否冒泡
   */
  bubbles?: boolean;
  /**
   * 停止冒泡
   */
  stopPropagation?: Function;
}
