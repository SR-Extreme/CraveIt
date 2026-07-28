import deliveryModel from "../models/deliveryModel.js";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
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
    getLiveTracking,
    updateAvailability,
    updateAvailabilitytoFalse,
};
