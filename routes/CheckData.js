import { Router } from "express";
import {
  ROUTE_CHECK,
  ROUTE_USER_EMAIL,
  ROUTE_USER_LOGIN,
  ROUTE_USER_AUTH,
} from "../constans/routes.js";
import CheckDataController from "../controllers/CheckDataController.js";

const routerCheckData = new Router();
const userController = new CheckDataController();

routerCheckData.post(`${ROUTE_CHECK}${ROUTE_USER_EMAIL}`, (req, res) =>
  userController.checkUserByEmail(req, res)
);
routerCheckData.post(ROUTE_CHECK + ROUTE_USER_LOGIN, (req, res) =>
  userController.checkUserByLogin(req, res)
);

routerCheckData.post(ROUTE_CHECK + ROUTE_USER_AUTH, (req, res) =>
  userController.authUser(req, res)
);

export default routerCheckData;
