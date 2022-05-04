import {
  INSERT,
  INTO,
  VALUES,
  NULL,
} from "../constans/db/dbRequestElements.js";
import { USER_NOTIFICATIONS_DATA } from "../constans/db/dbTableNames.js";
import { userNotificationsScheme } from "../constans/db/dbTableSchemes.js";

export const createNotificationsDataRequest = (userId) => {
  const leftPartRequest = `${INSERT} ${INTO} ${"`"}${USER_NOTIFICATIONS_DATA}${"`"} ${userNotificationsScheme}`;
  return `${leftPartRequest} ${VALUES} (${NULL}, '${userId}', ${NULL}, ${NULL})`;
};
