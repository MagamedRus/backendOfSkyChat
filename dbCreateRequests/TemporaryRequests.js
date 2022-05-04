import {
  INSERT,
  INTO,
  VALUES,
  NULL,
} from "../constans/db/dbRequestElements.js";
import { USER_TEMP_DATA } from "../constans/db/dbTableNames.js";
import { tempDataTableScheme } from "../constans/db/dbTableSchemes.js";

export const createTempDataRequest = () => {
  const leftPartRequest = `${INSERT} ${INTO} ${"`"}${USER_TEMP_DATA}${"`"} ${tempDataTableScheme}`;
  return `${leftPartRequest} ${VALUES} (${NULL}, ${NULL}, ${NULL})`;
};
