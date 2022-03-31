import { NOT_FOUND_ID_EXCEPTION } from "../constans/types/exceptions.js";
import { getDBConn } from "../common/sqlConnection.js";
import { createUserDataRequest } from "../dbCreateRequests/UserInfoRequests.js";
import { validUserInfoPostReq } from "../common/reqValidations/userInfoValidations.js";

class UserInfoController {
  async create(req, res) {
    const data = req.body;
    try {
      const validErrorUserInfoRe = validUserInfoPostReq(data);
      if (validErrorUserInfoRe == null) {
        const pool = getDBConn();
        pool.getConnection((err, conn) => {
          if (err) {
            res.status(501).json(err);
          }
          pool.query(
            createUserDataRequest(data),
            (reqError, records, fields) => {
              console.log(reqError);
              if (reqError != null) {
                res.status(501).json(reqError);
              }
              res.send(records);
            }
          );
        });
      } else {
        res.status(400).json({ message: validErrorUserInfoRe });
      }
    } catch (e) {
      res.status(500).json(e);
    }
  }

  async getAll(req, res) {}

  async getById(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ message: NOT_FOUND_ID_EXCEPTION });
      }
      // return res.json();
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
