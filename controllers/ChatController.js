import {
  validNewChatReq,
  isIncludeUser,
} from "../common/reqValidations/chatValidations.js";
import { getDateInMilliseconds } from "../common/date.js";
import {
  createNewChatRequest,
  getAllChatsDataRequest,
  getChatDataById,
} from "../dbCreateRequests/ChatRequests.js";
import { getDBConn } from "../common/sqlConnection.js";
import {
  EMPTY_USER_IDS,
  EMPTY_CHAT_ID,
  EMPTY_USER_ID,
  NOT_EXIST_CHAT,
} from "../constans/types/exceptions.js";
import { getOnlyUserHeadersChats } from "../common/filters.js";

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
            });
          }
        });
      }
    } catch (e) {
      res.status(500).json(e);
    }
  }

  async getChatData(req, res) {
    try {
      const { userId, chatId } = req.body;
      if (!userId) {
        res.status(400).json({ message: EMPTY_USER_ID });
      } else if (!chatId) {
        res.status(400).json({ message: EMPTY_CHAT_ID });
      } else {
        const pool = getDBConn();
        pool.getConnection((err, conn) => {
          if (err) {
            res.status(501).json(err);
          } else {
            pool.query(getChatDataById(chatId), (reqError, records, fields) => {
              if (reqError != null) {
                res.status(501).json(reqError);
              } else if (!records[0] || !isIncludeUser(records[0], userId)) {
                res.status(404).json({ message: NOT_EXIST_CHAT });
              } else {
                res.json(records[0]);
              }
            });
          }
        });
      }
    } catch (e) {
      res.status(500).json(e);
    }
  }
}

export default ChatController;
