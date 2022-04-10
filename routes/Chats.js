import { Router } from "express";
import {
  ROUTE_CHAT_NEW,
  ROUTE_CHAT_HEADERS,
  ROUTE_CHAT_DATA,
} from "../constans/routes.js";
import ChatController from "../controllers/ChatController.js";

const routerChat = new Router();
const chatController = new ChatController();

routerChat.post(ROUTE_CHAT_NEW, (req, res) => chatController.newChat(req, res));
routerChat.post(ROUTE_CHAT_HEADERS, (req, res) =>
  chatController.getChatHeadersData(req, res)
);
routerChat.post(ROUTE_CHAT_DATA, (req, res) =>
  chatController.getChatData(req, res)
);
routerChat.post("/message/new", (req, res) =>
  chatController.updateMessageData(req, res)
);

export default routerChat;
