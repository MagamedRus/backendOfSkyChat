import { getSyncDBConn } from "../common/sqlConnection.js";
import {
  readUserDataRequest,
  getUserDataById,
} from "../dbCreateRequests/UserInfoRequests.js";
import { getFilteredUsers } from "../common/filters.js";
import { EMPTY_USER_ID } from "../constans/types/exceptions.js";

class FriendsController {
  async getNewFriends(req, res) {
    let { userId, ...filterData } = req.body;

    try {
      !userId && res.status(400).json({ message: EMPTY_USER_ID });
      const conn = await getSyncDBConn();
      const [usersData, usersDataFields] = await conn.execute(
        readUserDataRequest()
      );
      const [userDataList, userDataFields] = await conn.execute(
        getUserDataById(userId)
      );
      conn.close();
      const userFriendsList = userDataList?.userFriendsDataArr?.split(",");
      filterData.friendIdList = userFriendsList;
      const filteredUsers = getFilteredUsers(usersData, filterData);
      res.json(filteredUsers);
      // res.json(userFriendsList);
    } catch (e) {
      console.log(e);
      res.status(500).json(e);
    }
  }
}

export default FriendsController;
