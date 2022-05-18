import { Router } from "express";
import {
  ROUTE_CHAT_NEW,
  ROUTE_CHAT_HEADERS,
  ROUTE_CHAT_DATA,
  ROUTE_PRIVATE_CHAT_ID,
  ROUTE_CHAT_UPDATE
} from "../constans/routes.js";
import ChatController from "../controllers/ChatController.js";

const routerChat = new Router();
const chatController = new ChatController();

routerChat.post(ROUTE_CHAT_NEW, (req, res) => chatController.newChat(req, res));
routerChat.post(ROUTE_CHAT_HEADERS, (req, res) =>
  chatController.getChatHeadersData(req, res)
);
routerChat.post(ROUTE_CHAT_DATA, (req, res) =>
  chatController.getChatDataById(req, res)
);
routerChat.post(ROUTE_CHAT_UPDATE, (req, res) =>
  chatController.updateChatImg(req, res)
);
routerChat.post(ROUTE_PRIVATE_CHAT_ID, (req, res) =>
  chatController.getPrivateChatId(req, res)
);
export default routerChat;
