import {
  INSERT,
  INTO,
  VALUES,
  NULL,
  SELECT,
  ALL,
  FROM,
  WHERE,
} from "../constans/db/dbRequestElements.js";
import {
  USER_SELF_DATA,
  USER_TEMP_DATA,
  USER_DATA,
  USER_NOTIFICATIONS_DATA,
} from "../constans/db/dbTableNames.js";
import {
  userSelfDataTableScheme,
  userDataTableScheme,
  tempDataTableScheme,
  userNotificationsScheme,
} from "../constans/db/dbTableSchemes.js";
//Todo: refactor imports

export const createUserSelfDataRequest = (data) => {
  const { id, login, email } = data; //unique value`s
  const { firstName, secondName, lastName } = data; //name
  const { registrationDate, birthday } = data; // dates
  const { password, birthPlace } = data; //other

  //first part
  const leftPartRequest = `${INSERT} ${INTO} ${"`"}${USER_SELF_DATA}${"`"} ${userSelfDataTableScheme}`;

  //request body
  const bodyRequestId = id ? `'${id}'` : NULL;
  const bodyRequestUniques = `${bodyRequestId}, '${login}', '${email}', '${password}',`;
  const bodyRequestName = `'${firstName}', '${secondName}', '${lastName}',`;
  const bodyRequestDates = `'${registrationDate}', '${birthPlace}', '${birthday}'`;

  return `${leftPartRequest} ${VALUES} (${bodyRequestUniques} ${bodyRequestName} ${bodyRequestDates})`;
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
  notificationsDataId
) => {
  const leftPartRequest = `${INSERT} ${INTO} ${"`"}${USER_DATA}${"`"} ${userDataTableScheme}`;
  return `${leftPartRequest} ${VALUES} (${NULL}, ${userId}, ${tempDataId}, ${notificationsDataId})`;
};

export const createTempDataRequest = () => {
  const leftPartRequest = `${INSERT} ${INTO} ${"`"}${USER_TEMP_DATA}${"`"} ${tempDataTableScheme}`;
  return `${leftPartRequest} ${VALUES} (${NULL}, ${NULL}, ${NULL})`;
};

export const createNotificationsDataRequest = (userId) => {
  const leftPartRequest = `${INSERT} ${INTO} ${"`"}${USER_NOTIFICATIONS_DATA}${"`"} ${userNotificationsScheme}`;
  return `${leftPartRequest} ${VALUES} (${NULL}, '${userId}', ${NULL}, ${NULL})`;
};
