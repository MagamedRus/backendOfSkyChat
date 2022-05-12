import {
  SET,
  INSERT,
  INTO,
  VALUES,
  NULL,
  SELECT,
  FROM,
  WHERE,
  ALL,
  UPDATE,
  DELETE,
} from "../constans/db/dbRequestElements.js";
import { USER_FRIENDS } from "../constans/db/dbTableNames.js";
import { userFriendsTableScheme } from "../constans/db/dbTableSchemes.js";
import { getDateInMilliseconds } from "../common/date.js";

export const createFriendReq = (friendId, isAccept = false) => {
  const createdTime = getDateInMilliseconds();
  const leftPartRequest = `${INSERT} ${INTO} ${"`"}${USER_FRIENDS}${"`"} ${userFriendsTableScheme}`;
  return `${leftPartRequest} ${VALUES} (${NULL}, ${friendId}, ${createdTime}, ${isAccept})`;
};

export const deleteFriendByIdReq = (dataId) => {
  const leftPart = `${DELETE} ${FROM} ${USER_FRIENDS}`;
  return `${leftPart} ${WHERE} ${"id"}=${dataId}`;
};

export const setAcceptFriendByIdReq = (friendDataId, isAccept) => {
  const leftPartReq = `${UPDATE} ${"`"}${USER_FRIENDS}${"`"} ${SET} ${"`isAccept`"}=${isAccept}`;
  return `${leftPartReq} ${WHERE} ${USER_FRIENDS}.${"`id`"}=${friendDataId}`;
};

export const getFriendsDataByIdReq = (dataId) => {
  return `${SELECT} ${ALL} ${FROM} ${USER_FRIENDS} ${WHERE} id=${dataId}`;
};
