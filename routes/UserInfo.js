import { Router } from "express";
import { ROUTE_USER_INFO } from "../constans/routes.js";
import UserInfoController from "../controllers/UserInfoController.js";

const routerUserInfo = new Router();

routerUserInfo.post(ROUTE_USER_INFO, (req, res) =>
  UserInfoController.create(req, res)
);
routerUserInfo.get(ROUTE_USER_INFO, (req, res) =>
  UserInfoController.getById(req, res)
);

export default routerUserInfo;
