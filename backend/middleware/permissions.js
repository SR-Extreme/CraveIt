import userModel from "../models/userModel.js";
import { hasPermission } from "../utils/permissions.js";

const requirePermission = (permission) => {
    return async (req, res, next) => {
        try {
            const user = await userModel.findById(req.userId);

            if (!user) {
                return res.json({ success: false, message: "User not found" });
            }

            if (!hasPermission(user.role, permission)) {
                return res.json({
                    success: false,
                    message: "Access denied: insufficient permissions",
                });
            }

            req.user = user;
            req.userRole = user.role;
            next();
        } catch (error) {
            console.log(error);
            res.json({ success: false, message: "Permission check failed" });
        }
    };
};

export default requirePermission;