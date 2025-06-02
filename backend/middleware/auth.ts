import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const { ACCESS_TOKEN_SECRET } = process.env;

export const verifyAccessToken = (req, res, next) => {
  const bearer = req.headers["authorization"];
  const token = bearer && bearer.split(" ")[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err || !decoded) {
      return res.sendStatus(403);
    }

    req.user = decoded;
    next();
  });
};

export const verifyRefreshToken = (req, res, next) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return res.sendStatus(401);
  }

  jwt.verify(refreshToken, ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err || !decoded) {
      return res.sendStatus(403);
    }

    req.user = decoded;
    next();
  });
};
