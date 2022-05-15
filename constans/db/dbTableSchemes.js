export const userSelfDataTableScheme =
  "(`id`, `login`, `email`, `password`, `firstName`, `secondName`, `lastName`, `registrationDate`, `birthPlace`, `birthday`)";
export const chatTableScheme =
  "(`id`, `adminsId`, `title`, `usersId`,`imageId`, `chatHistory`, `createDate`, `isGeneral`, `lastChangeDate`, `isAdminChat`)";
export const tempDataTableScheme = "(`id`, `lastActiveTime`, `deviceToken`)";
export const userDataTableScheme =
  "(`id`, `selfDataId`, `tempDataId`, `notificationsDataId`, `userFriendsDataArr`, `userChatsDataArr`)";
export const userNotificationsScheme =
  "(`id`, `userId`, `newFriendsList`, `newMessagesList`)";
export const userFriendsTableScheme =
  "(`id`, `friendId`, `createdTime`, `isAccept`)";
export const newFriendsNotifications =
  "(`id`, `userId`, `friendId`, `createdDate`, `isRead`)";
export const imagesTableScheme = "(`id`, `smallImage`, `image`)";
