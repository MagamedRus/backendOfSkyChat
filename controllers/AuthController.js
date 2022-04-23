import {
  NOT_FOUND_FIRST_PARAM_EXCEPTION,
  NOT_FOUND_PASSWORD_EXCEPTION,
} from "../constans/types/exceptions.js";
import { getDBConn } from "../common/sqlConnection.js";
import {
  getUserByEmailRequest,
  getUserByLoginRequest,
} from "../dbCreateRequests/UserInfoRequests.js";
import bcrypt from "bcryptjs";
import { getSyncDBConn } from "../common/sqlConnection.js";
import { getAllChatsDataRequest } from "../dbCreateRequests/ChatRequests.js";

class AuthController {
  async #getAdminChatId(userId) {
    let adminChatId = -1;
    const strUserId = String(userId);
    try {
      const conn = await getSyncDBConn();
      const [chatsData, fields] = await conn.execute(getAllChatsDataRequest());
      conn.close() 
      if (Array.isArray(chatsData)) {
        const onlyAdminChats = chatsData.filter((el) => el.isAdminChat);
        const userAdminChat = onlyAdminChats.filter((el) => {
          const usersId = el.usersId.split(",");
          const userIdIndex = usersId.findIndex((el) => el === strUserId);
          return userIdIndex !== -1;
        });
        if (userAdminChat[0]) adminChatId = userAdminChat[0].id;
      }
    } catch (e) {
      console.log(e);
    }

    return adminChatId;
  }

  async authUser(req, res) {
    try {
      const { email, login, password } = req.body;
      if (!email && !login) {
        res.status(400).json({ message: NOT_FOUND_FIRST_PARAM_EXCEPTION });
      } else if (!password) {
        res.status(400).json({ message: NOT_FOUND_PASSWORD_EXCEPTION });
      } else {
        const pool = getDBConn();
        const getReqFnc = email ? getUserByEmailRequest : getUserByLoginRequest;
        const getReqParam = email || login;
        pool.getConnection((err, conn) => {
          if (err) {
            res.status(501).json(err);
          } else {
            pool.query(getReqFnc(getReqParam), async (reqError, records) => {
              const userData = records[0];
              const sendData = {
                notExistUser: false,
                goodAuth: true,
                userData: {},
                adminChatId: -1,
              };

              if (reqError != null) {
                res.status(501).json(reqError);
              } else if (userData) {
                const userSendData = {};
                const isValidPassword = bcrypt.compareSync(
                  password,
                  userData.password
                );
                if (isValidPassword) {
                  const adminChatId = await this.#getAdminChatId(userData.id);
                  userSendData.id = userData.id;
                  userSendData.firstName = userData.firstName;
                  userSendData.secondName = userData.secondName;
                  userSendData.lastName = userData.lastName;
                  userSendData.birthday = userData.birthday;
                  userSendData.login = userData.login;
                  userSendData.email = userData.email;
                  sendData.userData = userSendData;
                  sendData.adminChatId = adminChatId;
                  res.json(sendData);
                } else {
                  sendData.goodAuth = false;
                  res.json(sendData);
                }
              } else {
                sendData.notExistUser = true;
                sendData.goodAuth = false;
                res.json(sendData);
              }
              pool.end()
            });
          }
        });
      }
    } catch (e) {
      res.status(500).json(e);
    }
  }
}

export default AuthController;
