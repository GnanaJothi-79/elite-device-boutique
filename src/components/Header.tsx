import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  ShoppingCart, 
  Menu, 
  X, 
  ChevronDown,
  Smartphone,
  Laptop,
  Watch,
  Headphones,
  Gamepad2,
  Home,
  Camera,
  Heart
} from 'lucide-react';
import UserMenu from '@/components/UserMenu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/CartContext';

const categories = [
  { name: 'Smartphones', icon: Smartphone },
  { name: 'Laptops', icon: Laptop },
  { name: 'Smartwatches', icon: Watch },
  { name: 'Audio', icon: Headphones },
  { name: 'Gaming', icon: Gamepad2 },
  { name: 'Smart Home', icon: Home },
  { name: 'Cameras', icon: Camera },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { totalItems, setIsCartOpen } = useCart();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/products?category=${encodeURIComponent(categoryName)}`);
    setIsCategoryOpen(false);
    setIsMenuOpen(false);
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      {/* Top Bar */}
      <div className="hidden md:block bg-foreground text-background text-sm py-2">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <span>🚀 Free shipping on orders over $50 | Same day delivery available</span>
          <div className="flex gap-4">
            <button onClick={() => navigate('/orders')} className="hover:text-accent transition-colors">My Orders</button>
            <a href="#" className="hover:text-accent transition-colors">Help & Support</a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-2 cursor-pointer"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            onClick={handleLogoClick}
          >
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">G</span>
            </div>
            <span className="text-xl font-bold text-foreground hidden sm:block">GadgetHub</span>
          </motion.div>

          {/* Category Dropdown */}
          <div className="hidden lg:block relative">
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-foreground hover:bg-secondary"
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            >
              <Menu className="w-5 h-5" />
              <span>Categories</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
            </Button>
            
            <AnimatePresence>
              {isCategoryOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 mt-2 w-64 bg-card rounded-xl shadow-lg border border-border overflow-hidden z-50"
                >
                  {categories.map((category, index) => (
                    <motion.button
                      key={category.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleCategoryClick(category.name)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary transition-colors text-left"
                    >
                      <category.icon className="w-5 h-5 text-primary" />
                      <span className="text-foreground">{category.name}</span>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Search Bar */}
          <motion.div 
            className="flex-1 max-w-2xl hidden md:block"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for gadgets, brands, categories..."
                  className="search-input w-full pr-12"
                />
                <Button 
                  type="submit"
                  size="sm" 
                  className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full btn-primary"
                >
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </motion.div>

          {/* Right Icons */}
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button variant="ghost" size="icon" className="hidden md:flex text-foreground hover:bg-secondary">
              <Heart className="w-5 h-5" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative text-foreground hover:bg-secondary"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-accent text-accent-foreground text-xs">
                  {totalItems}
                </Badge>
              )}
            </Button>

            <UserMenu />

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-foreground"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </motion.div>
        </div>

        {/* Mobile Search */}
        <form onSubmit={handleSearch} className="md:hidden mt-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search gadgets..."
              className="search-input w-full pr-12"
            />
            <Button 
              type="submit"
              size="sm" 
              className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full btn-primary"
            >
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-border bg-card"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="grid grid-cols-2 gap-3">
                {categories.map((category, index) => (
                  <motion.button
                    key={category.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleCategoryClick(category.name)}
                    className="flex items-center gap-2 p-3 rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors text-left"
                  >
                    <category.icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{category.name}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;