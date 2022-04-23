import { WebSocketServer } from "ws";
import { isString } from "../common/validations.js";
import { getSyncDBConn } from "../common/sqlConnection.js";
import {
  getAllChatsDataRequest,
  getChatDataByIdRequest,
  updateMessageData,
} from "../dbCreateRequests/ChatRequests.js";
import { changeMessageData } from "../common/chat.js";
import { wsReqTypes } from "../constans/types/websocket.js";
import { validMessageChatReq } from "../common/reqValidations/chatValidations.js";
import {
  NOT_EXIST_CHAT,
  NOT_ALLOWED_CHAT,
} from "../constans/types/exceptions.js";

class WebSocketController {
  constructor(server) {
    this.webSocketServer = new WebSocketServer({ server });
    this.chatsUsers = this.#getChatsUsers();
  }

  async #getChatsUsers() {
    let chatsUsers = [];
    try {
      const conn = await getSyncDBConn();
      const [chatsData, fields] = await conn.execute(getAllChatsDataRequest());
      for (let i = 0; i < chatsData.length; i++) {
        const arrUsersId = chatsData[i].usersId.split(",");
        chatsUsers.push({
          id: chatsData[i].id,
          usersId: arrUsersId,
        });
      }
    } catch (e) {
      console.log(e);
    }

    return chatsUsers;
  }

  async #getChatById(chatId) {
    let chatData = {};
    try {
      const conn = await getSyncDBConn();
      const [chatsData, fields] = await conn.execute(
        getChatDataByIdRequest(chatId)
      );
      chatData = chatsData[0];
    } catch (e) {
      console.log(e);
    }
    return chatData;
  }

  async #addMessageToChatData(message, chatData) {
    const result = {
      isSuccess: false,
      newMessageData: {},
    };

    const newMessagesData = changeMessageData(chatData.chatHistory, message);
    const newMessagesDataArr = JSON.parse(newMessagesData);
    result.newMessageData = newMessagesDataArr[newMessagesDataArr.length - 1];
    try {
      const conn = await getSyncDBConn();
      await conn.execute(updateMessageData(newMessagesData, message.chatId));
      result.isSuccess = true;
    } catch (e) {
      console.log(e);
    }
    return result;
  }

  #getObjParamsReq = (url) => {
    let result = {};
    let arrParams = [];
    if (isString(url)) {
      const clearedURL = url.replace("?", "").replace("/", "");
      arrParams = clearedURL.split("&");
    }
    for (let i = 0; i < arrParams.length; i++) {
      const arrParam = arrParams[i].split("=");
      if (arrParam.length === 2) {
        const paramKey = arrParam[0];
        const paramValue = arrParam[1];
        result[paramKey] = paramValue;
      }
    }
    return result;
  };

  #sendChatMessage(messageObj, usersId) {
    this.webSocketServer.clients.forEach((client) => {
      const isIncludeUser = usersId?.findIndex((el) => el === client.userId);
      if (isIncludeUser !== -1) client.send(JSON.stringify(messageObj));
    });
  }

  #addMessageEvent = async (msgData, client) => {
    const validMessageErr = validMessageChatReq(msgData);
    if (validMessageErr === null) {
      const chatData = await this.#getChatById(msgData.chatId);
      if (chatData) {
        const usersChat = chatData.usersId.split(",");
        const userIndex = usersChat.findIndex((el) => el === msgData.userId);
        if (userIndex !== -1) {
          const { isSuccess, newMessageData } =
            await this.#addMessageToChatData(msgData, chatData);
          console.log(msgData);
          const sendData = {
            type: wsReqTypes.NEW_CHAT_MESSAGE,
            payload: { ...newMessageData, chatId: msgData.chatId },
          };
          isSuccess && this.#sendChatMessage(sendData, usersChat);
        } else {
          const errMsg = JSON.stringify({
            type: wsReqTypes.ERR,
            payload: {
              code: 403,
              text: NOT_ALLOWED_CHAT,
            },
          });
          client.send(errMsg);
        }
      } else {
        const errMsg = JSON.stringify({
          type: wsReqTypes.ERR,
          payload: {
            code: 404,
            text: NOT_EXIST_CHAT,
          },
        });
        client.send(errMsg);
      }
    }
  };

  #dispatchEvent = (message, ws) => {
    const json = JSON.parse(message);
    const payload = json.payload;
    switch (json.type) {
      case wsReqTypes.ADD_CHAT_MESSAGE:
        const msgData = { ...payload, userId: ws.userId };
        this.#addMessageEvent(msgData, ws);
        break;
      default:
        ws.send(new Error("Wrong query").message);
    }
  };

  startWebSocketConnection = () => {
    this.webSocketServer.on("connection", (ws, req) => {
      const paramsObj = this.#getObjParamsReq(req.url);
      if (paramsObj.userId) {
        ws.userId = paramsObj.userId;
        ws.on("message", (m) => this.#dispatchEvent(m, ws));
        ws.on("error", (e) => ws.send(e));
      } else {
        ws.send(new Error("Param `id` is not detected").message);
        ws.close();
      }
    });
  };
}

export default WebSocketController;
