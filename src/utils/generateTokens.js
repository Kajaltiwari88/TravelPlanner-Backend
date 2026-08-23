import jwt from "jsonwebtoken";

export const generateAccessToken = async (user) => {
  return await jwt.sign({ user }, process.env.ACCESS_SECRET, {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = async (user) => {
  return await jwt.sign({ user }, process.env.REFRESH_SECRET, {
    expiresIn: "7d",
  });
};
