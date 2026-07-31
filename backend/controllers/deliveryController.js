import deliveryModel from "../models/deliveryModel.js";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import generateOTP from "../utils/generateOtp.js";
import { getIO } from "../config/socket.js";
import {
    emitOrderStatusUpdate,
    getLastKnownTracking,
} from "../services/trackingService.js";

const assignDelivery = async (req, res) => {
    try {
        const { orderId, deliveryPartnerId } = req.body;

        const existing = await deliveryModel.findOne({ orderId });
        if (existing) {
            return res.json({ success: false, message: "Delivery already assigned" });
        }

        const delivery = new deliveryModel({
            orderId,
            deliveryPartnerId,
            status: "Assigned",
        });

        await delivery.save();

        await orderModel.findByIdAndUpdate(orderId, {
            status: "Assigned",
        });

        emitOrderStatusUpdate(orderId, "Assigned");

        res.json({ success: true, message: "Delivery assigned", data: delivery });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error assigning delivery" });
    }
};

const getMyDeliveries = async (req, res) => {
    try {
        const deliveryPartnerId = req.userId;

        const deliveries = await deliveryModel
            .find({ deliveryPartnerId })
            .populate("orderId");

        res.json({ success: true, data: deliveries });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching deliveries" });
    }
};

const updateDeliveryStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        if (status === "Delivered") {
            return res.json({
                success: false,
                message: "Use OTP verification to mark order as Delivered",
            });
        }

        const nextStatusMap = {
            Assigned: "Picked",
            Picked: "Out for Delivery",
        };

        if (!["Picked", "Out for Delivery"].includes(status)) {
            return res.json({ success: false, message: "Invalid status" });
        }

        const existing = await deliveryModel.findOne({ orderId });

        if (!existing) {
            return res.json({ success: false, message: "Delivery not found" });
        }

        if (String(existing.deliveryPartnerId) !== String(req.userId)) {
            return res.json({ success: false, message: "Access denied" });
        }

        const expectedNext = nextStatusMap[existing.status];
        if (!expectedNext) {
            return res.json({
                success: false,
                message: "No further status updates allowed from current state",
            });
        }

        if (status !== expectedNext) {
            return res.json({
                success: false,
                message: `Can only advance to "${expectedNext}" from "${existing.status}"`,
            });
        }

        const delivery = await deliveryModel.findOneAndUpdate(
            { orderId },
            { status, lastUpdated: Date.now() },
            { new: true }
        );

        await orderModel.findByIdAndUpdate(orderId, { status });
        emitOrderStatusUpdate(orderId, status);

        res.json({ success: true, message: "Status updated", data: delivery });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error updating status" });
    }
};

const requestDeliveryOtp = async (req, res) => {
    try {
        const { orderId } = req.body;

        const delivery = await deliveryModel.findOne({ orderId });

        if (!delivery) {
            return res.json({ success: false, message: "Delivery not found" });
        }

        if (String(delivery.deliveryPartnerId) !== String(req.userId)) {
            return res.json({ success: false, message: "Access denied" });
        }

        if (delivery.status === "Delivered") {
            return res.json({
                success: false,
                message: "Order already delivered",
            });
        }

        if (delivery.status !== "Out for Delivery") {
            return res.json({
                success: false,
                message: "Order must be Out for Delivery before OTP",
            });
        }

        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.json({ success: false, message: "Order not found" });
        }

        const otp = generateOTP();
        order.deliveryOtp = otp;
        order.deliveryOtpExpiry = Date.now() + 10 * 60 * 1000;
        await order.save();

        const roomId = String(orderId);
        const io = getIO();
        io.to(roomId).emit("deliveryOtp", {
            orderId: roomId,
            deliveryOtp: otp,
        });

        res.json({
            success: true,
            message: "OTP sent to customer. Enter OTP to complete delivery.",
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error generating OTP" });
    }
};

const verifyDeliveryOtp = async (req, res) => {
    try {
        const { orderId, otp } = req.body;

        if (!orderId || !otp) {
            return res.json({
                success: false,
                message: "orderId and otp are required",
            });
        }

        const delivery = await deliveryModel.findOne({ orderId });
        if (!delivery) {
            return res.json({ success: false, message: "Delivery not found" });
        }

        if (String(delivery.deliveryPartnerId) !== String(req.userId)) {
            return res.json({ success: false, message: "Access denied" });
        }

        if (delivery.status === "Delivered") {
            return res.json({
                success: false,
                message: "Order already delivered",
            });
        }

        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.json({ success: false, message: "Order not found" });
        }

        if (
            !order.deliveryOtp ||
            order.deliveryOtp !== String(otp) ||
            !order.deliveryOtpExpiry ||
            order.deliveryOtpExpiry < Date.now()
        ) {
            return res.json({
                success: false,
                message: "Invalid or expired OTP",
            });
        }

        order.deliveryOtp = null;
        order.deliveryOtpExpiry = null;
        order.status = "Delivered";
        await order.save();

        delivery.status = "Delivered";
        delivery.lastUpdated = Date.now();
        await delivery.save();

        emitOrderStatusUpdate(orderId, "Delivered");

        const roomId = String(orderId);
        const io = getIO();
        io.to(roomId).emit("deliveryOtp", {
            orderId: roomId,
            deliveryOtp: null,
        });

        res.json({
            success: true,
            message: "OTP verified. Order delivered.",
            data: delivery,
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error verifying OTP" });
    }
};

const getLiveTracking = async (req, res) => {
    try {
        const { orderId } = req.params;
        const tracking = await getLastKnownTracking(orderId);

        if (!tracking) {
            return res.json({ success: false, message: "No delivery found for this order" });
        }

        res.json({ success: true, data: tracking });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching live tracking" });
    }
};

const updateAvailability = async (req, res) => {
    const { available } = req.body;
    const userId = req.userId;
    try {
        await userModel.findByIdAndUpdate(userId, { available: available });
        return res.json({ success: true, message: "Wait for further Assignment's" });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "error" });
    }
};

const updateAvailabilitytoFalse = async (req, res) => {
    const { available, deliveryId } = req.body;
    try {
        await userModel.findByIdAndUpdate(deliveryId, { available: available });
        return res.json({ success: true, message: "Wait for further Assignment's" });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "error" });
    }
};

export {
    assignDelivery,
    getMyDeliveries,
    updateDeliveryStatus,
    requestDeliveryOtp,
    verifyDeliveryOtp,
    getLiveTracking,
    updateAvailability,
    updateAvailabilitytoFalse,
};
