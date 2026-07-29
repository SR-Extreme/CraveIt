import express from "express"
import { addFood, listFood, removeFood, searchFoodList, getFoodById, getInDemandFoods, filterFoodList } from "../controllers/foodController.js"
import multer from "multer"
import authMiddleware from "../middleware/auth.js";
import requirePermission from "../middleware/permissions.js";
import { PERMISSIONS } from "../utils/permissions.js";

const foodRouter = express.Router();

//Image Storage Engine
const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}${file.originalname}`)
    }
})

const upload = multer({ storage: storage })

foodRouter.post("/add", authMiddleware, requirePermission(PERMISSIONS.FOODS_MANAGE), upload.single("image"), addFood); // This posts data to mongoDB
foodRouter.get("/list", listFood);
foodRouter.post("/remove", authMiddleware, requirePermission(PERMISSIONS.FOODS_MANAGE), removeFood);
foodRouter.get("/filter", filterFoodList);
foodRouter.get("/in-demand", getInDemandFoods);
foodRouter.get("/searchfoodlist", searchFoodList);
foodRouter.get("/:id", getFoodById);

export default foodRouter;