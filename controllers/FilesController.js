import {
  createImageReq,
  deleteImageByIdReq,
  getImageByIdReq,
} from "../dbCreateRequests/FileRequests.js";
import {
  EMPTY_IMAGE_DATA,
  EMPTY_IMAGE_ID,
} from "../constans/types/exceptions.js";
import { getSyncDBConn } from "../common/sqlConnection.js";

class FilesController {
  async createImage(req, res) {
    try {
      const { image, smallImage, pastImageId } = req.body;
      if (image || smallImage) {
        const imageData = { image, smallImage };
        const imageId = await this.#insertImage(imageData);
        pastImageId && this.#deleteImage(pastImageId);
        res.json({ imageId });
      } else {
        res.status(400).json({
          message: EMPTY_IMAGE_DATA,
        });
      }
    } catch (e) {
      res.status(500).json({ message: e });
      console.log(e);
    }
  }

  async getImage(req, res) {
    let conn = null;
    try {
      const { imageId } = req.body;
      if (!imageId) {
        res.status(400).json({ message: EMPTY_IMAGE_ID });
      } else {
        conn = await getSyncDBConn();
        const [[imageData]] = await conn.execute(getImageByIdReq(imageId));
        res.json({ imageData });
      }
    } catch (e) {
      res.status(500).json({ message: e });
      console.log(e);
    }
    conn && conn.close();
  }

  async #deleteImage(imageId) {
    let conn = null;
    try {
      conn = await getSyncDBConn();
      await conn.execute(deleteImageByIdReq(imageId));
    } catch (e) {
      console.log(e);
    }
    conn && conn.close();
  }

  async #insertImage(imageData) {
    const { image, smallImage } = imageData;
    let imageId = -1;
    let conn = null;
    try {
      conn = await getSyncDBConn();
      let [insertData] = await conn.execute(createImageReq(image, smallImage));
      imageId = insertData?.insertId;
    } catch (e) {
      console.log(e);
    }

    conn && conn.close();
    return imageId;
  }
}

export default FilesController;
