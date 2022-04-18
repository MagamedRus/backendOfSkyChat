import { WebSocketServer } from "ws";
import { isString } from "../common/validations.js";

class WebSocketController {
  constructor(server) {
    this.webSocketServer = new WebSocketServer({ server });
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

  #dispatchEvent = (message, ws) => {
    const json = JSON.parse(message);
    switch (json.event) {
      case "chat-message":
        this.webSocketServer.clients.forEach((client) => {
          client.send(JSON.stringify(json));
        });
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
