import express from "express";
import { PORT } from "./constans/config.js";
import routerUserInfo from "./routes/UserInfo.js";
import routerCheckData from "./routes/CheckData.js";
import routerAuth from "./routes/Auth.js";
import { ROUTE_API } from "./constans/routes.js";
import cors from "cors";
import morgan from "morgan";
import http from "http";

// express config
const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(
  cors({
    origin: "*",
  })
);
app.use(morgan("dev"));
app.use(ROUTE_API, routerUserInfo);
app.use(ROUTE_API, routerCheckData);
app.use(ROUTE_API, routerAuth);

const server = http.createServer(app);
// const webSocketServer = new WebSocket.Server({ server });

async function startApp() {
  try {
    app.listen(PORT, () => console.log("server is working on port", PORT));
  } catch (e) {
    console.log(e);
  }
}

startApp();
