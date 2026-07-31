import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator"
import generateOTP from "../utils/generateOtp.js";
import sendOTP from "../utils/sendOTP.js";
import { clearAuthCookie, setAuthCookie } from "../utils/authCookie.js";

//login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User doesn't exist" });
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({ success: false, message: "Invalid Credentials" });
        }

        if (user.role === "admin" || user.role === "superadmin") {
            const token = createToken(user._id);
            setAuthCookie(res, token);
            return res.json({
                success: true,
                role: user.role,
                requiresOtp: false,
            });
        }

        const otp = generateOTP();
        user.otp = otp;
        user.otpExpiry = Date.now() + 5 * 60 * 1000;
        await user.save();

        await sendOTP(email, otp, user.name, user.role);

        res.json({ success: true, message: "OTP sent successfully to Email", requiresOtp: true, role: user.role });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

//register user
const registerUser = async (req, res) => {
    const { name, password, email, phone, role } = req.body;
    try {
        const allowedRoles = ["user", "delivery"];

        if (!allowedRoles.includes(role)) {
            return res.json({
                success: false,
                message: "Registration is only allowed for user and delivery agent roles",
            });
        }

        //checking is user already exists
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" });
        }

        //validate email format and strong password
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }

        //if password is 8 character or more or not
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" });
        }

        if (phone.length != 10) {
            return res.json({ success: false, message: "Please enter a valid 10 digit Mobile Number" });
        }

        //hashing user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name: name,
            email: email,
            phone: phone,
            role: role,
            password: hashedPassword,
        })

        await newUser.save();
        res.json({ success: true, message: "User registered successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

//get current user
const getUser = async (req, res) => {
    const userId = req.userId;

    try {
        const user = await userModel.findById(userId).select("-password");

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        return res.json({ success: true, data: user });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

const updatePassword = async (req, res) => {
    const { email, oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        return res.json({
            success: false,
            message: "Please type both required Password's"
        });
    }

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User doesn't exist" });
        }

        const ismatch = await bcrypt.compare(oldPassword, user.password);
        if (!ismatch) {
            return res.json({ success: false, message: "Old password is incorrect!!" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        await userModel.findByIdAndUpdate(user._id, { password: hashedPassword });

        res.json({ success: true, message: "Password Updated Successfully!!" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

const updateAddress = async (req, res) => {
    const { address, email } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User doesn't exist" });
        }

        await userModel.findByIdAndUpdate(user._id, { $push: { address: address } });
        res.json({ success: true, message: "Address saved Successfully!!" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

const deleteAddress = async (req, res) => {
    const { id } = req.body;
    const userId = req.userId;
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User doesn't exist" });
        }

        user.address = user.address.filter((addr) => {
            return addr._id.toString() !== id;
        })

        await user.save();
        res.json({ success: true, message: "Address removed successfully!!" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

const getAllUsers = async (req, res) => {
    try {
        const filter = {};

        if (req.query.role) {
            filter.role = req.query.role;
        }

        const users = await userModel.find(filter).select("-password -otp");
        res.json({ success: true, data: users });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

const getUserById = async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id).select("-password -otp");

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        res.json({ success: true, data: user });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (String(id) === String(req.userId)) {
            return res.json({
                success: false,
                message: "You cannot delete your own account",
            });
        }

        const user = await userModel.findById(id);

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        if (user.role === "admin" || user.role === "superadmin") {
            return res.json({
                success: false,
                message: "Cannot delete admin accounts",
            });
        }

        await userModel.findByIdAndDelete(id);
        res.json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

const getTopCustomers = async (req, res) => {
    try {
        const customers = await userModel
            .find({ role: "user" })
            .select("name email phone totalAmountBought")
            .sort({ totalAmountBought: -1 })
            .limit(3);

        res.json({ success: true, data: customers });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

const verifyOTP = async (req, res) => {
    const { otp, email } = req.body;
    try {
        const user = await userModel.findOne({ email });

        if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
            return res.json({ success: false, message: "Invalid or expired OTP" });
        }

        user.otp = null;
        user.otpExpiry = null;
        await user.save();

        const token = createToken(user._id);
        setAuthCookie(res, token);

        res.json({ success: true, role: user.role });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

const logoutUser = async (req, res) => {
    clearAuthCookie(res);
    res.json({ success: true, message: "Logged out successfully" });
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email || !validator.isEmail(email)) {
        return res.json({ success: false, message: "Please enter a valid email" });
    }

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User doesn't exist" });
        }

        const otp = generateOTP();
        user.otp = otp;
        user.otpExpiry = Date.now() + 5 * 60 * 1000;
        await user.save();

        await sendOTP(email, otp, user.name, user.role, "reset");

        res.json({ success: true, message: "OTP sent successfully to Email" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error sending OTP" });
    }
};

const verifyResetOtp = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.json({ success: false, message: "Email and OTP are required" });
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
            return res.json({ success: false, message: "Invalid or expired OTP" });
        }

        res.json({ success: true, message: "OTP verified successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.json({ success: false, message: "All fields are required" });
    }

    if (newPassword.length < 8) {
        return res.json({ success: false, message: "Please enter a strong password" });
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
            return res.json({ success: false, message: "Invalid or expired OTP" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        user.otp = null;
        user.otpExpiry = null;
        await user.save();

        res.json({ success: true, message: "Password reset successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error resetting password" });
    }
};

export {
    loginUser,
    registerUser,
    getUser,
    updatePassword,
    updateAddress,
    deleteAddress,
    getAllUsers,
    getUserById,
    deleteUser,
    getTopCustomers,
    verifyOTP,
    logoutUser,
    forgotPassword,
    verifyResetOtp,
    resetPassword,
};