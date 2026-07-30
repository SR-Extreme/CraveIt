import categoryModel from "../models/categoryModel.js";
import foodModel from "../models/foodModel.js";
import fs from "fs";

const listCategories = async (req, res) => {
    try {
        const categories = await categoryModel.find({}).sort({ name: 1 });
        res.json({ success: true, data: categories });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

const addCategory = async (req, res) => {
    try {
        const name = (req.body.name || "").trim();

        if (!name) {
            return res.json({ success: false, message: "Category name is required" });
        }

        if (!req.file) {
            return res.json({ success: false, message: "Category image is required" });
        }

        const exists = await categoryModel.findOne({ name });
        if (exists) {
            return res.json({ success: false, message: "Category already exists" });
        }

        const category = new categoryModel({
            name,
            image: req.file.filename,
        });

        await category.save();
        res.json({ success: true, message: "Category added", data: category });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await categoryModel.findById(id);

        if (!category) {
            return res.json({ success: false, message: "Category not found" });
        }

        const oldName = category.name;
        const newName = req.body.name ? req.body.name.trim() : category.name;

        if (newName !== oldName) {
            const exists = await categoryModel.findOne({ name: newName });
            if (exists) {
                return res.json({
                    success: false,
                    message: "Category name already exists",
                });
            }
        }

        if (req.file) {
            fs.unlink(`uploads/${category.image}`, () => { });
            category.image = req.file.filename;
        }

        category.name = newName;
        await category.save();

        if (newName !== oldName) {
            await foodModel.updateMany(
                { category: oldName },
                { $set: { category: newName } }
            );
        }

        res.json({ success: true, message: "Category updated", data: category });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

const removeCategory = async (req, res) => {
    try {
        const { id } = req.body;
        const category = await categoryModel.findById(id);

        if (!category) {
            return res.json({ success: false, message: "Category not found" });
        }

        const foodsUsingCategory = await foodModel.countDocuments({
            category: category.name,
        });

        if (foodsUsingCategory > 0) {
            return res.json({
                success: false,
                message: "Cannot delete category while foods still use it",
            });
        }

        fs.unlink(`uploads/${category.image}`, () => { });
        await categoryModel.findByIdAndDelete(id);

        res.json({ success: true, message: "Category removed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

export { listCategories, addCategory, updateCategory, removeCategory };