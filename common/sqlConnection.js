import mysql from "mysql";
import { MYSQL_CONFIG } from "../constans/config.js";

export const getDBConn = () => {
  return mysql.createPool({ connectionLimit: 10, ...MYSQL_CONFIG });
};
