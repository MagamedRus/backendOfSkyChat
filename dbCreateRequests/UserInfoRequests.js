import {
  INSERT,
  INTO,
  VALUES,
  NULL,
  SELECT,
  ALL,
  FROM,
  WHERE,
  SET,
  UPDATE,
} from "../constans/db/dbRequestElements.js";
import { USER_SELF_DATA, USER_DATA } from "../constans/db/dbTableNames.js";
import {
  userSelfDataTableScheme,
  userDataTableScheme,
} from "../constans/db/dbTableSchemes.js";
//Todo: refactor importsCON

export const createUserSelfDataRequest = (data) => {
  const { id, login, email } = data; //unique value`s
  const { firstName, secondName, lastName } = data; //name
  const { registrationDate, birthday } = data; // dates
  const { password, birthPlace, imageId } = data; //other

  const bPlace = birthPlace ? `'${birthPlace}'` : NULL;
  const imgId = imageId ? `'${imageId}'` : NULL;

  //first part
  const leftPartRequest = `${INSERT} ${INTO} ${"`"}${USER_SELF_DATA}${"`"} ${userSelfDataTableScheme}`;

  //request body
  const bodyRequestId = id ? `'${id}'` : NULL;
  const bodyRequestUniques = `${bodyRequestId}, '${login}', '${email}', '${password}',`;
  const bodyRequestName = `'${firstName}', '${secondName}', '${lastName}',`;
  const bodyRequestDates = `'${registrationDate}', ${bPlace}, '${birthday}', ${imgId}, ${NULL}`;

  return `${leftPartRequest} ${VALUES} (${bodyRequestUniques} ${bodyRequestName} ${bodyRequestDates})`;
};

export const updateUserDataReq = (data, userId) => {
  const leftPartReq = `${UPDATE} ${"`"}${USER_SELF_DATA}${"`"} ${SET}`;
  const password = `${"`password`"} = '${data.password}'`;
  const firstName = `${"`firstName`"} = '${data.firstName}'`;
  const secondName = `${"`secondName`"} = '${data.secondName}'`;
  const lastName = `${"`lastName`"} = '${data.lastName}'`;
  const birthPlace = `${"`birthPlace`"} = '${data.birthPlace}'`;
  const imageId = `${"`imageId`"} = '${data.imageId}'`;
  const phone = `${"`phone`"} = ${data.phone}`;
  const bodyReq = `${password}, ${firstName}, ${secondName}, ${lastName}, ${birthPlace}, ${imageId}`;
  const lastPartReq = `${WHERE} ${"`"}${USER_SELF_DATA}${"`"}.${"`id`"} = ${userId}`;

  return `${leftPartReq} ${bodyReq} ${lastPartReq}`;
};

export const readUserDataRequest = () =>
  `${SELECT} ${ALL} ${FROM} ${USER_SELF_DATA}`;

export const getUserByIdRequest = (id) =>
  `${SELECT} ${ALL} ${FROM} ${USER_SELF_DATA} ${WHERE} ${"`id`"}=${id}`;

export const getUserByEmailRequest = (email) =>
  `${SELECT} ${ALL} ${FROM} ${USER_SELF_DATA} ${WHERE} ${"`email`"}="${email}"`;

export const getUserByLoginRequest = (login) =>
  `${SELECT} ${ALL} ${FROM} ${USER_SELF_DATA} ${WHERE} ${"`login`"}="${login}"`;

export const createUserDataRequest = (
  userId,
  tempDataId,
  notificationsDataId,
  adminChatId
) => {
  const leftPartRequest = `${INSERT} ${INTO} ${"`"}${USER_DATA}${"`"} ${userDataTableScheme}`;
  return `${leftPartRequest} ${VALUES} (${NULL}, ${userId}, ${tempDataId}, ${notificationsDataId}, ${NULL}, ${
    adminChatId || NULL
  })`;
};

export const getUserDataById = (userId) => {
  return `${SELECT} ${ALL} ${FROM} ${USER_DATA} ${WHERE} ${"`selfDataId`"}=${userId}`;
};

export const setUserFriendIdsDataById = (userId, userFriendDataIds) => {
  const leftPartRequest = `${UPDATE} ${USER_DATA} ${SET} ${`userFriendsDataArr`}='${userFriendDataIds}'`;
  return `${leftPartRequest} ${WHERE} ${USER_DATA}.${"`selfDataId`"}=${userId}`;
};

export const setUserDataChatsArrByIdReq = (userId, chatsArr) => {
  const leftPartReq = `${UPDATE} ${USER_DATA} ${SET} ${`userChatsDataArr`}='${chatsArr}'`;
  return `${leftPartReq} ${WHERE} ${USER_DATA}.${"`selfDataId`"}=${userId}`;
};
