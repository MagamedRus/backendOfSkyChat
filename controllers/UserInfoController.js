import UserInfo from "../schemes/UserInfo.js";
import { NOT_FOUND_ID_EXCEPTION } from "../constans/exceptions.js";

class UserInfoController {
  async create(req, res) {
    try {
      const { name, secondName, birthday, gender, dateReg, password, picture } =
        req.body;
      const userInfo = await UserInfo.create({
        name,
        secondName,
        birthday,
        gender,
        dateReg,
        password,
        picture,
      });
      res.json(userInfo);
    } catch (e) {
      res.status(500).json(e);
    }
  }

  async getAll(req, res) {
    const UserInfos = await UserInfo.find(); // We can provide some arguments here
    return res.json(UserInfos);
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ message: NOT_FOUND_ID_EXCEPTION });
      }
      const userInfo = await UserInfo.findById(id);
      return res.json(userInfo);
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
      const userInfo = await UserInfo.findByIdAndUpdate(post._id, newUserInfo, {
        new: true,
      });
      return res.json(userInfo);
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
      const userInfo = await UserInfo.findByIdAndDelete(id);
      return res.json(userInfo);
    } catch (e) {
      res.status(500).json(e);
    }
  }
}

export default UserInfoController;
