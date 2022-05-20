import {
  INSERT,
  NULL,
  INTO,
  VALUES,
  DELETE,
  FROM,
  WHERE,
  SELECT,
  ALL,
} from "../constans/db/dbRequestElements.js";
import { IMAGES } from "../constans/db/dbTableNames.js";
import { imagesTableScheme } from "../constans/db/dbTableSchemes.js";

export const createImageReq = (image, smallImage) => {
  const leftPartReq = `${INSERT} ${INTO} ${"`"}${IMAGES}${"`"} ${imagesTableScheme}`;
  const imageParam = image ? `'${image}'` : NULL;
  const smallImageParam = smallImage ? `'${smallImage}'` : NULL;

  return `${leftPartReq} ${VALUES} (${NULL}, ${smallImageParam}, ${imageParam})`;
};

export const deleteImageByIdReq = (imageId) => {
  const leftPartReq = `${DELETE} ${FROM} ${"`"}${IMAGES}${"`"} ${WHERE}`;
  return `${leftPartReq} ${"`"}${IMAGES}${"`"}.${"`id`"} = ${imageId}`;
};

export const getImageByIdReq = (imageId) => {
  const leftPartReq = `${SELECT} ${ALL} ${FROM} ${"`"}${IMAGES}${"`"} ${WHERE}`;
  return `${leftPartReq} ${"`"}${IMAGES}${"`"}.${"`id`"} = ${imageId}`;
};
