import { NOT_FOUND_ID_EXCEPTION } from "../constans/types/exceptions.js";
import { getDBConn } from "../common/sqlConnection.js";
import { readUserDataRequest } from "../dbCreateRequests/UserInfoRequests.js";

class UserInfoController {
  async create(req, res) {
    const pool = getDBConn();
    const { id, login, email } = req.body; //unique value`s
    const { firstName, secondName, lastName } = req.body; //name
    const { registrationDate, birthdate } = req.body; // dates
    const { password, birthPlace } = req.body; //other
    console.log(login);
    pool.getConnection((err, conn) => {
      if (err) {
        res.send("Error occured");
      } else {
        pool.query(readUserDataRequest(), (reqError, records, fields) => {
          console.log("DB is working succesfull");
          res.send(records);
        });
      }
    });
    // try {
    //   const { login, email } = res.body; //unique value`s
    //   const { firstName, secondName, lastName } = res.body; //name
    //   const { registrationDate, birthdate } = res.body; // dates
    //   const { password, birthPlace } = res.body; //other
    //   res.send({a: id});
    // } catch (e) {
    //   res.status(500).json(e);
    // }
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
