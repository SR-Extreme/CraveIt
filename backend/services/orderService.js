//Frontend → Controller → Service → Model (DB)
import orderModel from "../models/orderModel.js";
import foodModel from "../models/foodModel.js";
import userModel from "../models/userModel.js";

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

const updateAggregatesOnPaymentSuccess = async (order) => {
    const foodUpdates = order.items
        .filter((item) => item._id)
        .map((item) =>
            foodModel.findByIdAndUpdate(item._id, {
                $inc: {
                    totalQuantityBought: item.quantity || 0,
                    totalOrders: 1,
                },
            })
        );

    const userUpdate = userModel.findByIdAndUpdate(order.userId, {
        $inc: { totalAmountBought: order.amount },
    });

    await Promise.all([...foodUpdates, userUpdate]);
};

const markOrderPaid = async (orderId) => {
    const order = await orderModel.findById(orderId);

    if (!order) {
        throw new Error("Order not found");
    }

    if (order.payment) {
        return order;
    }

    await orderModel.findByIdAndUpdate(orderId, { payment: true });
    await updateAggregatesOnPaymentSuccess(order);

    return await orderModel.findById(orderId);
};

export { updateOrderStatus, getOrderById, updateAggregatesOnPaymentSuccess, markOrderPaid };

