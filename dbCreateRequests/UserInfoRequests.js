import {
  INSERT,
  INTO,
  VALUES,
  NULL,
  SELECT,
  ALL,
  FROM,
} from "../constans/db/dbRequestElements.js";
import { USER_DATA } from "../constans/db/dbTableNames.js";
import { userDataTableScheme } from "../constans/db/dbTableSchemes.js";

export const createUserDataRequest = (data) => {
  const { id, login, email } = data; //unique value`s
  const { firstName, secondName, lastName } = data; //name
  const { registrationDate, birthdate } = data; // dates
  const { password, birthPlace } = data; //other

  //first part
  const leftPartRequest = `${INSERT} ${INTO} ${USER_DATA} ${userDataTableScheme}`;

  //request body
  const bodyRequestId = id ? `'${id}'` : NULL;
  const bodyRequestUniques = `${bodyRequestId} '${login}' '${email}' '${password}'`;
  const bodyRequestName = `'${firstName}' '${secondName}' '${lastName}'`;
  const bodyRequestDates = `'${registrationDate}' '${birthPlace}' '${birthdate}'`;

  return `${leftPartRequest} ${VALUES} ${bodyRequestUniques} ${bodyRequestName} ${bodyRequestDates}`;
};

export const readUserDataRequest = () =>
  `${SELECT} ${ALL} ${FROM} ${USER_DATA}`;

//Todo: add delete and change
