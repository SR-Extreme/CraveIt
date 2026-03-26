import mongoose from "mongoose"

const deliverySchema = new mongoose.Schema(
    {
        orderId: { type: mongoose.Schema.Types.ObjectId, ref: "order", required: true },
        deliveryPartnerId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
        status: { type: String, enum: ["Assigned", "Picked", "Out for Delivery", "Delivered"], default: "Assigned" },
        currentLocation: { lat: { type: Number, default: 0 }, lng: { type: Number, default: 0 } },
        lastUpdated: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

const deliveryModel = mongoose.models.delivery || mongoose.model("delivery", deliverySchema);
export default deliveryModel;