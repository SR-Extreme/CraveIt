import express from "express"
import { deleteAddress, getAllUsers, getUser, getUserById, deleteUser, getTopCustomers, loginUser, logoutUser, registerUser, updateAddress, updatePassword, verifyOTP, forgotPassword, verifyResetOtp, resetPassword } from "../controllers/userController.js"
import authMiddleware from "../middleware/auth.js";
import requirePermission from "../middleware/permissions.js";
import { PERMISSIONS } from "../utils/permissions.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logoutUser);
userRouter.post("/verifyotp", verifyOTP);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/verify-reset-otp", verifyResetOtp);
userRouter.post("/reset-password", resetPassword);
userRouter.post("/getuser", authMiddleware, getUser);
userRouter.post("/updatepassword", updatePassword);
userRouter.post("/updateaddress", updateAddress);
userRouter.post("/deleteaddress", authMiddleware, deleteAddress);
userRouter.get("/getallusers", authMiddleware, requirePermission(PERMISSIONS.USERS_MANAGE), getAllUsers);
userRouter.get("/top-customers", authMiddleware, requirePermission(PERMISSIONS.USERS_MANAGE), getTopCustomers);
userRouter.get("/:id", authMiddleware, requirePermission(PERMISSIONS.USERS_MANAGE), getUserById);
userRouter.delete("/:id", authMiddleware, requirePermission(PERMISSIONS.USERS_MANAGE), deleteUser);

export default userRouter;