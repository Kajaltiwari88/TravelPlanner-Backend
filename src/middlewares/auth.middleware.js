import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        sucesss: false,
        message: "Unauthorized!",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verfify(token, process.env.ACCESS_SECRET);

    req.userId = decoded?.id;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

export default verifyToken;