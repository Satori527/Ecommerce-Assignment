import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
	{
		productId: {
			type: Number,
			required: true,
			unique: true,
			min: 0,
			index: true,
		},
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			min: 0,
			required: true,
		},
		image: {
			type: String,
			required: [true, "Image is required"],
		},
		category: {
			type: String,
			required: true,
		},
		rating: {
			rate:{
				type: Number,
				min: 0,
				max: 5,
				default: 0,
			},
			count:{
				type: Number,
				default: 0,
			}
		},
		isFeatured: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
