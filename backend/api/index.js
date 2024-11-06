import cookieParser from "cookie-parser";
//import dotenv from "dotenv";
import express from "express";
import path from "path";

import analyticsRoutes from "../routes/analytics.route.js";
import authRoutes from "../routes/auth.route.js";
import cartRoutes from "../routes/cart.route.js";
import couponRoutes from "../routes/coupon.route.js";
import paymentRoutes from "../routes/payment.route.js";
import productRoutes from "../routes/product.route.js";

import { connectDB } from "../lib/db.js";

// dotenv.config(
// 	{
// 		path: '../.env',
// 	}
// );

const app = express();
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

app.use(express.json({ limit: "10mb" })); // allows you to parse the body of the request
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

app.listen(PORT, () => {
	console.log("api Server is running on http://localhost:" + PORT);
	connectDB();
});

app.get('/', function(req, res, next) {
    res.send("Hello world");
});