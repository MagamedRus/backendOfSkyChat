export const PORT = process.env.PORT || 8081;
export const MYSQL_CONFIG = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USERNAME || "root",
  database: process.env.DB_NAME || "open_chat",
  password: process.env.DB_PASSWORD || "root",
};

export const SYNC_MYSQL_CONFIG = {
  ...MYSQL_CONFIG,
  waitForConnections: true,
  connectionLimit: 20000,
  queueLimit: 0,
};
