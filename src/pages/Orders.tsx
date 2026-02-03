import { motion } from 'framer-motion';
import { ArrowLeft, Package, ChevronRight, Clock, CheckCircle, Truck, Box, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useOrders, Order } from '@/context/OrderContext';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const statusConfig: Record<Order['status'], { label: string; icon: React.ElementType; color: string }> = {
  processing: { label: 'Processing', icon: Clock, color: 'bg-warning text-warning-foreground' },
  confirmed: { label: 'Confirmed', icon: CheckCircle, color: 'bg-primary text-primary-foreground' },
  shipped: { label: 'Shipped', icon: Box, color: 'bg-accent text-accent-foreground' },
  out_for_delivery: { label: 'Out for Delivery', icon: Truck, color: 'bg-success text-success-foreground' },
  delivered: { label: 'Delivered', icon: MapPin, color: 'bg-success text-success-foreground' },
};

const Orders = () => {
  const { orders } = useOrders();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Back Button & Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Orders</h1>
            <p className="text-muted-foreground">{orders.length} orders</p>
          </div>
        </motion.div>

        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
              <Package className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No orders yet</h3>
            <p className="text-muted-foreground mb-4">Start shopping to create your first order</p>
            <Button onClick={() => navigate('/products')} className="btn-accent rounded-xl">
              Browse Products
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => {
              const status = statusConfig[order.status];
              const StatusIcon = status.icon;
              
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => navigate(`/orders/${order.id}`)}
                  className="bg-card border border-border rounded-2xl p-4 cursor-pointer hover:border-primary/30 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-mono text-sm text-muted-foreground">{order.id}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.createdAt.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <Badge className={status.color}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {status.label}
                    </Badge>
                  </div>

                  {/* Order Items Preview */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex -space-x-2">
                      {order.items.slice(0, 3).map((item) => (
                        <img
                          key={item.id}
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-cover border-2 border-background"
                        />
                      ))}
                      {order.items.length > 3 && (
                        <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center border-2 border-background text-xs font-medium">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {order.items.length} item{order.items.length > 1 ? 's' : ''}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">${order.total.toFixed(2)}</span>
                    <div className="flex items-center gap-1 text-primary text-sm font-medium">
                      Track Order
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Orders;
