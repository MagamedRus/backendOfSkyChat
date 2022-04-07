import {
  NOT_FOUND_FIRST_PARAM_EXCEPTION,
  NOT_FOUND_PASSWORD_EXCEPTION,
} from "../constans/types/exceptions.js";
import { getDBConn } from "../common/sqlConnection.js";
import {
  getUserByEmailRequest,
  getUserByLoginRequest,
} from "../dbCreateRequests/UserInfoRequests.js";

class CheckDataController {
  async checkUser(req, res) {
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
            pool.query(getReqFnc(getReqParam), (reqError, records) => {
              const userData = records[0];
              if (reqError != null) {
                res.status(501).json(reqError);
              } else if (userData) {
                if (userData.password === password) {
                  res.json({ notExistUser: false, goodAuth: true });
                } else {
                  res.json({ notExistUser: false, goodAuth: false });
                }
              } else {
                res.json({ notExistUser: true, goodAuth: false });
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
