import { motion } from 'framer-motion';
import { Clock, Flame, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const deals = [
  {
    id: 1,
    name: 'Gaming Headset Pro X',
    image: 'https://images.unsplash.com/photo-1599669454699-248893623440?w=400&h=300&fit=crop',
    price: 89,
    originalPrice: 179,
    discount: 50,
    endTime: '12:45:30',
    sold: 78,
    total: 100,
  },
  {
    id: 2,
    name: '4K Webcam Ultra HD',
    image: 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=400&h=300&fit=crop',
    price: 59,
    originalPrice: 129,
    discount: 54,
    endTime: '08:22:15',
    sold: 45,
    total: 100,
  },
  {
    id: 3,
    name: 'Mechanical Keyboard RGB',
    image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=400&h=300&fit=crop',
    price: 79,
    originalPrice: 149,
    discount: 47,
    endTime: '06:10:45',
    sold: 92,
    total: 100,
  },
];

const DealsSection = () => {
  return (
    <section id="deals-section" className="py-16 bg-foreground text-background scroll-mt-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
              <Flame className="w-6 h-6 text-accent-foreground" />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold">
                Deals of the Day
              </h2>
              <p className="text-background/70">
                Limited time offers - Don't miss out!
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-background/10 backdrop-blur-sm rounded-full px-6 py-3">
            <Clock className="w-5 h-5 text-accent" />
            <span className="font-mono text-xl font-bold">23:59:59</span>
            <span className="text-sm text-background/70">remaining</span>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {deals.map((deal, index) => (
            <motion.div
              key={deal.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group bg-background/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-background/10 hover:border-accent/50 transition-all duration-300"
            >
              {/* Image */}
              <div className="relative aspect-video overflow-hidden">
                <motion.img
                  src={deal.image}
                  alt={deal.name}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-accent text-accent-foreground font-bold text-sm">
                  -{deal.discount}% OFF
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-semibold text-lg mb-3 group-hover:text-accent transition-colors">
                  {deal.name}
                </h3>

                {/* Price */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl font-bold text-accent">
                    ${deal.price}
                  </span>
                  <span className="text-background/50 line-through">
                    ${deal.originalPrice}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-background/70">Sold: {deal.sold}</span>
                    <span className="text-background/70">Available: {deal.total - deal.sold}</span>
                  </div>
                  <div className="h-2 bg-background/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(deal.sold / deal.total) * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-accent rounded-full"
                    />
                  </div>
                </div>

                {/* Timer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-background/70">
                    <Clock className="w-4 h-4" />
                    <span className="font-mono">{deal.endTime}</span>
                  </div>
                  <Button size="sm" className="btn-accent rounded-full">
                    Grab Deal
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Button variant="outline" size="lg" className="rounded-full border-background/30 text-background hover:bg-background/10">
            View All Deals
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default DealsSection;