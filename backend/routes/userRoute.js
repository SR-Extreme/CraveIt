import express from "express"
import { getUser, loginUser, resgisterUser, updatePassword } from "../controllers/userController.js"
import authMiddleware from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/register", resgisterUser);
userRouter.post("/login", loginUser);
userRouter.post("/getuser", authMiddleware, getUser);
userRouter.post("/updatepassword", updatePassword);

export default userRouter;