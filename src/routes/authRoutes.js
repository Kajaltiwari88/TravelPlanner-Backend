import { Router } from "express";
import { login, signUp } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/auth/signup", signUp);
authRouter.post("/auth/login", login);

export default authRouter;
