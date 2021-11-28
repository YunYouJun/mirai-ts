export enum Sex {
  UNKNOWN = "UNKNOWN",
  MALE = "MALE",
  FEMALE = "FEMALE",
}

export interface UserProfile {
  nickname: string;
  email: string;
  age: number;
  level: number;
  /**
   * mirai ?
   */
  sign: string;
  sex: Sex;
}
