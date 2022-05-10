import {
  SET,
  INSERT,
  INTO,
  VALUES,
  NULL,
  SELECT,
  ALL,
  FROM,
  WHERE,
  UPDATE,
  AND,
  DELETE,
} from "../constans/db/dbRequestElements.js";
import {
  USER_NOTIFICATIONS_DATA,
  NEW_FRIENDS_NOTIFICATIONS,
} from "../constans/db/dbTableNames.js";
import {
  userNotificationsScheme,
  newFriendsNotifications,
} from "../constans/db/dbTableSchemes.js";
import { getDateInMilliseconds } from "../common/date.js";

export const createNotificationsDataRequest = (userId) => {
  const leftPartRequest = `${INSERT} ${INTO} ${"`"}${USER_NOTIFICATIONS_DATA}${"`"} ${userNotificationsScheme}`;
  return `${leftPartRequest} ${VALUES} (${NULL}, '${userId}', ${NULL}, ${NULL})`;
};

export const createNewFriendNotifactionsReq = (userId, friendId) => {
  const createdTime = getDateInMilliseconds();
  const leftPartRequest = `${INSERT} ${INTO} ${"`"}${NEW_FRIENDS_NOTIFICATIONS}${"`"} ${newFriendsNotifications}`;
  return `${leftPartRequest} ${VALUES} (${NULL}, '${userId}', ${friendId}, ${createdTime}, ${false})`;
};

export const getUserNotificationsDataById = (notificationId) => {
  return `${SELECT} ${ALL} ${FROM} ${USER_NOTIFICATIONS_DATA} ${WHERE} ${"`id`"}=${notificationId}`;
};

export const setUserNotificationFriendList = (
  notificationId,
  newFriendsList
) => {
  const friendList = newFriendsList ? `'${newFriendsList}'` : NULL;
  const leftPartRequest = `${UPDATE} ${USER_NOTIFICATIONS_DATA} ${SET} ${`newFriendsList`}=${friendList}`;
  return `${leftPartRequest} ${WHERE} ${USER_NOTIFICATIONS_DATA}.${"`id`"}=${notificationId}`;
};

export const getFriendNotificationById = (notificationId) => {
  return `${SELECT} ${ALL} ${FROM} ${NEW_FRIENDS_NOTIFICATIONS} ${WHERE} ${"`id`"}=${notificationId}`;
};

export const deleteFriendNotificationById = (notificationId) =>
  `${DELETE} ${FROM} ${NEW_FRIENDS_NOTIFICATIONS} ${WHERE} ${NEW_FRIENDS_NOTIFICATIONS}.${"`id`"}=${notificationId}`;

export const getUserFriendDataReq = (userId, friendId) => {
  const leftPartRequest = `${SELECT} ${ALL} ${FROM} ${USER_NOTIFICATIONS_DATA}`;
  return `${leftPartRequest} ${WHERE} ${"`userId`"}=${userId} ${AND} ${WHERE} ${"`friendsId`"}=${friendId}`;
};
