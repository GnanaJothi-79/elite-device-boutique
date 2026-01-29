import { motion } from 'framer-motion';
import ProductCard from './ProductCard';

const products = [
  {
    id: 1,
    name: 'iPhone 15 Pro Max 256GB - Natural Titanium',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=400&fit=crop',
    price: 1099,
    originalPrice: 1299,
    rating: 4.9,
    reviews: 2847,
    badge: 'bestseller' as const,
    discount: 15,
  },
  {
    id: 2,
    name: 'MacBook Pro 14" M3 Pro Chip - Space Gray',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop',
    price: 1799,
    originalPrice: 1999,
    rating: 4.8,
    reviews: 1523,
    badge: 'deal' as const,
    discount: 10,
  },
  {
    id: 3,
    name: 'Apple Watch Series 9 GPS 45mm - Midnight',
    image: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=400&h=400&fit=crop',
    price: 399,
    originalPrice: 449,
    rating: 4.7,
    reviews: 892,
    discount: 11,
  },
  {
    id: 4,
    name: 'Sony WH-1000XM5 Wireless Noise Canceling',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    price: 298,
    originalPrice: 399,
    rating: 4.8,
    reviews: 3421,
    badge: 'deal' as const,
    discount: 25,
  },
  {
    id: 5,
    name: 'PlayStation 5 Slim Digital Edition Console',
    image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop',
    price: 449,
    rating: 4.9,
    reviews: 5623,
    badge: 'new' as const,
  },
  {
    id: 6,
    name: 'Samsung Galaxy S24 Ultra 512GB - Titanium',
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop',
    price: 1199,
    originalPrice: 1399,
    rating: 4.7,
    reviews: 1876,
    discount: 14,
  },
  {
    id: 7,
    name: 'DJI Mini 4 Pro Fly More Combo Drone',
    image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=400&fit=crop',
    price: 1099,
    originalPrice: 1299,
    rating: 4.6,
    reviews: 654,
    badge: 'new' as const,
    discount: 15,
  },
  {
    id: 8,
    name: 'Apple AirPods Pro 2nd Gen USB-C',
    image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&h=400&fit=crop',
    price: 199,
    originalPrice: 249,
    rating: 4.8,
    reviews: 8734,
    badge: 'bestseller' as const,
    discount: 20,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const FeaturedProducts = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Featured Products
            </h2>
            <p className="text-muted-foreground">
              Handpicked premium gadgets with amazing deals
            </p>
          </div>
          <a 
            href="#" 
            className="text-primary hover:text-primary/80 font-medium flex items-center gap-2 group"
          >
            View All Products
            <svg 
              className="w-4 h-4 group-hover:translate-x-1 transition-transform" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {products.map((product) => (
            <motion.div key={product.id} variants={itemVariants}>
              <ProductCard {...product} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProducts;