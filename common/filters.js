import { isEmptyString } from "./validations.js";
import { getAgeByBirthDate, stringDateToFullDate } from "./date.js";

export const getOnlyUserHeadersChats = (chatsData, userId) => {
  const strUserId = String(userId);
  let result = [];
  for (let el of chatsData) {
    let lastMessage = {};
    const usersInChatList = el.usersId.split(",");
    const isIncludeUser =
      usersInChatList.findIndex((el) => el === strUserId) !== -1;

    if (!isEmptyString(el.chatHistory)) {
      const messagesList = JSON.parse(el.chatHistory);
      lastMessage = messagesList[messagesList.length - 1];
    }

    isIncludeUser &&
      result.push({
        id: el.id,
        lastChangeDate: el.lastChangeDate,
        isGeneral: el.isGeneral,
        title: el.title,
        lastMessage,
      });
  }
  return result;
};

export const getFilteredUsers = (usersData, filterData) => {
  const { minAge, maxAge, name, gender, friendIdList } = filterData;
  let result = usersData.map((el) => {
    const { email, password, registrationDate, ...userData } = el;
    return userData;
  });

  if (minAge) {
    result = result.filter((el) => {
      const elFullDateAge = stringDateToFullDate(el.birthday);
      const elAge = getAgeByBirthDate(elFullDateAge);
      return elAge >= Number(minAge);
    });
  }
  if (maxAge) {
    result = result.filter((el) => {
      const elFullDateAge = stringDateToFullDate(el.birthday);
      const elAge = getAgeByBirthDate(elFullDateAge);
      return elAge <= Number(maxAge);
    });
  }
  if (gender) {
    result = result.filter((el) => el.gender === gender);
  }
  if (name) {
    result = result.filter((el) => {
      const { firstName, secondName, lastName } = el;
      const fullName = `${firstName} ${secondName} ${lastName ? lastName : ""}`;
      return fullName.includes(name);
    });
  }
  if (friendIdList) {
    result = result.filter((el) => {
      for (let friendId of friendIdList) {
        if (friendId === el.id) return false;
        return true;
      }
    });
  }

  return result;
};
