import { motion } from 'framer-motion';
import { 
  Smartphone, 
  Laptop, 
  Watch, 
  Headphones, 
  Gamepad2, 
  Home, 
  Camera,
  Cable
} from 'lucide-react';

const categories = [
  { name: 'Smartphones', icon: Smartphone, count: 128, color: 'from-blue-500 to-blue-600' },
  { name: 'Laptops', icon: Laptop, count: 85, color: 'from-purple-500 to-purple-600' },
  { name: 'Smartwatches', icon: Watch, count: 64, color: 'from-emerald-500 to-emerald-600' },
  { name: 'Audio', icon: Headphones, count: 156, color: 'from-orange-500 to-orange-600' },
  { name: 'Gaming', icon: Gamepad2, count: 92, color: 'from-red-500 to-red-600' },
  { name: 'Smart Home', icon: Home, count: 78, color: 'from-cyan-500 to-cyan-600' },
  { name: 'Cameras', icon: Camera, count: 45, color: 'from-pink-500 to-pink-600' },
  { name: 'Accessories', icon: Cable, count: 234, color: 'from-amber-500 to-amber-600' },
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
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Categories = () => {
  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Shop by Category
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our wide range of premium gadgets organized by category
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6"
        >
          {categories.map((category) => (
            <motion.a
              key={category.name}
              href="#"
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="group relative bg-card rounded-2xl p-6 border border-border hover:border-primary/50 transition-all duration-300 overflow-hidden"
            >
              {/* Gradient Background on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-xl bg-secondary group-hover:bg-background/20 flex items-center justify-center mb-4 transition-colors">
                  <category.icon className="w-7 h-7 text-primary group-hover:text-background transition-colors" />
                </div>
                
                <h3 className="font-semibold text-foreground group-hover:text-background transition-colors mb-1">
                  {category.name}
                </h3>
                <p className="text-sm text-muted-foreground group-hover:text-background/70 transition-colors">
                  {category.count} products
                </p>
              </div>

              {/* Arrow Icon */}
              <motion.div
                className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                initial={{ x: -10 }}
                whileHover={{ x: 0 }}
              >
                <div className="w-8 h-8 rounded-full bg-background/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-background" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </motion.div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Categories;