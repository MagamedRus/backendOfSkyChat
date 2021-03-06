import { Router } from "express";
import {
  ROUTE_CHECK,
  ROUTE_USER_EMAIL,
  ROUTE_USER_LOGIN,
  ROUTE_CHECK_PASSWORD,
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
routerCheckData.post(ROUTE_CHECK + ROUTE_CHECK_PASSWORD, (req, res) =>
  userController.checkPassword(req, res)
);

export default routerCheckData;
