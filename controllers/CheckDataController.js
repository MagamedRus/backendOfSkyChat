import {
  NOT_FOUND_EMAIL_EXCEPTION,
  NOT_FOUND_LOGIN_EXCEPTION,
} from "../constans/types/exceptions.js";
import { getDBConn } from "../common/sqlConnection.js";
import {
  getUserByEmailRequest,
  getUserByLoginRequest,
} from "../dbCreateRequests/UserInfoRequests.js";

class CheckDataController {
  async checkUserByEmail(req, res) {
    try {
      const { email } = req.body;
      if (!email) {
        res.status(400).json({ message: NOT_FOUND_EMAIL_EXCEPTION });
      } else {
        const pool = getDBConn();
        pool.getConnection((err, conn) => {
          if (err) {
            res.status(501).json(err);
          } else {
            pool.query(
              getUserByEmailRequest(email),
              (reqError, records, fields) => {
                if (reqError != null) {
                  res.status(501).json(reqError);
                } else if (records[0]) {
                  res.json({ isExist: true });
                } else {
                  res.json({ isExist: false });
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

  async checkUserByLogin(req, res) {
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
            pool.query(getUserByLoginRequest(login), (reqError, records) => {
              if (reqError != null) {
                res.status(501).json(reqError);
              } else if (records[0]) {
                res.json({ isExist: true });
              } else {
                res.json({ isExist: false });
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

export default CheckDataController;
