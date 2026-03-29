import deliveryModel from "../models/deliveryModel.js"
import orderModel from "../models/orderModel.js"
import userModel from "../models/userModel.js";

//assign delivery partner to order
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

        res.json({ success: true, message: "Delivery assigned", data: delivery });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error assigning delivery" });
    }
}

//get delivery partner's assigned orders
const getMyDeliveries = async (req, res) => {
    try {
        const deliveryPartnerId = req.userId;

        const deliveries = await deliveryModel
            .find({ deliveryPartnerId })
            .populate("orderId"); //Replaces the orderId reference with the actual order document

        res.json({ success: true, data: deliveries });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching deliveries" });
    }
};

const updateDeliveryStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        // update delivery
        const delivery = await deliveryModel.findOneAndUpdate(
            { orderId },
            { status, lastUpdated: Date.now() },
            { new: true } //new: true tells Mongoose to return the UPDATED document instead of the old one.
        );

        await orderModel.findByIdAndUpdate(orderId, { status });

        res.json({ success: true, message: "Status updated", data: delivery });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error updating status" });
    }
}

//update the availability
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
}

export { assignDelivery, getMyDeliveries, updateDeliveryStatus, updateAvailability }