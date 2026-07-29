import foodModel from "../models/foodModel.js";
import fs from 'fs'

//add food item
const addFood = async (req, res) => {
    let image_filename = `${req.file.filename}`;

    const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: image_filename,
    })
    try {
        await food.save();
        res.json({ success: true, message: "Food Added Successfully !!" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error });
    }
} // GIVES FORMAT TO POST

//all food list
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        res.json({ success: true, data: foods })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error })
    }
}

//remove food item 
const removeFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        fs.unlink(`uploads/${food.image}`, () => { })

        await foodModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Food Removed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error })
    }
}

//search food list 
const searchFoodList = async (req, res) => {
    try {
        const ItemName = req.query.name;

        const result = await foodModel.find({
            $or: [
                { name: { $regex: ItemName, $options: "i" } },
                { description: { $regex: ItemName, $options: "i" } }
            ]
        });

        res.json({ success: true, data: result });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error })
    }
}

const getFoodById = async (req, res) => {
    try {
        const food = await foodModel.findById(req.params.id);

        if (!food) {
            return res.json({ success: false, message: "Food not found" });
        }

        res.json({ success: true, data: food });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

const getInDemandFoods = async (req, res) => {
    try {
        const type = req.query.type === "orders" ? "orders" : "quantity";
        const sortField = type === "orders" ? "totalOrders" : "totalQuantityBought";

        const foods = await foodModel.find({}).sort({ [sortField]: -1 }).limit(3);
        res.json({ success: true, data: foods });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

const filterFoodList = async (req, res) => {
    try {
        const {
            name = "",
            category = "",
            minPrice,
            maxPrice,
            minRating,
            maxRating,
        } = req.query;


        const filter = {};
        if (name) {
            filter.$or = [
                { name: { $regex: name, $options: "i" } },
                { description: { $regex: name, $options: "i" } },
            ];
        }

        if (category && category !== "All") {
            filter.category = category;
        }

        if (minPrice !== undefined || maxPrice !== undefined) {
            filter.price = {};
            if (minPrice !== undefined && minPrice !== "") {
                filter.price.$gte = Number(minPrice);
            }
            if (maxPrice !== undefined && maxPrice !== "") {
                filter.price.$lte = Number(maxPrice);
            }
        }

        if (minRating !== undefined || maxRating !== undefined) {
            filter.averageRating = {};
            if (minRating !== undefined && minRating !== "") {
                filter.averageRating.$gte = Number(minRating);
            }
            if (maxRating !== undefined && maxRating !== "") {
                filter.averageRating.$lte = Number(maxRating);
            }
        }

        const foods = await foodModel.find(filter);
        res.json({ success: true, data: foods });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

export { addFood, listFood, removeFood, searchFoodList, getFoodById, getInDemandFoods, filterFoodList }
