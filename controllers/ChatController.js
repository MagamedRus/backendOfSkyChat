import { validNewChatReq } from "../common/reqValidations/chatValidations.js";
import { getDateInMilliseconds } from "../common/date.js";
import {
  createNewChatRequest,
  getAllChatsDataRequest,
} from "../dbCreateRequests/ChatRequests.js";
import { getDBConn } from "../common/sqlConnection.js";
import { EMPTY_USER_IDS } from "../constans/types/exceptions.js";
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
                  console.log(reqError);
                  res.json(records);
                }
              }
            );
          }
        });
      }
    } catch (e) {
      console.log(e);
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
      const { login } = req.body;
      if (!login) {
        res.status(400).json({ message: NOT_FOUND_LOGIN_EXCEPTION });
      } else {
        const pool = getDBConn();
        pool.getConnection((err, conn) => {
          if (err) {
            res.status(501).json(err);
          } else {
            pool.query(
              getAllChatsDataRequest(),
              (reqError, records, fields) => {
                if (reqError != null) {
                  res.status(501).json(reqError);
                } else {
                  console.log(reqError);
                  res.send(records);
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
}

export default ChatController;
