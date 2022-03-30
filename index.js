import express from "express";
import { PORT } from "./constans/config.js";
import routerUserInfo from "./routes/UserInfo.js";
import { ROUTE_API } from "./constans/routes.js";

// express config
const app = express();
app.use(express.json());
app.use(ROUTE_API, routerUserInfo);


async function startApp() {
  try {
    app.listen(PORT, () => console.log("server is working on port", PORT));
  } catch (e) {
    console.log(e);
  }
}

startApp();
