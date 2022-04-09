import { chatTableScheme } from "../constans/db/dbTableSchemes.js";
import {
  SELECT,
  ALL,
  FROM,
  INSERT,
  INTO,
  NULL,
  VALUES,
} from "../constans/db/dbRequestElements.js";
import { CHATS_DATA } from "../constans/db/dbTableNames.js";

export const createNewChatRequest = (data) => {
  const {
    title,
    usersId,
    adminsId,
    createDate,
    chatData,
    isGeneral,
    lastChangeDate,
  } = data;

  //first part
  const leftPartReq = `${INSERT} ${INTO} ${"`"}${CHATS_DATA}${"`"} ${chatTableScheme}`;
  const uniquePart = `${NULL}, '${adminsId}', '${title}', '${usersId}', '${chatData}'`;
  const reqBody = `${uniquePart}, '${createDate}', ${isGeneral}, '${lastChangeDate}'`;

  return `${leftPartReq} ${VALUES} (${reqBody})`;
};

export const getAllChatsDataRequest = () =>
  `${SELECT} ${ALL} ${FROM} ${CHATS_DATA}`;
