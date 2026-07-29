import mongoose from "mongoose"

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, default: "Food Processing" },
    date: { type: Date, default: Date.now },
    payment: { type: Boolean, default: false },
    deliveryOtp: { type: String },
    deliveryOtpExpiry: { type: Date },
    rated: { type: Boolean, default: false },
    rating: { type: Number, min: 1, max: 5 },
});

orderSchema.index({ userId: 1 });
orderSchema.index({ payment: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ date: -1 });

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);
export default orderModel;