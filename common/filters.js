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
  const { minAge, maxAge, name, gender, friendsData, login, selfId } =
    filterData;
  let result = usersData.map((el) => {
    const { email, password, registrationDate, ...userData } = el;
    return userData;
  });

  result = result.filter((el) => {
    if (selfId === el.id) return false;
    if (minAge) {
      const elFullDateAge = stringDateToFullDate(el.birthday);
      const elAge = getAgeByBirthDate(elFullDateAge);
      if (elAge <= Number(minAge)) return false;
    }
    if (maxAge) {
      const elFullDateAge = stringDateToFullDate(el.birthday);
      const elAge = getAgeByBirthDate(elFullDateAge);
      if (elAge >= Number(maxAge)) return false;
    }
    if (gender && el.gender !== gender) return false;

    if (name) {
      const { firstName, secondName, lastName } = el;
      const fullName = `${firstName} ${secondName} ${lastName ? lastName : ""}`;
      if (!fullName.includes(name)) return false;
    }
    if (login) {
      const friendLogin = el.login;
      if (!friendLogin.includes(login)) return false;
    }
    if (friendsData) {
      for (let friendData of friendsData) {
        if (friendData.friendId === el.id) return false;
      }
    }

    return true;
  });

  return result;
};

/** Get unique same elements list of two list */
export const getGeneralItems = (dataOne, dataTwo) => {
  const result = [];

  for (let data of dataOne) {
    const dataIndex = dataTwo.indexOf(data);
    if (dataIndex !== -1) {
      result.push(data);
      dataTwo[dataIndex] = null;
    }
  }
  return result;
};
