import { Router } from "express";
import { ROUTE_AUTH } from "../constans/routes.js";
import AuthController from "../controllers/AuthController.js";

const routerAuth = new Router();
const authController = new AuthController();

routerAuth.post(ROUTE_AUTH, (req, res) => authController.authUser(req, res));

export default routerAuth;
