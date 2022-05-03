export const userSelfDataTableScheme =
  "(`id`, `login`, `email`, `password`, `firstName`, `secondName`, `lastName`, `registrationDate`, `birthPlace`, `birthday`)";
export const chatTableScheme =
  "(`id`, `adminsId`, `title`, `usersId`, `chatHistory`, `createDate`, `isGeneral`, `lastChangeDate`, `isAdminChat`)";
export const tempDataTableScheme = "(`id`, `lastActiveTime`, `deviceToken`)";
export const userDataTableScheme =
  "(`id`, `self_data_id`, `temp_data_id`, `notifications_data_id`)";
export const userNotificationsScheme =
  "(`id`, `userId`, `newFriendsList`, `newMessagesList`)";
