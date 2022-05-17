import { Router } from "express";
import {
  ROUTE_USER_INFO,
  ROUTE_USER_INFO_BY_ID,
  ROUTE_USER_INFO_BY_EMAIL,
  ROUTE_USER_NEW,
  ROUTE_USER_UPDATE,
} from "../constans/routes.js";
import UserInfoController from "../controllers/UserInfoController.js";

const routerUserInfo = new Router();
const userController = new UserInfoController();

routerUserInfo.post(ROUTE_USER_NEW, (req, res) =>
  userController.create(req, res)
);
routerUserInfo.post(ROUTE_USER_UPDATE, (req, res) =>
  userController.updateUserSelfData(req, res)
);
routerUserInfo.get(ROUTE_USER_INFO, (req, res) =>
  userController.getAll(req, res)
);
routerUserInfo.post(ROUTE_USER_INFO_BY_ID, (req, res) =>
  userController.getById(req, res)
);

routerUserInfo.post(ROUTE_USER_INFO_BY_EMAIL, (req, res) =>
  userController.getByEmail(req, res)
);

export default routerUserInfo;
