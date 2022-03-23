import express from "express";
import mongoose from "mongoose";
import { PORT, DB_URL } from "./constans/url.js";
import routerUserInfo from "./routes/UserInfo.js";
import { ROUTE_API } from "./constans/routes.js";

const app = express();

app.use(express.json());
app.use(ROUTE_API, routerUserInfo);

app.listen(PORT, () => {
  console.log("server is started");
});

async function startApp() {
  try {
    await mongoose.connect(DB_URL, { useNewUrlParser: true });
    app.listen(PORT, () => console.log("server is working on port", PORT));
  } catch (e) {
    console.log(e);
  }
}

startApp();
