import User from "../models/user.model.js";

export const getCartProducts = async (req, res) => {
	console.log("query", req.query);
	try {
		const user = await User.findOne({ _id: req.query.id });
		console.log("user", user);
		//console.log("cart items", cartItems);
		//console.log("cart items", products);
		//add quantity for each product
		// const cartItems = products.map((product) => {
		// 	const item = req.user.cartItems.find((cartItem) => cartItem.id === product.id);
		// 	return { ...product.toJSON(), quantity: item.quantity };
		// });const toa
		let totalItems = 0;
		user.cartItems.forEach((item) => {
			totalItems += item.quantity;
		})

		res.json({
			cartItems: user.cartItems,
			totalItems: totalItems
		});
	} catch (error) {
		console.log("Error in getCartProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const addToCart = async (req, res) => {
	try {
		const { productId } = req.body;
		//console.log("id", id);
		const user = req.user;
		//console.log("user", user);
		//console.log("id", id);
		//console.log("body", req.body);

		const existingItem = user.cartItems.find((item) => item.productId === productId);
		if (existingItem) {
			existingItem.quantity += 1;
		} else {
			user.cartItems.push({productId:productId,quantity:1});
		}

		const updatedUser = await User.updateOne({ _id: user._id }, user);

		console.log("updatedUser", updatedUser);
		res.json(updatedUser.cartItems);
	} catch (error) {
		console.log("Error in addToCart controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const removeAllFromCart = async (req, res) => {
	try {
		const { id } = req.body;
		const user = req.user;
		if (!id) {
			user.cartItems = [];
		} else {
			user.cartItems = user.cartItems.filter((item) => item.id !== id);
		}
		await user.save();
		res.json(user.cartItems);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const updateQuantity = async (req, res) => {
	try {
		const { id: id } = req.params;
		const { quantity } = req.body;
		const user = req.user;
		const existingItem = user.cartItems.find((item) => item.id === id);

		if (existingItem) {
			if (quantity === 0) {
				user.cartItems = user.cartItems.filter((item) => item.id !== id);
				await user.save();
				return res.json(user.cartItems);
			}

			existingItem.quantity = quantity;
			await user.save();
			res.json(user.cartItems);
		} else {
			res.status(404).json({ message: "Product not found" });
		}
	} catch (error) {
		console.log("Error in updateQuantity controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
