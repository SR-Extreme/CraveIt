import express from "express"
import { deleteAddress, getUser, loginUser, resgisterUser, updateAddress, updatePassword } from "../controllers/userController.js"
import authMiddleware from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/register", resgisterUser);
userRouter.post("/login", loginUser);
userRouter.post("/getuser", authMiddleware, getUser);
userRouter.post("/updatepassword", updatePassword);
userRouter.post("/updateaddress", updateAddress);
userRouter.post("/deleteaddress", authMiddleware, deleteAddress);

export default userRouter;