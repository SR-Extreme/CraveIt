//Frontend → Controller → Service → Model (DB)
import orderModel from "../models/orderModel.js";

//update order status
const updateOrderStatus = async (orderId, status) => {
    try {
        const order = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true });
        return order;
    } catch (error) {
        console.log("Error updating order:", error);
        throw error;
    }
};

//Get order by ID
const getOrderById = async (orderId) => {
    try {
        const order = await orderModel.findById(orderId);
        return order;

    } catch (error) {
        console.log("Error fetching order:", error);
        throw error;
    }
};

export { updateOrderStatus, getOrderById };