import { WebSocketServer } from "ws";
import { isString } from "../common/validations.js";
import { getSyncDBConn } from "../common/sqlConnection.js";
import {
  getAllChatsDataRequest,
  getChatDataById,
  updateMessageData,
} from "../dbCreateRequests/ChatRequests.js";
import { changeMessageData } from "../common/chat.js";

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
      const [chatsData, fields] = await conn.execute(getChatDataById(chatId));
      chatData = chatsData[0];
    } catch (e) {
      console.log(e);
    }
    return chatData;
  }

  async #addMessageToChatData(message, chatData) {
    let isSuccess = false;
    const newMessageData = changeMessageData(chatData.messageHistory, message);
    try {
      const conn = await getSyncDBConn();
      await conn.execute(updateMessageData(newMessageData, message.chatId));
      isSuccess = true;
    } catch (e) {
      console.log(e);
    }
    return isSuccess;
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

  // this.webSocketServer.clients.forEach((client) => {
  //   client.send(JSON.stringify(json));
  // });

  #dispatchEvent = (message, ws) => {
    const json = JSON.parse(message);
    switch (json.event) {
      case "chat-message":
        console.log(message);
        break;
      default:
        ws.send(new Error("Wrong query").message);
    }
  };

  startWebSocketConnection = () => {
    this.webSocketServer.on("connection", (ws, req) => {
      const paramsObj = this.#getObjParamsReq(req.url);
      if (paramsObj.userId) {
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
