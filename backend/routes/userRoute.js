import express from "express"
import { deleteAddress, getAllUsers, getUser, loginUser, resgisterUser, updateAddress, updatePassword } from "../controllers/userController.js"
import authMiddleware from "../middleware/auth.js";
import roleMiddleware from "../middleware/role.js";

const userRouter = express.Router();

userRouter.post("/register", resgisterUser);
userRouter.post("/login", loginUser);
userRouter.post("/getuser", authMiddleware, getUser);
userRouter.post("/updatepassword", updatePassword);
userRouter.post("/updateaddress", updateAddress);
userRouter.post("/deleteaddress", authMiddleware, deleteAddress);
userRouter.get("/getallusers",authMiddleware,roleMiddleware("admin"),getAllUsers);

export default userRouter;