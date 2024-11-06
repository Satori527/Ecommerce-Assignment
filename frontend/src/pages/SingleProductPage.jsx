import { Star } from 'lucide-react';
//import { motion } from "framer-motion";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useParams } from "react-router-dom";
import { useCartStore } from '../stores/useCartStore';
import { useProductStore } from "../stores/useProductStore";
import { useUserStore } from "../stores/useUserStore";

export default function SingleProductPage() {


    

    const { productId } = useParams();

    const { fetchSingleProduct, singleProduct, loading } = useProductStore();

    const { addToCart } = useCartStore();

    const { user } = useUserStore();

	const handleAddToCart = () => {
		if (!user) {
			toast.error("Please login to add products to cart", { id: "login" });
			return;
		} else {
			// add to cart
			addToCart(singleProduct);
		}
	};

    useEffect(() => {
        fetchSingleProduct(productId);
    }, [fetchSingleProduct, productId]);

    return (
        <div className='max-w-[1200px] min-h-screen w-full flex flex-col items-center justify-start p-12 gap-4 mx-auto'>
            <div className='flex flex-row gap-4 w-full'>
                <div className='w-1/2 flex items-center justify-start'>
                    {!loading ? <img className='rounded-2xl shadow-lg shadow-gray-900' src={singleProduct?.image}></img>: <p className='text-2xl font-medium text-teal-600 text-center'>Loading...</p>}
                </div>
                <div className='w-1/2 flex flex-col gap-4 justify-between p-4 '>
                    <div className='flex flex-col gap-4 w-full justify-start items-start'>
                        <h1 className='text-5xl font-medium'>{singleProduct?.title}</h1>
                        <h2 className='text-2xl flex flex-row gap-2 items-center px-2 font-medium'><Star color='yellow' />{singleProduct?.rating.rate}&nbsp;({singleProduct?.rating.count})</h2>
                        <p className='text-lg text-white bg-teal-600 rounded-lg  text-center px-2 py-1'>{singleProduct?.category}</p>
                        
                    </div>
                    <div className='flex flex-col gap-4 w-full justify-start items-start'>
                        <p className='text-4xl font-bold px-2 text-cyan-400'>${singleProduct?.price}</p>
                        <button className='w-full bg-teal-600 text-white rounded-lg px-2 py-4 hover:bg-teal-700 hover:scale-105' onClick={handleAddToCart}>Add to cart</button>
                    </div>
                    
                
                </div>
                
            </div>
            <div className='flex flex-col gap-4 w-full justify-start items-start p-4 bg-[#0f141e37] rounded-xl'>
                <p className='text-xl font-medium text-left'>Product description: </p>
                <p className='text-lg text-left'> {singleProduct?.description}</p>
            </div>
        </div>
    )
}