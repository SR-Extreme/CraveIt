import express from "express";
import { assignDelivery, getMyDeliveries, updateAvailability, updateDeliveryStatus } from "../controllers/deliveryController.js";
import authMiddleware from "../middleware/auth.js";
import roleMiddleware from "../middleware/role.js";

const deliveryRouter = express.Router();

// Assign delivery (Admin only)
deliveryRouter.post("/assign", /*authMiddleware, roleMiddleware("admin"),*/ assignDelivery);
// Get delivery partner orders
deliveryRouter.get("/my-deliveries", authMiddleware, roleMiddleware("delivery"), getMyDeliveries);
// Update delivery status
deliveryRouter.post("/update-status", /*authMiddleware, roleMiddleware("delivery"),*/ updateDeliveryStatus);

deliveryRouter.post("/update-available", authMiddleware, roleMiddleware("delivery"), updateAvailability);

export default deliveryRouter;