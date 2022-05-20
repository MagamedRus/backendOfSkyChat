import { Router } from "express";
import { ROUTE_IMAGE_NEW, ROUTE_IMAGE_GET } from "../constans/routes.js";
import FilesController from "../controllers/FilesController.js";

const routerFiles = new Router();
const filesController = new FilesController();

routerFiles.post(ROUTE_IMAGE_NEW, (req, res) =>
  filesController.createImage(req, res)
);

routerFiles.post(ROUTE_IMAGE_GET, (req, res) =>
  filesController.getImage(req, res)
);

export default routerFiles;
