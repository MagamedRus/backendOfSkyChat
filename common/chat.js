import { getDateInMilliseconds } from "./date.js";
import { isEmptyString } from "./validations.js";

export function changeMessageData(messagesData, newMessage) {
  let messagesList = isEmptyString(messagesData)
    ? []
    : JSON.parse(messagesData);
  let result = new Array(messagesList);
  if (newMessage?.id != undefined) {
    const existMessageIndex = messagesList.findIndex(
      (el) => el.id == newMessage.id
    );
    const isExist = existMessageIndex !== -1;
    if (isExist) {
      const isSameMessage =
        messagesList[existMessageIndex].messageText === newMessage.messageText;
      if (!isSameMessage) {
        messagesList[existMessageIndex] = {
          ...messagesList[existMessageIndex],
          messageText: newMessage.messageText,
          isReduct: true,
        };
      }
    }
  } else {
    const messagesLength = messagesList.length;
    const newMessageId =
      messagesLength > 0 ? messagesList[messagesLength - 1].id + 1 : 0;
    const newMessageObj = {
      id: newMessageId,
      userId: newMessage.userId,
      isReduct: false,
      messageText: newMessage.messageText,
      messageDate: getDateInMilliseconds(),
    };
    messagesList.push(newMessageObj);
  }
  result = JSON.stringify(messagesList);
  return result;
}
