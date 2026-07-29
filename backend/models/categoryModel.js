import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        image: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

categorySchema.index({ name: 1 });

const categoryModel =
    mongoose.models.category || mongoose.model("category", categorySchema);

export default categoryModel;