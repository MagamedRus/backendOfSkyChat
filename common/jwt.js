import jwt from "jsonwebtoken";
import { jwtSecretKey } from "../constans/config.js";

const generateAccessToken = (userId) => {
  const payload = { userId };
  return jwt.sign(payload, jwtSecretKey, { expiresIn: "24h" });
};

export default generateAccessToken;
