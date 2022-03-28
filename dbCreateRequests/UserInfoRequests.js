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
  /** Thin this variable, should look like better */
  const leftPartRequest = `${INSERT} ${INTO} ${USER_DATA} ${userDataTableScheme}`;

  const bodyRequestId = data.id ? `'${data.id}'` : NULL;
  const bodyRequestUniques = `${bodyRequestId} '${data.login}' '${data.email}'`;
  const bodyRequestName = `'${data.firstName}' '${data.secondName}' '${data.lastName}'`;
  const bodyRequestDates = `'${data.registrationDate}' '${data.birthPlace}' '${data.birthdate}'`;

  return `${leftPartRequest} ${VALUES} ${bodyRequestUniques} ${bodyRequestName} ${bodyRequestDates}`;
};

export const readUserDataRequest = `${SELECT} ${ALL} ${FROM} ${USER_DATA}`;

//Todo: add delete and 