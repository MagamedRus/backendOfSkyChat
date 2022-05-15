import { getSyncDBConn } from "../common/sqlConnection.js";
import {
  readUserDataRequest,
  getUserDataById,
  setUserFriendIdsDataById,
  getUserByIdRequest,
} from "../dbCreateRequests/UserInfoRequests.js";
import {
  createFriendReq,
  getFriendsDataByIdReq,
  setAcceptFriendByIdReq,
  deleteFriendByIdReq,
} from "../dbCreateRequests/FriendRequests.js";
import {
  createNewFriendNotifactionsReq,
  setUserNotificationFriendList,
  getUserNotificationsDataById,
  getFriendNotificationById,
  deleteFriendNotificationById,
} from "../dbCreateRequests/NotificationsRequest.js";
import { getFilteredUsers, getSaveDataUser } from "../common/filters.js";
import {
  EMPTY_USER_ID,
  EMPTY_FRIEND_ID,
  NOTIFICATION_ID_NOT_EXIST,
} from "../constans/types/exceptions.js";

class FriendsController {
  async getNewFriends(req, res) {
    try {
      let { userId, ...filterData } = req.body;
      if (userId) {
        const conn = await getSyncDBConn();
        const [usersData] = await conn.execute(readUserDataRequest());
        conn.close();
        const friendsData = await this.#getUserFriendsData(userId);
        filterData.friendsData = friendsData;
        filterData.selfId = userId;
        const filteredUsers = getFilteredUsers(usersData, filterData);
        res.json(filteredUsers);
      } else res.status(400).json({ message: EMPTY_USER_ID });
    } catch (e) {
      console.log(e);
      res.status(500).json(e);
    }
  }

  async sendInvite(req, res) {
    const { userId, friendId } = req.body;
    try {
      const conn = await getSyncDBConn();
      if (!userId) {
        res.status(400).json({ message: EMPTY_USER_ID });
      } else if (!friendId) {
        res.status(400).json({ message: EMPTY_FRIEND_ID });
      } else {
        const [newFriendRowData] = await conn.execute(
          createFriendReq(friendId)
        );
        const [newNotificationRowData] = await conn.execute(
          createNewFriendNotifactionsReq(friendId, userId)
        );
        conn.close();
        const friendDataId = newFriendRowData.insertId;
        const notificationDataId = newNotificationRowData.insertId;

        this.#addFriendNotificationIdData(friendId, notificationDataId);
        this.#addUserFriendIdData(userId, friendDataId);

        res.json({ message: "it's okay" });
      }
    } catch (e) {
      console.log(e);
      res.status(500).json(e);
    }
  }

  async acceptFriend(req, res) {
    let conn = null;
    try {
      const { notificationId, isAccept } = req.body;
      conn = await getSyncDBConn();

      if (!notificationId) {
        res.status(400).json({ message: NOTIFICATION_ID_NOT_EXIST });
      }
      const [[friendsNotificationData]] = await conn.execute(
        getFriendNotificationById(notificationId)
      );
      const { userId, friendId } = friendsNotificationData;
      this.#deleteFriendNotificationIdData(userId, notificationId);
      conn.execute(deleteFriendNotificationById(notificationId));

      if (isAccept) {
        this.#setUserFriendAccept(userId, friendId, true);
        const [userFriendData] = await conn.execute(
          createFriendReq(friendId, true)
        );
        const selfFriendId = userFriendData.insertId;
        this.#addUserFriendIdData(userId, selfFriendId);
      } else {
        const deletedId = await this.#deleteUserFriend(userId, friendId);
        this.#deleteUserFriendIdData(friendId, deletedId);
      }

      res.json({ message: "it's okay" });
    } catch (e) {
      console.log("acceptFriend", e);
      res.status(500).json({ e });
    }
    conn && conn.close();
  }

