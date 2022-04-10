import { isEmptyString } from "../validations.js";
import {
  EMPTY_TITLE_PARAM,
  ADMINS_IDS_MUST_BE_ARRAY,
  EMPTY_ADMINS_IDS,
  USER_IDS_MUST_BE_ARRAY,
  EMPTY_USER_IDS,
  NOT_FOUND_IS_GENERAL_PARAM,
} from "../../constans/types/exceptions.js";

export const validNewChatReq = (chatObj) => {
  let errorType = null;

  if (isEmptyString(chatObj.title)) {
    errorType = EMPTY_TITLE_PARAM;
  } else if (!Array.isArray(chatObj.adminsId) && chatObj.isGeneral) {
    errorType = ADMINS_IDS_MUST_BE_ARRAY;
  } else if (!chatObj.adminsId[0] && chatObj.isGeneral) {
    errorType = EMPTY_ADMINS_IDS;
  } else if (!Array.isArray(chatObj.usersId)) {
    errorType = USER_IDS_MUST_BE_ARRAY;
  } else if (!chatObj.usersId[0]) {
    errorType = EMPTY_USER_IDS;
  } else if (typeof chatObj.isGeneral !== "boolean") {
    errorType = NOT_FOUND_IS_GENERAL_PARAM;
  }
  return errorType;
};

export const isIncludeUser = (chatData, userId) => {
  const { usersId } = chatData;
  const usersIdArr = usersId.split(",");
  const stringedUserId = String(userId);
  const userIdIndex = usersIdArr.findIndex((el) => el === stringedUserId);
  const isInclude = userIdIndex !== -1;
  return isInclude;
};
