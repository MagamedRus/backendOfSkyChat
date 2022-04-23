import mysql from "mysql";
import promiseMySql from "mysql2/promise";
import { MYSQL_CONFIG, SYNC_MYSQL_CONFIG } from "../constans/config.js";

export const getDBConn = () => {
  return mysql.createPool({ connectionLimit: 10, ...MYSQL_CONFIG });
};

export const getSyncDBConn = () => {
  const pool = promiseMySql.createPool(SYNC_MYSQL_CONFIG);
  return pool.getConnection();
};
