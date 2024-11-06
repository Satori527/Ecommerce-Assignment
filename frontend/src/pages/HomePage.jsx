import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { MoonLoader } from "react-spinners";
import CategoryItem from "../components/CategoryItem";
import FeaturedProducts from "../components/FeaturedProducts";
import axios from "../lib/axios";

const categories = [
	{ href: "/women's clothing", name: "Women's Clothing", imageUrl: "/wcloth.jpg" },
	{ href: "/men's clothing", name: "Men's Clothing", imageUrl: "/tshirts.jpg" },
	{ href: "/jewelery", name: "Jewelery", imageUrl: "/jewel.webp" },
	{ href: "/electronics", name: "Electronics", imageUrl: "/electronics.jpg" },
	
];

const HomePage = () => {
	//const {  products } = useProductStore();

	// useEffect(() => {
	// 	fetchFeaturedProducts();
	// }, [fetchFeaturedProducts]);

		const [recommendations, setRecommendations] = useState([]);
		const [isLoading, setIsLoading] = useState(true);
	
		useEffect(() => {
			const fetchRecommendations = async () => {
				try {
					const res = await axios.get("/products/recommendations");
					setRecommendations(res.data);
					setIsLoading(false);
				} catch (error) {
					toast.error(error.response.data.message || "An error occurred while fetching recommendations");
				}
			};
	
			fetchRecommendations();
		}, []);
	
		

	return (
		<div className='relative min-h-screen text-white overflow-hidden '>
			
			
			<div className='relative z-10 max-w-7xl mx-auto px-28 sm:px-6 lg:px-28 py-16 '>

				

				<h1 className='text-center text-5xl sm:text-6xl font-bold text-teal-400 mb-4'>
					Explore Our Categories
				</h1>
				<p className='text-center text-2xl text-gray-300 mb-12'>
					Discover Our Range of Products
				</p>

				<div className=' grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-8'>
					{categories.map((category) => (
						<CategoryItem category={category} key={category.name} />
					))}
				</div>

				
			</div>
			<div className='flex-col justify-center items-center py-4 px-2 mx-auto max-w-[1280px]' >
				{isLoading ? <MoonLoader color="#36d7b7" /> : <FeaturedProducts featuredProducts={recommendations} />}
			</div>
		</div>
	);
};
export default HomePage;
