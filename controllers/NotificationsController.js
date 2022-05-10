import { EMPTY_USER_ID } from "../constans/types/exceptions.js";
import { getSyncDBConn } from "../common/sqlConnection.js";
import {
  getUserNotificationsDataById,
  getFriendNotificationById,
} from "../dbCreateRequests/NotificationsRequest.js";
import { getUserDataById } from "../dbCreateRequests/UserInfoRequests.js";

class NotificationsController {
  async #getUserNotificationDataByUserId(userId) {
    let conn = null;
    let result = {};
    try {
      conn = await getSyncDBConn();
      const [[userData]] = await conn.execute(getUserDataById(userId));
      const notificationsDataId = userData.notificationsDataId;

      const [[userNotificationsData]] = await conn.execute(
        getUserNotificationsDataById(notificationsDataId)
      );
      result = userNotificationsData;
    } catch (e) {
      console.log(e);
    }

    conn && conn.close();
    return result;
  }

  async #getFriendsNotificationDataListByIds(idList) {
    let result = [];
    let conn = null;

    try {
      conn = await getSyncDBConn();
      for (let id of idList) {
        const [[notificationData]] = await conn.execute(
          getFriendNotificationById(id)
        );
        result.push(notificationData);
      }
    } catch (e) {
      console.log(e);
    }
    conn && conn.close();

    return result;
  }

  async getAllNotificationsReq(req, res) {
    let conn = null;
    try {
      const { userId } = req.body;
      let result = [];
      if (!userId) {
        res.status(400).json({ message: EMPTY_USER_ID });
      } else {
        conn = await getSyncDBConn();
        const userNotificationsData =
          await this.#getUserNotificationDataByUserId(userId);
        const newFriendsStr = userNotificationsData?.newFriendsList;
        const newFriendsList = newFriendsStr?.split(",") || [];
        const newFriendNotifData =
          await this.#getFriendsNotificationDataListByIds(newFriendsList);

        res.send({ data: newFriendNotifData });
      }
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: e });
    }

    conn && conn.close();
  }
}

export default NotificationsController;
