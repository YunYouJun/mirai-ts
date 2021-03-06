import Mirai from "../src";
import { groupId } from "./config";

export async function miraiApiTest(mirai: Mirai) {
  const friendList = await mirai.api.friendList();
  console.log(friendList);

  const groupConfig = await mirai.api.groupConfig(groupId);
  console.log(groupConfig);

  return {
    friendList,
    groupConfig,
  };
}
