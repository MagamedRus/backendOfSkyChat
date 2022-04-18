import mysql from "mysql";
import promiseMySql from 'mysql2/promise';
import { MYSQL_CONFIG } from "../constans/config.js";

export const getDBConn = () => {
  return mysql.createPool({ connectionLimit: 10, ...MYSQL_CONFIG });
};

export const getSyncDBConn = () => {
  return promiseMySql.createConnection(MYSQL_CONFIG);
};
