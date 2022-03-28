import express from "express";
import mysql from "mysql";
import { PORT, MYSQL_CONFIG } from "./constans/config.js";
import routerUserInfo from "./routes/UserInfo.js";
import { ROUTE_API } from "./constans/routes.js";
import { createUserDataRequest } from "./dbCreateRequests/UserInfoRequests.js";

// express config
const app = express();
app.use(express.json());
app.use(ROUTE_API, routerUserInfo);

// mysql config
const conn = mysql.createConnection(MYSQL_CONFIG);

const connectToSql = () => {
  try {
    conn.connect((err) => {
      if (err) {
        console.log(err);
        return err;
      } else {
        console.log("Database is connected");
      }
    });
  } catch (e) {
    console.log(e);
  }
  return true;
};


async function startApp() {
  try {
    connectToSql();
    app.listen(PORT, () => console.log("server is working on port", PORT));
    console.log(
      createUserDataRequest({
        id: 1,
        login: "asd",
        email: "asd",
        firstName: "firstName",
        secondName: "secondName",
        lastName: "lastName",
        registrationDate: "registration",
        birthPlace: "place",
        birthdate: "asd",
      })
    );
  } catch (e) {
    console.log(e);
  }
}

startApp();
