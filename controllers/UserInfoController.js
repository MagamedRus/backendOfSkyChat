import {
  NOT_FOUND_ID_EXCEPTION,
  NOT_FOUND_EMAIL_EXCEPTION,
  EMPTY_USER_ID,
  USER_NOT_EXIST,
} from "../constans/types/exceptions.js";
import { getDBConn, getSyncDBConn } from "../common/sqlConnection.js";
import {
  createUserSelfDataRequest,
  createUserDataRequest,
  readUserDataRequest,
  getUserByIdRequest,
  getUserByEmailRequest,
} from "../dbCreateRequests/UserInfoRequests.js";
import { createNotificationsDataRequest } from "../dbCreateRequests/NotificationsRequest.js";
import { createTempDataRequest } from "../dbCreateRequests/TemporaryRequests.js";
import { validUserInfoPostReq } from "../common/reqValidations/userInfoValidations.js";
import bcrypt from "bcryptjs";
import { createNewChatRequest } from "../dbCreateRequests/ChatRequests.js";
import { getDateInMilliseconds } from "../common/date.js";
import { getSaveDataUser } from "../common/filters.js";

class UserInfoController {
  async #createAdminChat(userId) {
    let adminChatId = -1;
    try {
      const conn = await getSyncDBConn();
      const chatData = {
        title: "SkyChat",
        isGeneral: false,
        usersId: userId,
        chatData: "",
        createDate: getDateInMilliseconds(),
        lastChangeDate: getDateInMilliseconds(),
        isAdmin: true,
      };
      const [records, fields] = await conn.execute(
        createNewChatRequest(chatData)
      );
      conn.close();
      adminChatId = records.insertId;
    } catch (e) {
      console.log(e);
    }

    return adminChatId;
  }

  async #createTempDatas() {
    let userOtherDataId = -1;
    try {
      const conn = await getSyncDBConn();
      const [records, fields] = await conn.execute(createTempDataRequest());
      conn.close();
      userOtherDataId = records.insertId;
    } catch (e) {
      console.log(e);
    }
    return userOtherDataId;
  }

  async #createNotificationsData(userId) {
    let notificationsDataId = -1;
    try {
      const conn = await getSyncDBConn();
      const [records, fields] = await conn.execute(
        createNotificationsDataRequest(userId)
      );
      conn.close();
      notificationsDataId = records.insertId;
    } catch (e) {
      console.log(e);
    }
    return notificationsDataId;
  }

  async #createUserDatas(userId, tempDataId, notificationsDataId, adminChatId) {
    let isSuccess = false;
    try {
      const conn = await getSyncDBConn();
      const [records, fields] = await conn.execute(
        createUserDataRequest(
          userId,
          tempDataId,
          notificationsDataId,
          adminChatId
        )
      );
      conn.close();
      if (records.insertId) {
        isSuccess = true;
      }
    } catch (e) {
      console.log(e);
    }
    return isSuccess;
  }

  async create(req, res) {
    const data = req.body;
    try {
      const validErrorUserInfoReq = validUserInfoPostReq(data);
      if (validErrorUserInfoReq == null) {
        const pool = getDBConn();
        data.password = bcrypt.hashSync(data.password, 7);
        pool.getConnection((err, conn) => {
          if (err) {
            res.status(501).json(err);
          } else {
            pool.query(
              createUserSelfDataRequest(data),
              async (reqError, records, fields) => {
                if (reqError != null) {
                  res.status(501).json(reqError);
                } else {
                  const userId = records.insertId;
                  const adminChatId = await this.#createAdminChat(userId);
                  const userTempDataId = await this.#createTempDatas();
                  const notificationsDataId =
                    await this.#createNotificationsData(userId);
                  await this.#createUserDatas(
                    userId,
                    userTempDataId,
                    notificationsDataId,
                    adminChatId
                  );
                  res.json({ adminChatId, userId });
                }
                pool.end();
              }
            );
          }
        });
      } else {
        res.status(400).json({ message: validErrorUserInfoReq });
      }
    } catch (e) {
      res.status(500).json(e);
    }
  }

  async getAll(req, res) {
    const pool = getDBConn();
    pool.getConnection((err, conn) => {
      if (err) {
        res.status(501).json(err);
      } else {
        pool.query(readUserDataRequest(), (reqError, records, fields) => {
          if (reqError != null) {
            res.status(501).json(reqError);
          } else res.send(records);
        });
      }
      pool.end();
    });
  }

  async getById(req, res) {
    try {
      const { userId } = req.body;
      if (!userId) {
        res.status(400).json({ message: EMPTY_USER_ID });
      } else {
        const pool = getDBConn();
        pool.getConnection((err) => {
          if (err) {
            res.status(501).json(err);
          } else {
            pool.query(getUserByIdRequest(userId), (reqError, records) => {
              if (reqError != null) {
                res.status(501).json(reqError);
              } else {
                if (!records) {
                  res.status(400).json({ message: USER_NOT_EXIST });
                } else {
                  const userData = records[0];
                  const saveUserData = getSaveDataUser(userData);
                  res.json(saveUserData);
                }
              }

              pool.end();
            });
          }
        });
      }
    } catch (e) {
      res.status(500).json(e);
    }
  }
  async getByEmail(req, res) {
    try {
      const { email } = req.body;
      if (!email) {
        res.status(400).json({ message: NOT_FOUND_EMAIL_EXCEPTION });
      } else {
        const pool = getDBConn();
        pool.getConnection((err, conn) => {
          if (err) {
            res.status(501).json(err);
          }
          pool.query(
            getUserByEmailRequest(email),
            (reqError, records, fields) => {
              if (reqError != null) {
                res.status(501).json(reqError);
              }
              res.send(records[0]);
              pool.end();
            }
          );
        });
      }
    } catch (e) {
      res.status(500).json(e);
    }
  }

  async update(req, res) {
    try {
      const newUserInfo = req.body;
      // Todo: add more exceptions
      if (!newUserInfo._id) {
        res.status(400).json({ message: NOT_FOUND_ID_EXCEPTION });
      }
      // return res.json();
    } catch (e) {
      res.status(500).json(e);
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ message: NOT_FOUND_ID_EXCEPTION });
      }
      // return res.json(userInfo);
    } catch (e) {
      res.status(500).json(e);
    }
  }
}

export default UserInfoController;
