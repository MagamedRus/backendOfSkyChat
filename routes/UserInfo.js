import { Router } from "express";
import { ROUTE_USER_INFO } from "../constans/routes.js";
import UserInfoController from "../controllers/UserInfoController.js";

const routerUserInfo = new Router();
const userController = new UserInfoController();

routerUserInfo.post(ROUTE_USER_INFO, (req, res) =>
  userController.create(req, res)
);
routerUserInfo.get(ROUTE_USER_INFO, (req, res) =>
  userController.getAll(req, res)
);

export default routerUserInfo;
