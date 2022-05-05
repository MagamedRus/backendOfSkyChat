import { Router } from "express";
import {
  ROUTE_FRIENDS_DATA,
  ROUTE_FRIENDS_INVITE,
} from "../constans/routes.js";
import FriendsController from "../controllers/FriendsController.js";

const routerFriends = new Router();
const friendsController = new FriendsController();

routerFriends.post(ROUTE_FRIENDS_DATA, (req, res) =>
  friendsController.getNewFriends(req, res)
);

routerFriends.post(ROUTE_FRIENDS_INVITE, (req, res) =>
  friendsController.sendInvite(req, res)
);

export default routerFriends;
