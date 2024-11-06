import express from "express";
import {
	getFeaturedProducts,
	getProductsByCategory,
	getRecommendedProducts
} from "../controllers/product.controller.js";

const router = express.Router();

router.get("/featured", getFeaturedProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/recommendations", getRecommendedProducts);




export default router;
