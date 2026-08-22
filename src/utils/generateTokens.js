import jwt from "jsonwebtoken";

export const generateAccessToken = async (userId) => {
  return await jwt.sign({ id: userId }, process.env.ACCESS_SECRET, {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = async (userId) => {
  return await jwt.sign({ id: userId }, process.env.REFRESH_SECRET, {
    expiresIn: "7d",
  });
};
