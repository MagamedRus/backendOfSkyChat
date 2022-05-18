import express from "express";
import { PORT } from "./constans/config.js";
import routerUserInfo from "./routes/UserInfo.js";
import routerCheckData from "./routes/CheckData.js";
import routerAuth from "./routes/Auth.js";
import routerChat from "./routes/Chats.js";
import routerFriends from "./routes/Friends.js";
import routerNotifications from "./routes/Notifications.js";
import { ROUTE_API } from "./constans/routes.js";
import cors from "cors";
import morgan from "morgan";
import http from "http";
import WebSocketController from "./controllers/websocketController.js";
import routerFiles from "./routes/Files.js";

// express config
const app = express();
const _cors = cors({
  origin: "*",
});
app.use(express.json());
app.use(morgan("dev"));
app.use(_cors);
app.use(morgan("dev"));
app.use(ROUTE_API, routerUserInfo);
app.use(ROUTE_API, routerCheckData);
app.use(ROUTE_API, routerAuth);
app.use(ROUTE_API, routerChat);
app.use(ROUTE_API, routerFriends);
app.use(ROUTE_API, routerNotifications);
app.use(ROUTE_API, routerFiles)

const server = http.createServer(app);

async function startApp() {
  try {
    const webSocketController = new WebSocketController(server);
    webSocketController.startWebSocketConnection();
    server.listen(PORT, () => console.log("server is working on port", PORT));
  } catch (e) {
    console.log(e);
  }
}

startApp();
