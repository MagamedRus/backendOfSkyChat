import {
  INSERT,
  INTO,
  VALUES,
  NULL,
} from "../constans/db/dbRequestElements.js";
import { USER_FRIENDS } from "../constans/db/dbTableNames.js";
import { userFriendsTableScheme } from "../constans/db/dbTableSchemes.js";
import { getDateInMilliseconds } from "../common/date.js";

export const addUnacceptedFriendReq = (userId, friendId) => {
  const createdTime = getDateInMilliseconds();
  const leftPartRequest = `${INSERT} ${INTO} ${"`"}${USER_FRIENDS}${"`"} ${userFriendsTableScheme}`;
  return `${leftPartRequest} ${VALUES} (${NULL}, '${userId}', ${friendId}, ${createdTime}, ${false})`;
};
