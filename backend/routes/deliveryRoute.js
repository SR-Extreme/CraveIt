import express from "express";
import {
    assignDelivery,
    getMyDeliveries,
    getLiveTracking,
    updateAvailability,
    updateAvailabilitytoFalse,
    updateDeliveryStatus,
    requestDeliveryOtp,
    verifyDeliveryOtp,
} from "../controllers/deliveryController.js";
import authMiddleware from "../middleware/auth.js";
import roleMiddleware from "../middleware/role.js";

const deliveryRouter = express.Router();

deliveryRouter.post("/assign", authMiddleware, roleMiddleware(["admin", "superadmin"]), assignDelivery);
deliveryRouter.get("/my-deliveries", authMiddleware, roleMiddleware("delivery"), getMyDeliveries);
deliveryRouter.post("/update-status", authMiddleware, roleMiddleware("delivery"), updateDeliveryStatus);
deliveryRouter.post("/request-otp", authMiddleware, roleMiddleware("delivery"), requestDeliveryOtp);
deliveryRouter.post("/verify-otp", authMiddleware, roleMiddleware("delivery"), verifyDeliveryOtp);
deliveryRouter.get("/live/:orderId", getLiveTracking);
deliveryRouter.post("/update-available-true", authMiddleware, roleMiddleware("delivery"), updateAvailability);
deliveryRouter.post("/update-available-false", authMiddleware, roleMiddleware(["admin", "superadmin"]), updateAvailabilitytoFalse);

export default deliveryRouter;