  async getFriendsData(req, res) {
    try {
      const { userId } = req.body;
      if (!userId) {
        res.status(400).json({ message: EMPTY_USER_ID });
      } else {
        const friendsData = await this.#getUserFriendsData(userId);
        const friendsIds = friendsData.map((el) =>
          el.isAccept ? el.friendId : -1
        );
        const result = await this.#getUserFriendsSelfDataByIds(friendsIds);
        res.json({ data: result });
      }
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: e });
    }
  }

  async #getUserFriendsSelfDataByIds(friendIds) {
    let result = [];
    let conn = null;

    try {
      conn = await getSyncDBConn();

      for (let id of friendIds) {
        if (id !== -1) {
          const [[friendFullData]] = await conn.execute(getUserByIdRequest(id));
          const friendData = getSaveDataUser(friendFullData);
          result.push(friendData);
        }
      }
    } catch (e) {
      console.log(e);
    }

    conn && conn.close();
    return result;
  }

  async #getUserFriendsData(userId) {
    let result = [];
    let conn = null;
    try {
      conn = await getSyncDBConn();
      const [userData] = await conn.execute(getUserDataById(userId));
      const userFriendsDataIds =
        userData[0]?.userFriendsDataArr?.split(",") || [];
      for (let i of userFriendsDataIds) {
        const [friendData] = await conn.execute(getFriendsDataByIdReq(i));
        result.push(friendData[0]);
      }
    } catch (e) {
      console.log(e);
    }
    conn && conn.close();
    return result;
  }

  async #addFriendNotificationIdData(userId, notificationDataId) {
    try {
      const conn = await getSyncDBConn();
      const [userData] = await conn.execute(getUserDataById(userId));
      const userNotificationsId = userData[0]?.notificationsDataId;
      const [userNotificationsData] = await conn.execute(
        getUserNotificationsDataById(userNotificationsId)
      );
      const notificationsFriends = userNotificationsData[0]?.newFriendsList;
      const typeNotificationsFriends = typeof notificationsFriends;
      switch (typeNotificationsFriends) {
        case "string":
          const newNotificationsFriends = `${notificationsFriends},${notificationDataId}`;
          await conn.execute(
            setUserNotificationFriendList(
              userNotificationsId,
              newNotificationsFriends
            )
          );
          break;
        default:
          await conn.execute(
            setUserNotificationFriendList(
              userNotificationsId,
              notificationDataId
            )
          );
          break;
      }
      conn.close();
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  async #deleteFriendNotificationIdData(userId, notificationDataId) {
    let conn = null;
    try {
      conn = await getSyncDBConn();
      const [userData] = await conn.execute(getUserDataById(userId));
      const userNotificationsId = userData[0]?.notificationsDataId;
      const [userNotificationsData] = await conn.execute(
        getUserNotificationsDataById(userNotificationsId)
      );
      let notificationsFriends = userNotificationsData[0]?.newFriendsList;

      if (typeof notificationsFriends === "string") {
        notificationsFriends = notificationsFriends?.replace(
          `,${notificationDataId}`,
          ""
        );
        notificationsFriends = notificationsFriends?.replace(
          notificationDataId,
          ""
        );
        await conn.execute(
          setUserNotificationFriendList(
            userNotificationsId,
            notificationsFriends
          )
        );
      }
    } catch (e) {
      console.log(e);
    }

    conn && conn.close();
  }

  async #addUserFriendIdData(userId, userFriendDataId) {
    try {
      const conn = await getSyncDBConn();
      const [userData] = await conn.execute(getUserDataById(userId));
      const userFriendsData = userData[0]?.userFriendsDataArr;
      const typeUserFriendsData = typeof userFriendsData;

      switch (typeUserFriendsData) {
        case "string":
          const newFriendsList = `${userFriendsData},${userFriendDataId}`;
          await conn.execute(setUserFriendIdsDataById(userId, newFriendsList));
          break;
        default:
          await conn.execute(
            setUserFriendIdsDataById(userId, userFriendDataId)
          );
          break;
      }
      conn.close();
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  async #deleteUserFriendIdData(userId, userFriendDataId) {
    let conn = null;
    try {
      conn = await getSyncDBConn();
      const [userData] = await conn.execute(getUserDataById(userId));
      let userFriendsData = userData[0]?.userFriendsDataArr;
      if (typeof userFriendsData === "string") {
        userFriendsData = userFriendsData?.replace(`,${userFriendDataId}`, "");
        userFriendsData = userFriendsData?.replace(userFriendDataId, "");
        await conn.execute(setUserFriendIdsDataById(userId, userFriendsData));
      }
    } catch (e) {
      console.log(e);
    }

    conn && conn.close();
  }

  async #deleteUserFriend(userId, friendId) {
    let conn = null;
    let deletedId = -1;
    try {
      conn = await getSyncDBConn();
      const friendsData = await this.#getUserFriendsData(friendId);
      for (let friendData of friendsData) {
        if (friendData.friendId === userId) {
          const [reqResData] = await conn.execute(
            deleteFriendByIdReq(friendData.id)
          );
          deletedId = friendData.id;
        }
      }
    } catch (e) {
      console.log("acceptFriend", e);
    }
    conn && conn.close();
    return deletedId;
  }

  async #setUserFriendAccept(userId, friendId, isAccept) {
    let conn = null;
    try {
      conn = await getSyncDBConn();

      const friendsData = await this.#getUserFriendsData(friendId);
      for (let friendData of friendsData) {
        if (friendData.friendId === userId) {
          await conn.execute(setAcceptFriendByIdReq(friendData.id, isAccept));
        }
      }
    } catch (e) {
      console.log("acceptFriend", e);
    }
    conn && conn.close();
  }
}

export default FriendsController;
