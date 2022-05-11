import {
  validNewChatReq,
  isIncludeUser,
} from "../common/reqValidations/chatValidations.js";
import { getDateInMilliseconds } from "../common/date.js";
import {
  createNewChatRequest,
  getAllChatsDataRequest,
  getChatDataByIdRequest,
} from "../dbCreateRequests/ChatRequests.js";
import { getDBConn, getSyncDBConn } from "../common/sqlConnection.js";
import {
  EMPTY_USER_IDS,
  EMPTY_CHAT_ID,
  EMPTY_USER_ID,
  NOT_EXIST_CHAT,
} from "../constans/types/exceptions.js";
import { getOnlyUserHeadersChats, getGeneralItems } from "../common/filters.js";
import {
  getUserDataById,
  setUserDataChatsArrByIdReq,
} from "../dbCreateRequests/UserInfoRequests.js";
import { NULL } from "../constans/db/dbRequestElements.js";

class ChatController {
  async newChat(req, res) {
    try {
      const validReqBody = validNewChatReq(req.body);
      if (validReqBody !== null) {
        res.status(400).json({ message: validReqBody });
      } else {
        const pool = getDBConn();
        const newChatData = {
          ...req.body,
          chatData: [],
          createDate: getDateInMilliseconds(),
          lastChangeDate: getDateInMilliseconds(),
        };
        pool.getConnection((err, conn) => {
          if (err) {
            res.status(501).json(err);
          } else {
            pool.query(
              createNewChatRequest(newChatData),
              (reqError, records, fields) => {
                if (reqError != null) {
                  res.status(501).json(reqError);
                } else {
                  res.json(records);
                }
                pool.end();
              }
            );
          }
        });
      }
    } catch (e) {
      res.status(500).json(e);
    }
  }

  async getChatHeadersData(req, res) {
    try {
      const { userId } = req.body;
      if (!userId) {
        res.status(400).json({ message: EMPTY_USER_IDS });
      } else {
        const pool = getDBConn();
        pool.getConnection((err, conn) => {
          if (err) {
            res.status(501).json(err);
          } else {
            pool.query(getAllChatsDataRequest(), (reqError, records) => {
              if (reqError != null) {
                res.status(501).json(reqError);
              } else {
                const sendData = getOnlyUserHeadersChats(records, userId);
                res.json(sendData);
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

  async #getChatUsersData(chatUsersId) {
    let usersData = [];
    const chatUsersIdArr = chatUsersId.split(",");
    try {
      const conn = await getSyncDBConn();
      const [allUsersData, fields] = await conn.execute(readUserDataRequest());
      conn.close();
      for (let i = 0; i < allUsersData.length; i++) {
        const userIndex = chatUsersIdArr.findIndex(
          (el) => el === allUsersData[i].id?.toString()
        );
        const isContain = userIndex !== -1;
        if (isContain) {
          usersData.push(allUsersData[i]);
        }
      }
    } catch (e) {
      console.log(e);
    }

    return usersData;
  }

  async getChatDataById(req, res) {
    try {
      const { userId, chatId } = req.body;
      if (!userId) {
        res.status(400).json({ message: EMPTY_USER_ID });
      } else if (!chatId) {
        res.status(400).json({ message: EMPTY_CHAT_ID });
      } else {
        const pool = getDBConn();
        pool.getConnection(async (err, conn) => {
          if (err) {
            res.status(501).json(err);
          } else {
            pool.query(
              getChatDataByIdRequest(chatId),
              async (reqError, records, fields) => {
                if (reqError != null) {
                  res.status(501).json(reqError);
                } else if (!records[0] || !isIncludeUser(records[0], userId)) {
                  res.status(404).json({ message: NOT_EXIST_CHAT });
                } else {
                  const chatData = { ...records[0], usersData: [] };
                  chatData.usersData = await this.#getChatUsersData(
                    records[0].usersId
                  );
                  res.json(chatData);
                }
                pool.end();
              }
            );
          }
        });
      }
    } catch (e) {
      res.status(500).json(e);
    }
  }

  async #getChatsDataByIds(chatIds) {
    let conn = null;
    let result = [];
    try {
      conn = await getSyncDBConn();
      for (let chatId of chatIds) {
        const [[chatData]] = await conn.execute(getChatDataByIdRequest(chatId));
        result.push(chatData);
      }
    } catch (e) {
      console.log(e);
    }

    conn && conn.close();
    return result;
  }

  async #addChatToUsersData(userIds, chatId) {
    let conn = null;

    try {
      conn = await getSyncDBConn();

      for (let userId of userIds) {
        const [[userData]] = await conn.execute(getUserDataById(userId));
        const userChatsDataArr = userData?.userChatsDataArr || "";
        const newChatIds = `${userChatsDataArr},${chatId}`;
        await conn.execute(setUserDataChatsArrByIdReq(userId, newChatIds));
      }
    } catch (e) {
      console.log(e);
    }
    conn && conn.close();
  }

  async #createPrivateChat(userId, friendId) {
    let conn = null;
    let chatId = -1;
    const newChatData = {
      title: "privateChat",
      usersId: `${friendId},${userId}`,
      adminsId: `${friendId},${userId}`,
      createDate: getDateInMilliseconds(),
      chatData: NULL,
      isGeneral: 0,
      lastChangeDate: getDateInMilliseconds(),
      isAdmin: 0,
    };

    try {
      conn = await getSyncDBConn();
      const [newChatCreateData] = await conn.execute(
        createNewChatRequest(newChatData)
      );
      chatId = newChatCreateData.insertId;
    } catch (e) {
      console.log(e);
    }
    conn && conn.close();
    return chatId;
  }

  async getPrivateChatId(req, res) {
    let conn = null;

    try {
      const { userId, friendId } = req.body;
      if (!friendId) {
      } else if (!userId) {
      } else {
        let chatId = -1;
        conn = await getSyncDBConn();
        const [[userData]] = await conn.execute(getUserDataById(userId));
        const [[friendData]] = await conn.execute(getUserDataById(friendId));
        const userChatsDataIds = userData?.userChatsDataArr?.split(",") || [];
        const friendChatsDataIds =
          friendData?.userChatsDataArr?.split(",") || [];
        const generalChatsId = getGeneralItems(
          userChatsDataIds,
          friendChatsDataIds
        );
        const chatsData = await this.#getChatsDataByIds(generalChatsId);
        const [privateChatData] = chatsData.filter((el) => el.isGeneral === 0);
        if (privateChatData) {
          chatId = privateChatData.id;
        } else {
          chatId = await this.#createPrivateChat(userId, friendId);
          const userIds = [userId, friendId];
          this.#addChatToUsersData(userIds, chatId);
        }
        res.send({ chatId });
      }
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: e });
    }
    conn && conn.close();
  }
}

export default ChatController;
