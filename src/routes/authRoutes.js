import { Router } from "express";
import { login, refreshToken, signUp } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/auth/signup", signUp);
authRouter.post("/auth/login", login);
authRouter.post("/auth/refresh-token", refreshToken);

export default authRouter;
