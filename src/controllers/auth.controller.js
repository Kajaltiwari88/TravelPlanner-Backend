import validator from "validator";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import { generateAccessToken } from "../utils/generateTokens.js";
import customRequestHandler from "../utils/customRequestHandler.js";

export const signUp = customRequestHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (
    validator.isEmpty(name || "") ||
    validator.isEmpty(email || "") ||
    validator.isEmpty(password || "")
  ) {
    return res.status(400).json({
      success: false,
      message: "All Fields are required!",
    });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email format",
    });
  }

  if (!validator.isLength(password, { min: 8 })) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 8 characters long",
    });
  }

  const existingUser = await User.findOne({
    email: email?.toLowerCase(),
  });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "Email already registered",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({ name, email, password: hashedPassword });
  return res.status(200).json({
    success: true,
    message: "Account Created Successfully!",
  });
});

export const login = customRequestHandler(async (req, res) => {
  const { email, password } = req?.body;

  if (validator.isEmpty(email || "") || validator.isEmpty(password || "")) {
    return res.status(400).json({
      success: false,
      message: "All Fields are required!",
    });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email format",
    });
  }

  if (!validator.isLength(password, { min: 8 })) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 8 characters long",
    });
  }

  const user = await User.findOne({
    email: email?.toLowerCase().trim(),
  });
  const isPasswordMatched = await bcrypt.compare(password, user?.password);
  
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid Credentials",
    });
  }

  if (!isPasswordMatched) {
    return res.status(401).json({
      success: false,
      message: "Invalid Password",
    });
  }

  const AccessToken = await generateAccessToken(user);
  return res?.status(200).json({
    success: true,
    message: "Login Successfully!",
    userName: user?.name,
    token: AccessToken,
  });
});
