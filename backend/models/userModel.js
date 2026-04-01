import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: Number, required: true, unique: true },
    address: {
        type:
            [
                {
                    firstName: String,
                    lastName: String,
                    email: String,
                    street: String,
                    city: String,
                    state: String,
                    zipcode: String,
                    country: String,
                    phone: String
                }
            ], default: []
    },
    role: {
        type: String,
        enum: ["user", "admin", "delivery"],
        required: true,
    },
    password: { type: String, required: true },
    cartData: { type: Object, default: {} },
    available: { type: Boolean, default: true },
    otp:{ type: String},
    otpExpiry:{ type: Date},
}, { minimize: false })

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;