import { chatTableScheme } from "../constans/db/dbTableSchemes.js";
import { INSERT, INTO, NULL, VALUES } from "../constans/db/dbRequestElements.js";
import { CHATS_DATA } from "../constans/db/dbTableNames.js";

export const createNewChatRequest = (data) => {
  const { title, usersId, adminsId, createDate, chatData } = data;

  //first part
  const leftPartReq = `${INSERT} ${INTO} ${"`"}${CHATS_DATA}${"`"} ${chatTableScheme}`;

  //req body
  const reqBody = `${NULL}, '${adminsId}', '${title}', '${usersId}', '${chatData}', '${createDate}'`;

  return `${leftPartReq} ${VALUES} (${reqBody})`;
};
