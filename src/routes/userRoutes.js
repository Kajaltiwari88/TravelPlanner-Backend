import { Router } from "express";
import { user } from "../controllers/user.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.get("/user-profile/", verifyToken, user);

export default userRouter;
