import { isEmptyString } from "./validations.js";
import { convertStringDateToArr } from "./date.js";

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
  let result = usersData;
  const { minAge, maxAge, name, gender, friendIdList } = filterData;

  if (minAge) {
    const minAgeMilliseconds = convertStringDateToArr(minAge);
    result = result.filter((el) => {
      const elAgeMilliseconds = convertStringDateToArr(el.birthday);
      return elAgeMilliseconds >= minAgeMilliseconds;
    });
  }
  if (maxAge) {
    const maxAgeMilliseconds = convertStringDateToArr(maxAge);
    result = result.filter((el) => {
      const elAgeMilliseconds = convertStringDateToArr(el.birthday);
      return elAgeMilliseconds <= maxAgeMilliseconds;
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
