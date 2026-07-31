import express from "express";
import {
    addFood,
    listFood,
    removeFood,
    searchFoodList,
    getFoodById,
    getInDemandFoods,
    filterFoodList,
} from "../controllers/foodController.js";
import upload from "../middleware/upload.js";
import authMiddleware from "../middleware/auth.js";
import requirePermission from "../middleware/permissions.js";
import { PERMISSIONS } from "../utils/permissions.js";

const foodRouter = express.Router();

foodRouter.post(
    "/add",
    authMiddleware,
    requirePermission(PERMISSIONS.FOODS_MANAGE),
    upload.single("image"),
    addFood
);
foodRouter.get("/list", listFood);
foodRouter.post(
    "/remove",
    authMiddleware,
    requirePermission(PERMISSIONS.FOODS_MANAGE),
    removeFood
);
foodRouter.get("/filter", filterFoodList);
foodRouter.get("/in-demand", getInDemandFoods);
foodRouter.get("/searchfoodlist", searchFoodList);
foodRouter.get("/:id", getFoodById);

export default foodRouter;
