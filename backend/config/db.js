import mongoose from "mongoose";

export const connectDB = async () => {
    const mongoUri = process.env.MONGODB_URI || "mongodb+srv://foodapplication:sauravroy@cluster0.xztgd2d.mongodb.net/project";
    try {
        await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 30000,
        });
        console.log("DB Connected");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        throw error;
    }
};