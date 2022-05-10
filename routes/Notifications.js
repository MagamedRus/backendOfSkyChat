import { Router } from "express";
import { ROUTE_NOTIFICATIONS_ALL } from "../constans/routes.js";
import NotificationsController from "../controllers/NotificationsController.js";

const routerNotifications = new Router();
const notificationsController = new NotificationsController();

routerNotifications.post(ROUTE_NOTIFICATIONS_ALL, (req, res) =>
  notificationsController.getAllNotificationsReq(req, res)
);

export default routerNotifications;
