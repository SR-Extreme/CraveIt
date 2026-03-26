import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator"

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

        const token = createToken(user._id);
        res.json({ success: true, token });
    } catch (error) {
        res.json({ success: false, message: "Error" });
    }
}

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
}

//register user
const resgisterUser = async (req, res) => {
    const { name, password, email, phone, role } = req.body;
    try {
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

        const user = await newUser.save();
        const token = createToken(user._id);
        res.json({ success: true, token });

    } catch (error) {
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

export { loginUser, resgisterUser, getUser, updatePassword, updateAddress, deleteAddress };