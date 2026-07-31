import express from "express";
import upload from "../middleware/upload.js";
import authMiddleware from "../middleware/auth.js";
import requirePermission from "../middleware/permissions.js";
import { PERMISSIONS } from "../utils/permissions.js";
import {
    listCategories,
    addCategory,
    updateCategory,
    removeCategory,
} from "../controllers/categoryController.js";

const categoryRouter = express.Router();

categoryRouter.get("/list", listCategories);
categoryRouter.post(
    "/add",
    authMiddleware,
    requirePermission(PERMISSIONS.CATEGORIES_MANAGE),
    upload.single("image"),
    addCategory
);
categoryRouter.post(
    "/update/:id",
    authMiddleware,
    requirePermission(PERMISSIONS.CATEGORIES_MANAGE),
    upload.single("image"),
    updateCategory
);
categoryRouter.post(
    "/remove",
    authMiddleware,
    requirePermission(PERMISSIONS.CATEGORIES_MANAGE),
    removeCategory
);

export default categoryRouter;
