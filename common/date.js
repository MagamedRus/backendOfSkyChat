/** Get days in month by year */
export const getMonthsLengthList = (year) => {
  let febrary = 28;
  if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) febrary = 29;

  return [31, febrary, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
};

export const getDateInMilliseconds = () => new Date().getTime();

/** Convert string date with format dd.mm.yyyy to milliseconds
 * @param {string} date - 'dd.mm.yyyy'
 * @returns {number} milliseconds
 */
export function stringDateToFullDate(date) {
  const [d, m, y] = date.split(".");
  const milliseconds = new Date(y, m - 1, d);
  return milliseconds;
}

export const getAgeByBirthDate = (birthDate) => {
  const today = new Date();
  const m = today.getMonth() - birthDate.getMonth();
  let age = today.getFullYear() - birthDate.getFullYear();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}