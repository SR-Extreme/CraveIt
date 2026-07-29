import express from "express"
import { deleteAddress, getAllUsers, getUser, getUserById, deleteUser, getTopCustomers, loginUser, registerUser, updateAddress, updatePassword, verifyOTP } from "../controllers/userController.js"
import authMiddleware from "../middleware/auth.js";
import requirePermission from "../middleware/permissions.js";
import { PERMISSIONS } from "../utils/permissions.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/verifyotp", verifyOTP);
userRouter.post("/getuser", authMiddleware, getUser);
userRouter.post("/updatepassword", updatePassword);
userRouter.post("/updateaddress", updateAddress);
userRouter.post("/deleteaddress", authMiddleware, deleteAddress);
userRouter.get("/getallusers", authMiddleware, requirePermission(PERMISSIONS.USERS_MANAGE), getAllUsers);
userRouter.get("/top-customers", authMiddleware, requirePermission(PERMISSIONS.USERS_MANAGE), getTopCustomers);
userRouter.get("/:id", authMiddleware, requirePermission(PERMISSIONS.USERS_MANAGE), getUserById);
userRouter.delete("/:id", authMiddleware, requirePermission(PERMISSIONS.USERS_MANAGE), deleteUser);

export default userRouter;