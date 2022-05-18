import { chatTableScheme } from "../constans/db/dbTableSchemes.js";
import {
  SELECT,
  ALL,
  FROM,
  WHERE,
  INSERT,
  INTO,
  NULL,
  VALUES,
  UPDATE,
  SET,
} from "../constans/db/dbRequestElements.js";
import { CHATS_DATA } from "../constans/db/dbTableNames.js";

export const createNewChatRequest = (data) => {
  const {
    title,
    usersId,
    adminsId,
    createDate,
    chatData,
    imageId,
    isGeneral,
    lastChangeDate,
    isAdmin,
  } = data;

  const admId = adminsId ? `'${adminsId}'` : NULL;
  const imgId = imageId ? `'${imageId}'` : NULL;
  const leftPartReq = `${INSERT} ${INTO} ${"`"}${CHATS_DATA}${"`"} ${chatTableScheme}`;
  const uniquePart = `${NULL}, ${admId}, '${title}', '${usersId}', ${imgId}, '${chatData}'`;
  const reqBody = `${uniquePart}, '${createDate}', ${isGeneral}, '${lastChangeDate}', ${isAdmin}`;

  return `${leftPartReq} ${VALUES} (${reqBody})`;
};

export const getAllChatsDataRequest = () =>
  `${SELECT} ${ALL} ${FROM} ${CHATS_DATA}`;

export const getChatDataByIdRequest = (chatId) =>
  `${SELECT} ${ALL} ${FROM} ${CHATS_DATA} ${WHERE} ${"`id`"}=${chatId}`;

export const updateMessageData = (messageData, chatId) => {
  const leftPartReq = `${UPDATE} ${"`"}${CHATS_DATA}${"`"} ${SET}`;
  const bodyReq = `${"`chatHistory`"} = '${messageData}' `;
  const clarificationPartReq = `${WHERE} ${"`"}${CHATS_DATA}${"`"}.${"`id`"}=${chatId}`;
  return `${leftPartReq} ${bodyReq} ${clarificationPartReq}`;
};

//UPDATE `chats_data` SET `imageId` = '1' WHERE `chats_data`.`id` = 73;
export const updateChatImageIdReq = (chatId, imageId) => {
  const leftPartReq = `${UPDATE} ${CHATS_DATA} ${SET} ${"`imageId`"} = '${imageId}'`;
  return `${leftPartReq} ${WHERE} ${CHATS_DATA}.${"`id`"} = '${chatId}'`;
};
