import Product from "../models/product.model.js";
import User from "../models/user.model.js";

export const getCartProducts = async (req, res) => {
	//const user = req.user;
	console.log("cartItems", req.user.cartItems);
	let oids = req.user.cartItems.map((item) => item.product);
	console.log("oids", oids);
	try {
		const products = await Product.find({ _id: { $in: oids } });
		console.log("products", products);
		// add quantity for each product
		const cartProducts = products.map((product) => {
			const item = req.user.cartItems.find((cartItem) => cartItem.productId === product.productId);
			return { ...product.toJSON(), quantity: item.quantity };
		});

		res.json(cartProducts);
	} catch (error) {
		console.log("Error in getCartProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const addToCart = async (req, res) => {
	try {
		const { productId } = req.body;
		const {cartProducts} = req.body;
		const user = req.user;
		let product = null;
		console.log("cartItems", user.cartItem);
		const existingItem = user.cartItems.find((item) => item.productId === productId);

		console.log("existingItem", existingItem);
		if (existingItem) {
			existingItem.quantity += 1;
			cartProducts.forEach((item) => {
				if (item.productId === productId) {
					item.quantity += 1;
				}
			})
		} else {
			product = await Product.findOne({ productId: productId});
			console.log("product", product);
			product.quantity = 1;
			console.log("user1", user);
			user.cartItems.push({product: product._id, quantity: 1,productId:productId });
			cartProducts.push({
				...product.toJSON(),
				quantity: 1
			});
		}
		console.log("user", user);
		console.log("cartProducts", cartProducts);
		await User.findByIdAndUpdate(user._id, user);
		res.json({cartItems:user.cartItems,cartProducts:cartProducts});
	} catch (error) {
		console.log("Error in addToCart controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const removeAllFromCart = async (req, res) => {
	try {
		const { productId } = req.body;
		console.log("productId", productId);
		const user = req.user;
		if (!productId) {
			user.cartItems = [];
		} else {
			user.cartItems = user.cartItems.filter((item) => item.productId !== productId);
		}
		await User.findByIdAndUpdate(user._id, user);
		res.json(user.cartItems);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const updateQuantity = async (req, res) => {
	try {
		const { quantity, productId } = req.body;

		console.log("productId", productId);
		
		const user = req.user;
		const existingItem = user.cartItems.find((item) => item.productId === productId);

		console.log("updateQuantity", existingItem);
		if (existingItem) {
			if (quantity === 0) {
				user.cartItems = user.cartItems.filter((item) => item.productId !== productId);
				await User.findByIdAndUpdate(user._id, user);
				return res.json(user.cartItems);
			}

			existingItem.quantity = quantity;
			await User.findByIdAndUpdate(user._id, user);
			res.json(user.cartItems);
		} else {
			res.status(404).json({ message: "Product not found" });
		}
	} catch (error) {
		console.log("Error in updateQuantity controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
