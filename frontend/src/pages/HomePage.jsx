import { useEffect } from "react";
import CategoryItem from "../components/CategoryItem";
import FeaturedProducts from "../components/FeaturedProducts";
import { useProductStore } from "../stores/useProductStore";

const categories = [
	{ href: "/women's clothing", name: "Women's Clothing", imageUrl: "/jeans.jpg" },
	{ href: "/men's clothing", name: "Men's Clothing", imageUrl: "/tshirts.jpg" },
	{ href: "/jewelery", name: "Jewelery", imageUrl: "/shoes.jpg" },
	{ href: "/electronics", name: "Electronics", imageUrl: "/glasses.png" },
	
];

const HomePage = () => {
	const { fetchFeaturedProducts, products, isLoading } = useProductStore();

	useEffect(() => {
		fetchFeaturedProducts();
	}, [fetchFeaturedProducts]);

	return (
		<div className='relative min-h-screen text-white overflow-hidden'>
			<div className='relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-4 py-16'>
				{!isLoading && products.length > 0 && <FeaturedProducts featuredProducts={products} />}
				<h1 className='text-center text-5xl sm:text-6xl font-bold text-teal-400 mb-4'>
					Explore Our Categories
				</h1>
				<p className='text-center text-xl text-gray-300 mb-12'>
					Discover the latest trends in eco-friendly fashion
				</p>
				

				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 p-20'>
					{categories.map((category) => (
						<CategoryItem category={category} key={category.name} />
					))}
				</div>

				
			</div>
		</div>
	);
};
export default HomePage;
