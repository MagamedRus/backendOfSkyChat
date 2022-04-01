import { Router } from "express";
import {
  ROUTE_CHECK,
  ROUTE_USER_EMAIL,
  ROUTE_USER_LOGIN,
} from "../constans/routes.js";
import CheckDataController from "../controllers/CheckDataController.js";

const routerCheckData = new Router();
const userController = new CheckDataController();

routerCheckData.get(`${ROUTE_CHECK}${ROUTE_USER_EMAIL}`, (req, res) =>
  userController.checkUserByEmail(req, res)
);
routerCheckData.get(ROUTE_CHECK + ROUTE_USER_LOGIN, (req, res) =>
  userController.checkUserByLogin(req, res)
);

export default routerCheckData;
