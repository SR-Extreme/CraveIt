import orderModel from "../models/orderModel.js"
import userModel from "../models/userModel.js"
import foodModel from "../models/foodModel.js";
import Stripe from "stripe"
import { markOrderPaid } from "../services/orderService.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//placing user order for frontend
const placeOrder = async (req, res) => {
    const rawFrontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const frontend_url = /^https?:\/\//i.test(rawFrontendUrl.trim())
        ? rawFrontendUrl.trim().replace(/\/$/, "")
        : `https://${rawFrontendUrl.trim().replace(/\/$/, "")}`;

    try {
        const newOrder = new orderModel({
            userId: req.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address
        })
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.userId, { cartData: {} });

        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: "inr",
                product_data: { name: item.name },
                unit_amount: item.price * 100,
            },
            quantity: item.quantity,
        }))

        line_items.push({
            price_data: {
                currency: "inr",
                product_data: { name: "Delivery Charges" },
                unit_amount: 5 * 100
            },
            quantity: 1,
        })

        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: 'payment',
            discounts: req.body.isCorrectPromo ? [{ coupon: process.env.STRIPE_COUPON_ID }] : [],
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`, //this will take you to this url if successful payment is done
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`, //if unsuccessful payment
        })

        res.json({ success: true, session_url: session.url });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" })
    }
}

const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if (success == 'true') {
            await markOrderPaid(orderId);
            res.json({ success: true, message: "paid" })
        }
        else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: "Not Paid" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

//user orders for frontend

const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.userId });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

//isting orders for admin panel
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

//api for updating the status
const updateStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        res.json({ success: true, message: "Status Updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

// updating track order
const updateTrackOrder = async (req, res) => {
    try {
        const order = await orderModel.findById(req.body.orderId);
        res.json({ success: true, data: order });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

const getOrderStats = async (req, res) => {
    try {
        const paidOrders = await orderModel.find({ payment: true });

        const totalOrders = paidOrders.length;
        const totalRevenue = paidOrders.reduce(
            (sum, order) => sum + (order.amount || 0),
            0
        );

        const distinctFoodIds = new Set();
        paidOrders.forEach((order) => {
            (order.items || []).forEach((item) => {
                if (item._id) {
                    distinctFoodIds.add(String(item._id));
                }
            });
        });

        const totalItemsPurchased = distinctFoodIds.size;
        const averageRevenuePerOrder =
            totalOrders > 0 ? totalRevenue / totalOrders : 0;

        res.json({
            success: true,
            data: {
                totalRevenue,
                totalOrders,
                totalItemsPurchased,
                averageRevenuePerOrder,
            },
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

//updates each fod item rating and finally mark rated order.
const rateOrder = async (req, res) => {
    try {
        const { orderId, rating } = req.body;
        const stars = Number(rating);

        if (!orderId || !Number.isInteger(stars) || stars < 1 || stars > 5) {
            return res.json({
                success: false,
                message: "Invalid rating. Provide orderId and rating 1-5",
            });
        }

        const order = await orderModel.findById(orderId);

        if (!order) {
            return res.json({ success: false, message: "Order not found" });
        }

        if (String(order.userId) !== String(req.userId)) {
            return res.json({ success: false, message: "Access denied" });
        }

        if (order.status !== "Delivered") {
            return res.json({
                success: false,
                message: "Order must be delivered before rating",
            });
        }

        if (order.rated) {
            return res.json({
                success: false,
                message: "Order already rated",
            });
        }

        const uniqueFoodIds = [
            ...new Set(
                (order.items || [])
                    .filter((item) => item._id)
                    .map((item) => String(item._id))
            ),
        ];


        await Promise.all(
            uniqueFoodIds.map(async (foodId) => {
                const food = await foodModel.findById(foodId);

                if (!food) return;

                const totalRatingsGiven = (food.totalRatingsGiven || 0) + 1;
                const totalRating = (food.totalRating || 0) + stars;
                const averageRating = totalRating / totalRatingsGiven;

                food.totalRatingsGiven = totalRatingsGiven;
                food.totalRating = totalRating;
                food.averageRating = averageRating;

                await food.save();
            })
        );

        order.rated = true;
        order.rating = stars;
        await order.save();

        res.json({ success: true, message: "Rating submitted" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus, updateTrackOrder, getOrderStats, rateOrder }