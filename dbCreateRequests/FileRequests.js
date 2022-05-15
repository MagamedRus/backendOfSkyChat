import { INSERT, NULL, INTO, VALUES } from "../constans/db/dbRequestElements.js";
import { IMAGES } from "../constans/db/dbTableNames.js";
import { imagesTableScheme } from "../constans/db/dbTableSchemes.js";

export const createImage = (image, smallImage) => {
  const leftPartReq = `${INSERT} ${INTO} ${"`"}${IMAGES}${"`"} ${imagesTableScheme}`;
  const imageParam = image ? `'${image}'` : NULL;
  const smallImageParam = smallImage ? `'${smallImage}'` : NULL;

  return `${leftPartReq} ${VALUES} (${NULL}, ${smallImageParam}, ${imageParam})`;
};
