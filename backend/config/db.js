import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect("mongodb+srv://foodapplication:sauravroy@cluster0.xztgd2d.mongodb.net/project")
    .then(()=>console.log("DB Conected"));
}