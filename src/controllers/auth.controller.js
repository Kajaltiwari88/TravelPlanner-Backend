import validator from "validator";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateTokens.js";
import customRequestHandler from "../utils/customRequestHandler.js";
import jwt from "jsonwebtoken";

const validateName = (name) => {
  if (!name || validator.isEmpty(name.trim())) {
    return "Name is required";
  }

  if (!validator.isLength(name.trim(), { min: 2, max: 50 })) {
    return "Name must be between 2 and 50 characters";
  }

  return null;
};

const validateEmail = (email) => {
  if (!email || validator.isEmpty(email.trim())) {
    return "Email is required";
  }

  if (!validator.isEmail(email.trim())) {
    return "Invalid email format";
  }

  return null;
};

const validatePassword = (password) => {
  if (!password || validator.isEmpty(password)) {
    return "Password is required";
  }

  if (!validator.isLength(password, { min: 8, max: 128 })) {
    return "Password must be between 8 and 128 characters";
  }

  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter";
  }

  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }

  if (!/[0-9]/.test(password)) {
    return "Password must contain at least one number";
  }

  if (!/[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/~`]/.test(password)) {
    return "Password must contain at least one special character";
  }

  return null;
};

export const signUp = customRequestHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const nameError = validateName(name);
  if (nameError) {
    return res.status(400).json({
      success: false,
      message: nameError,
    });
  }

  const emailError = validateEmail(email);
  if (emailError) {
    return res.status(400).json({
      success: false,
      message: emailError,
    });
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    return res.status(400).json({
      success: false,
      message: passwordError,
    });
  }

  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await User.findOne({
    email: normalizedEmail,
  });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "Email already registered",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
  });

  return res.status(201).json({
    success: true,
    message: "Account Created Successfully!",
  });
});

export const login = customRequestHandler(async (req, res) => {
  const { email, password } = req.body;

  const emailError = validateEmail(email);
  if (emailError) {
    return res.status(400).json({
      success: false,
      message: emailError,
    });
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    return res.status(400).json({
      success: false,
      message: passwordError,
    });
  }

  const normalizedEmail = email.trim().toLowerCase();

  const user = await User.findOne({
    email: normalizedEmail,
  });

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  const token = generateAccessToken(user);

  const refreshToken = generateRefreshToken(user);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({
    success: true,
    message: "Login Successfully!",
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAuthenticated: true,
      },
      token,
    },
  });
});

export const refreshToken = customRequestHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: "No refresh token found",
    });
  }

  let decoded;

  try {
    decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired refresh token",
    });
  }

  const userId = decoded?.user?._id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Invalid refresh token data",
    });
  }

  const user = await User.findById(userId);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "User not found",
    });
  }

  const token = generateAccessToken(user);

  return res.status(200).json({
    success: true,
    message: "Token refreshed successfully",
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAuthenticated: true,
      },
      token,
    },
  });
});
