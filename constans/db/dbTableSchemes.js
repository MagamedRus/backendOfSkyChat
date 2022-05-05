export const userSelfDataTableScheme =
  "(`id`, `login`, `email`, `password`, `firstName`, `secondName`, `lastName`, `registrationDate`, `birthPlace`, `birthday`)";
export const chatTableScheme =
  "(`id`, `adminsId`, `title`, `usersId`, `chatHistory`, `createDate`, `isGeneral`, `lastChangeDate`, `isAdminChat`)";
export const tempDataTableScheme = "(`id`, `lastActiveTime`, `deviceToken`)";
export const userDataTableScheme =
  "(`id`, `selfDataId`, `tempDataId`, `notificationsDataId`, `userFriendsDataArr`)";
export const userNotificationsScheme =
  "(`id`, `userId`, `newFriendsList`, `newMessagesList`)";
export const userFriendsTableScheme =
  "(`id`, `userId`, `friendId`, `createdTime`, `isAccept`)";
export const newFriendsNotifications =
  "(`id`, `userId`, `friendId`, `createdDate`, `isRead`)";
