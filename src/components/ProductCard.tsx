import { motion } from 'framer-motion';
import { Star, Heart, ShoppingCart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  id: number;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  badge?: 'deal' | 'new' | 'bestseller';
  discount?: number;
}

const ProductCard = ({ 
  name, 
  image, 
  price, 
  originalPrice, 
  rating, 
  reviews, 
  badge,
  discount 
}: ProductCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group relative bg-card rounded-2xl border border-border overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-primary/30"
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {badge === 'deal' && (
          <Badge className="bg-destructive text-destructive-foreground">
            Hot Deal
          </Badge>
        )}
        {badge === 'new' && (
          <Badge className="bg-success text-success-foreground">
            New
          </Badge>
        )}
        {badge === 'bestseller' && (
          <Badge className="bg-primary text-primary-foreground">
            Bestseller
          </Badge>
        )}
        {discount && (
          <Badge className="bg-accent text-accent-foreground">
            -{discount}%
          </Badge>
        )}
      </div>

      {/* Wishlist Button */}
      <button className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground">
        <Heart className="w-4 h-4" />
      </button>

      {/* Quick View Button */}
      <button className="absolute top-14 right-3 z-10 w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary hover:text-primary-foreground">
        <Eye className="w-4 h-4" />
      </button>

      {/* Image */}
      <div className="relative aspect-square bg-secondary/50 overflow-hidden">
        <motion.img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-warning text-warning' : 'text-muted'}`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground ml-1">
            ({reviews})
          </span>
        </div>

        {/* Name */}
        <h3 className="font-medium text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {name}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl font-bold text-foreground">
            ${price.toFixed(2)}
          </span>
          {originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button className="w-full btn-accent rounded-xl group/btn">
          <ShoppingCart className="w-4 h-4 mr-2 group-hover/btn:animate-bounce-subtle" />
          Add to Cart
        </Button>
      </div>
    </motion.div>
  );
};

export default ProductCard;