/* eslint-disable no-console */
import type { Mirai } from "mirai-ts";
import { groupId } from "./config";
import { logger } from "./logger";

export async function miraiApiTest(mirai: Mirai) {
  const friendList = await mirai.api.friendList();
  console.log(friendList);
  console.log(friendList.data);

  const groupList = await mirai.api.groupList();
  console.log(groupList);
  console.log(groupList.data);

  const groupConfig = await mirai.api.groupConfig(groupId);
  console.log(groupConfig);

  mirai.on("message", (msg) => {
    switch (msg.plain) {
      case "mute":
        logger.debug("[mute]");
        mirai.api.mute(120117362, 996955042);
        break;

      default:
        break;
    }
  });

  return {
    friendList,
    groupConfig,
  };
}
