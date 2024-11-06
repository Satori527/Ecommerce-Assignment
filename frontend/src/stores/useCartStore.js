import { toast } from "react-hot-toast";
import { create } from "zustand";
import axios from "../lib/axios";

export const useCartStore = create((set, get) => ({
	cart: [],
	cartItems: [],
	totalItems: 0,
	coupon: null,
	total: 0,
	subtotal: 0,
	isCouponApplied: false,

	getMyCoupon: async () => {
		try {
			const response = await axios.get("/coupons");
			set({ coupon: response.data });
		} catch (error) {
			console.error("Error fetching coupon:", error);
		}
	},
	applyCoupon: async (code) => {
		try {
			const response = await axios.post("/coupons/validate", { code });
			set({ coupon: response.data, isCouponApplied: true });
			get().calculateTotals();
			toast.success("Coupon applied successfully");
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to apply coupon");
		}
	},
	removeCoupon: () => {
		set({ coupon: null, isCouponApplied: false });
		get().calculateTotals();
		toast.success("Coupon removed");
	},

	getCartItems: async () => {
		console.log("getCartItems called");
		try {
			const res = await axios.get("/cart");
			console.log("res",res);
			set({ cart: res.data,totalItems:0 });
			res.data.forEach((item) => {
				set((prevState) => ({ totalItems: prevState.totalItems + item.quantity }));
			})
			console.log("totalItems", get().totalItems);
			get().calculateTotals();
		} catch (error) {
			set({ cart: [] });
			toast.error(error.response.data.message || "An error occurred");
		}
	},
	clearCart: async () => {
		set({ cart: [], coupon: null, total: 0, subtotal: 0 });
	},
	addToCart: async (product) => {
		try {
			const res = await axios.post("/cart", { productId: product.id, cartProducts: get().cart });
			console.log("res",res);

			set({ cart: res.data.cartProducts, cartItems: res.data.cartItems });
			set((prevState) => ({ totalItems: prevState.totalItems + 1 }));
			toast.success("Product added to cart");
			console.log("totalItems", get().totalItems);

			// set((prevState) => {
			// 	const existingItem = prevState.cart.find((item) => item._id === product._id);
			// 	const newCart = existingItem
			// 		? prevState.cart.map((item) =>
			// 				item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
			// 		)
			// 		: [...prevState.cart, { ...product, quantity: 1 }];
			// 	return { cart: newCart };
			// });
			get().calculateTotals();
		} catch (error) {
			toast.error(error.response.data.message || "An error occurred");
		}
	},
	removeFromCart: async (productId) => {
		await axios.delete(`/cart`, { data: { productId } });
		set((prevState) => ({ totalItems: prevState.totalItems - prevState.cart.find((item) => item.productId === productId).quantity, cart: prevState.cart.filter((item) => item.productId !== productId) }));
		
		get().calculateTotals();
	},
	updateQuantity: async (productId, quantity, isIncrement) => {
		if (quantity === 0) {
			get().removeFromCart(productId);
			return;
		}

		await axios.put("/cart", { quantity, productId });
		set((prevState) => ({
			cart: prevState.cart.map((item) => (item.productId === productId ? { ...item, quantity } : item)),
		}));

		set((prevState) => ({ totalItems: isIncrement ? prevState.totalItems + 1 : prevState.totalItems - 1 }));
		get().calculateTotals();
	},
	calculateTotals: () => {
		const { cart, coupon } = get();
		const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
		let total = subtotal;

		if (coupon) {
			const discount = subtotal * (coupon.discountPercentage / 100);
			total = subtotal - discount;
		}

		set({ subtotal, total });
	},
}));
