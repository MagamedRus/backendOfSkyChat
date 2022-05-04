import { Router } from "express";
import { ROUTE_FRIENDS_DATA } from "../constans/routes.js";
import FriendsController from "../controllers/FriendsController.js";

const routerFriends = new Router();
const friendsController = new FriendsController();

routerFriends.post(ROUTE_FRIENDS_DATA, (req, res) =>
  friendsController.getNewFriends(req, res)
);

export default routerFriends;
