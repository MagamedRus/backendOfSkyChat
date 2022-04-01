import {
  mailReg,
  latinAndNumbersReg,
  latinAndCyrrilReg,
  dateReg,
  lettersAndNotOnlyReg,
  numberndNotOnlyReg,
  latinCyrrilNumbReg,
} from "../constans/validations/regularExpressions.js";
import {
  MIN_YEAR,
  MAX_MAIL_LENGTH,
  MAX_LOGIN_LENGTH,
  MIN_LOGIN_LENGTH,
  MAX_NAME_LENGTH,
  MIN_NAME_LENGTH,
  MIN_PASSWORD_LENGTH,
  MIN_LENGTH_BIRTHPLACE,
} from "../constans/validations/userInfo.js";
import { CURRENT_YEAR, CURRENT_MONTH, CURRENT_DAY } from "../constans/date.js";
import { getMonthsLengthList } from "../common/date.js";

export const isString = (variable) => {
  if (typeof variable !== "string") {
    return false;
  }
  return true;
};

export const isValidEMail = (email) => {
  if (!isString(email)) {
    return false;
  }
  const emailLength = email.length;
  return mailReg.test(email) && emailLength < MAX_MAIL_LENGTH;
};

export const isValidLogin = (login) => {
  if (!isString(login)) {
    return false;
  }
  const logLength = login.length;
  const isGoodLength =
    logLength <= MAX_LOGIN_LENGTH && logLength >= MIN_LOGIN_LENGTH;
  return latinAndNumbersReg.test(login) && isGoodLength;
};

export const isValidName = (name) => {
  if (!isString(name)) {
    return false;
  }
  const logLength = name.length;
  const isGoodLength =
    logLength <= MAX_NAME_LENGTH && logLength >= MIN_NAME_LENGTH;
  return latinAndCyrrilReg.test(name) && isGoodLength;
};

export const isValidDate = (date) => {
  let isValid = false; // result
  if (!isString(date)) {
    return false;
  }
  if (dateReg.test(date)) {
    /** Decomposing parametr date */
    const parts = date.split(".");
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);

    /** Getting list of amount of days in choosed year */
    const monthLengthList = getMonthsLengthList(year);

    /** comparing with current date */
    const isLastYear = CURRENT_YEAR === year;
    const isCurrentMonth = CURRENT_MONTH === month;

    /** Final validations with getted data*/
    const isGoodYear = year > MIN_YEAR && year <= CURRENT_YEAR;
    const isGoodMaxMonth = isLastYear ? month <= CURRENT_MONTH : month <= 12;
    const isGoodMonth = month > 0 && isGoodMaxMonth;
    const isGoodMaxDay = isCurrentMonth
      ? day <= CURRENT_DAY
      : day <= monthLengthList[month - 1];
    const isGoodDay = day > 0 && isGoodMaxDay;
    if (isGoodMonth && isGoodYear && isGoodDay) {
      isValid = true;
    }
  }

  return isValid;
};

export const isValidPassword = (password) => {
  let isValid = false; // result

  if (isString(password)) {
    const passwordLength = password.length;
    const isGoodLength = passwordLength > MIN_PASSWORD_LENGTH;
    const isIncludeNumbers = numberndNotOnlyReg.test(password);
    const isIncludeLetters = lettersAndNotOnlyReg.test(password);

    if (isGoodLength && isIncludeLetters && isIncludeNumbers) {
      isValid = true;
    }
  }

  return isValid;
};

export const isValidBirthplace = (birthPlace) => {
  if (!isString(birthPlace)) {
    return false;
  }
  const birthPlaceLength = birthPlace.length;
  const isGoodLength = birthPlaceLength > MIN_LENGTH_BIRTHPLACE;

  return latinCyrrilNumbReg.test(birthPlace) && isGoodLength;
};
