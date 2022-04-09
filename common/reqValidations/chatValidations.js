import { isEmptyString } from "../validations.js";
import {
  EMPTY_TITLE_PARAM,
  ADMINS_IDS_MUST_BE_ARRAY,
  EMPTY_ADMINS_IDS,
  USER_IDS_MUST_BE_ARRAY,
  EMPTY_USER_IDS,
} from "../../constans/types/exceptions.js";

export const validNewChatReq = (chatObj) => {
  let errorType = null;

  if (isEmptyString(chatObj.title)) {
    errorType = EMPTY_TITLE_PARAM;
  } else if (!Array.isArray(chatObj.adminsId) && !chatObj.isSingleUser) {
    errorType = ADMINS_IDS_MUST_BE_ARRAY;
  } else if (!chatObj.adminsId[0] && !chatObj.isSingleUser) {
    errorType = EMPTY_ADMINS_IDS;
  } else if (!Array.isArray(chatObj.usersId)) {
    errorType = USER_IDS_MUST_BE_ARRAY;
  } else if (!chatObj.usersId[0]) {
    errorType = EMPTY_USER_IDS;
  }
  return errorType;
};
