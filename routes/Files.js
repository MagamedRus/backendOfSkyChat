import { Router } from "express";
import { ROUTE_IMAGE_NEW } from "../constans/routes.js";
import FilesController from "../controllers/FilesController.js";

const routerFiles = new Router();
const filesController = new FilesController();

routerFiles.post(ROUTE_IMAGE_NEW, (req, res) =>
  filesController.createImage(req, res)
);

export default routerFiles;
