import mongoose from "mongoose";

const coordsSchema = {
    lat: { type: Number, default: null },
    lng: { type: Number, default: null },
};

const deliverySchema = new mongoose.Schema(
    {
        orderId: { type: mongoose.Schema.Types.ObjectId, ref: "order", required: true },
        deliveryPartnerId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
        status: {
            type: String,
            enum: ["Assigned", "Picked", "Out for Delivery", "Delivered"],
            default: "Assigned",
        },
        currentLocation: coordsSchema,
        destinationLocation: coordsSchema,
        lastEta: { type: Number, default: null },
        lastDistance: { type: Number, default: null },
        lastUpdated: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

const deliveryModel = mongoose.models.delivery || mongoose.model("delivery", deliverySchema);
export default deliveryModel;
