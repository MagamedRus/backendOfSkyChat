import {
  validNewChatReq,
  isIncludeUser,
} from "../common/reqValidations/chatValidations.js";
import { getDateInMilliseconds } from "../common/date.js";
import {
  createNewChatRequest,
  getChatDataByIdRequest,
} from "../dbCreateRequests/ChatRequests.js";
import { getDBConn, getSyncDBConn } from "../common/sqlConnection.js";
import {
  EMPTY_USER_IDS,
  EMPTY_CHAT_ID,
  EMPTY_USER_ID,
  NOT_EXIST_CHAT,
  EMPTY_FRIEND_ID,
} from "../constans/types/exceptions.js";
import {
  getOnlyUserHeadersChats,
  getGeneralItems,
  getSaveDataUser,
} from "../common/filters.js";
import {
  getUserDataById,
  setUserDataChatsArrByIdReq,
  getUserByIdRequest,
} from "../dbCreateRequests/UserInfoRequests.js";
import { createImage } from "../dbCreateRequests/FileRequests.js";
import { NULL } from "../constans/db/dbRequestElements.js";

class ChatController {
  async newChat(req, res) {
    try {
      const validReqBody = validNewChatReq(req.body);
      if (validReqBody !== null) {
        res.status(400).json({ message: validReqBody });
      } else {
        const pool = getDBConn();
        const { imgData } = req.body;
        const imageId = imgData ? await this.#createImage(imgData) : NULL;
        const newChatData = {
          ...req.body,
          chatData: [],
          imageId: imageId,
          isAdmin: false,
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
      console.log(e)
      res.status(500).json(e);
    }
  }

  async getChatHeadersData(req, res) {
    let conn = null;
    try {
      const { userId } = req.body;
      if (!userId) {
        res.status(400).json({ message: EMPTY_USER_IDS });
      } else {
        conn = await getSyncDBConn();
        const [[userData]] = await conn.execute(getUserDataById(userId));
        const chatIds = userData?.userChatsDataArr.split(",") || [];
        const chatsData = await this.#getChatsDataByIds(chatIds);
        const sendData = getOnlyUserHeadersChats(chatsData);
        res.json(sendData);
      }
    } catch (e) {
      res.status(500).json(e);
    }

    conn && conn.close();
  }

  async #getChatUsersData(chatUsersId) {
    let usersData = [];
    let conn = null;
    const chatUsersIdArr = chatUsersId.split(",");
    try {
      conn = await getSyncDBConn();
      for (let userId of chatUsersIdArr) {
        const [[userData]] = await conn.execute(getUserByIdRequest(userId));
        const userSaveData = getSaveDataUser(userData);
        usersData.push(userSaveData);
      }
    } catch (e) {
      console.log(e);
    }

    conn && conn.close();
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
      chatData: "",
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
        res.status(400).json({ message: EMPTY_FRIEND_ID });
      } else if (!userId) {
        res.status(400).json({ message: EMPTY_USER_ID });
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

  async #createImage(imgData) {
    const { image, smallImage } = imgData;
    let imageId = -1;
    let conn = null;
    try {
      conn = await getSyncDBConn();
      let [insertData] = await conn.execute(createImage(image, smallImage));
      imageId = insertData?.insertId;
    } catch (e) {
      console.log(e);
    }

    conn && conn.close();
    return imageId;
  }
}

export default ChatController;
