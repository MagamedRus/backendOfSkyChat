import {
  NOT_FOUND_EMAIL_EXCEPTION,
  NOT_FOUND_LOGIN_EXCEPTION,
  NOT_FOUND_PASSWORD_EXCEPTION,
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
                  res.send({ isExist: true });
                } else {
                  res.send({ isExist: false });
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
                res.send({ isExist: true });
              } else {
                res.send({ isExist: false });
              }
            });
          }
        });
      }
    } catch (e) {
      res.status(500).json(e);
    }
  }
  async authUser(req, res) {
    let result = {
      success: false,
      incorrectPassword: false,
      userIsNotExist: false,
    };
    try {
      const { login, password } = req.body;
      if (!login || !password) {
        !login && res.status(400).json({ message: NOT_FOUND_LOGIN_EXCEPTION });
        !password &&
          res.status(400).json({ message: NOT_FOUND_PASSWORD_EXCEPTION });
      } else {
        const pool = getDBConn();
        pool.getConnection((err, conn) => {
          if (err) {
            res.status(501).json(err);
          }
          pool.query(getUserByLoginRequest(login), (reqError, records) => {
            if (reqError != null) {
              res.status(501).json(reqError);
            }
            if (!records[0]) {
              result.userIsNotExist = true;
              res.send(result);
            }
            if (records[0].password === password) {
              result.success = true;
              res.send(result);
            } else {
              result.incorrectPassword = true;
              res.send(result);
            }
          });
        });
      }
    } catch (e) {
      res.status(500).json(e);
    }
  }
}

export default CheckDataController;
