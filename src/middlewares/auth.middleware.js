import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized!",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Invalid Token",
      });
    }

    const user = jwt.verify(token, process.env.ACCESS_SECRET);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error!",
    });
  }
};

export default verifyToken;
