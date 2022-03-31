/** Get days in month by year */
export const getMonthsLengthList = (year) => {
  let febrary = 28;
  if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) febrary = 29;

  return [31, febrary, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
};
