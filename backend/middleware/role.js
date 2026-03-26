import userModel from "../models/userModel.js";

const roleMiddleware = (requiredRole) => {
    return async (req, res, next) => {
        try {
            const userId = req.userId;
            const user = await userModel.findById(userId);

            if (!user) {
                return res.json({ success: false, message: "User not found" });
            }

            if (user.role !== requiredRole) {
                return res.json({
                    success: false,
                    message: "Access denied: insufficient permissions",
                });
            }

            next(); // allow access
        } catch (error) {
            console.log(error);
            res.json({ success: false, message: "Role check failed" });
        }
    }
};

export default roleMiddleware;