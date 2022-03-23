import { Router } from "express";
import { ROUTE_USER_INFO } from "../constans/routes.js";
import UserInfoController from "../controllers/UserInfoController.js";

const routerUserInfo = new Router();

routerUserInfo.post(ROUTE_USER_INFO, UserInfoController.create);
routerUserInfo.get(ROUTE_USER_INFO, UserInfoController.getById);

export default routerUserInfo;
