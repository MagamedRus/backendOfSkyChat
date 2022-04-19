import { isEmptyString } from "./validations.js";

export const getOnlyUserHeadersChats = (chatsData, userId) => {
  const strUserId = String(userId);
  const result = chatsData.map((el) => {
    let lastMessage = {};
    const usersInChatList = el.usersId.split(",");
    const isIncludeUser =
      usersInChatList.findIndex((el) => el === strUserId) !== -1;

    if (!isEmptyString(el.chatHistory)) {
      const messagesList = JSON.parse(el.chatHistory);
      lastMessage = messagesList[messagesList.length - 1];
    }

    console.log(el)

    if (isIncludeUser)
      return {
        id: el.id,
        lastChangeDate: el.lastChangeDate,
        isGeneral: el.isGeneral,
        title: el.title,
        lastMessage,
      };
  });
  return result;
};
