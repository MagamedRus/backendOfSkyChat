import {
  isValidEMail,
  isValidLogin,
  isValidName,
  isValidDate,
  isValidPassword,
  isValidBirthplace,
} from "../validations.js";
import {
  INCORRECT_BIRTH_PLACE,
  INCORRECT_EMAIL,
  INCORRECT_LOGIN,
  INCORRECT_FIRST_NAME,
  INCORRECT_SECOND_NAME,
  INCORRECT_LAST_NAME,
  INCORRECT_BIRTHDAY,
  INCORRECT_REGISTRATION_DATE,
  INCORRECT_PASSWORD,
} from "../../constans/types/exceptions.js";

export const validUserInfoPostReq = (userInfoObj) => {
  let errorType = null;

  if (!isValidLogin(userInfoObj.login)) {
    errorType = INCORRECT_LOGIN;
  } else if (!isValidEMail(userInfoObj.email)) {
    errorType = INCORRECT_EMAIL;
  } else if (!isValidName(userInfoObj.firstName)) {
    errorType = INCORRECT_FIRST_NAME;
  } else if (!isValidName(userInfoObj.secondName)) {
    errorType = INCORRECT_SECOND_NAME;
  } else if (userInfoObj.lastName && !isValidName(userInfoObj.lastName)) {
    errorType = INCORRECT_LAST_NAME;
  } else if (!isValidDate(userInfoObj.registrationDate)) {
    errorType = INCORRECT_REGISTRATION_DATE;
  } else if (!isValidDate(userInfoObj.birthday)) {
    errorType = INCORRECT_BIRTHDAY;
  } else if (!isValidPassword(userInfoObj.password)) {
    errorType = INCORRECT_PASSWORD;
  } else if (
    userInfoObj.birthPlace &&
    !isValidBirthplace(userInfoObj.password)
  ) {
    errorType = INCORRECT_BIRTH_PLACE;
  }

  return errorType;
};
