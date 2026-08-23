import customRequestHandler from "../utils/customRequestHandler.js";

export const user = customRequestHandler(async (req, res) => {
  const { user } = req;

  if (user) {
    res.status(200).json({ user });
  } else {
    res.status(400).json({ success: false, message: "User not found" });
  }
});
