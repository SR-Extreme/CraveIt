import express from "express"
import authMiddleware from "../middleware/auth.js"
import requirePermission from "../middleware/permissions.js";
import { PERMISSIONS } from "../utils/permissions.js";
import { listOrders, placeOrder, updateStatus, updateTrackOrder, userOrders, verifyOrder, getOrderStats, rateOrder } from "../controllers/orderController.js"

const orderRouter = express.Router();

orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/verify", verifyOrder);
orderRouter.post("/userorders", authMiddleware, userOrders);
orderRouter.post("/trackorder", updateTrackOrder);
orderRouter.post("/rate", authMiddleware, rateOrder);

orderRouter.get(
    "/list",
    authMiddleware,
    requirePermission(PERMISSIONS.ORDERS_VIEW),
    listOrders
);

orderRouter.post(
    "/status",
    authMiddleware,
    requirePermission(PERMISSIONS.ORDERS_STATUS),
    updateStatus
);

orderRouter.get(
    "/stats",
    authMiddleware,
    requirePermission(PERMISSIONS.ORDERS_STATS),
    getOrderStats
);

export default orderRouter;