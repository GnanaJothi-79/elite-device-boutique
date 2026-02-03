import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, Truck, CheckCircle, MapPin, Clock, Box } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOrders, Order } from '@/context/OrderContext';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const statusSteps = [
  { key: 'processing', label: 'Processing', icon: Clock, description: 'Order is being processed' },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle, description: 'Order confirmed by seller' },
  { key: 'shipped', label: 'Shipped', icon: Box, description: 'Package has been shipped' },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck, description: 'Package is out for delivery' },
  { key: 'delivered', label: 'Delivered', icon: MapPin, description: 'Package delivered successfully' },
];

const OrderTracking = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { getOrder } = useOrders();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | undefined>(undefined);

  useEffect(() => {
    const found = getOrder(orderId || '');
    setOrder(found);
  }, [orderId, getOrder]);

  // Re-fetch order to get status updates
  useEffect(() => {
    const interval = setInterval(() => {
      const found = getOrder(orderId || '');
      setOrder(found);
    }, 1000);
    return () => clearInterval(interval);
  }, [orderId, getOrder]);

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16 text-center">
          <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Order Not Found</h1>
          <p className="text-muted-foreground mb-4">We couldn't find an order with that ID</p>
          <Button onClick={() => navigate('/orders')} className="btn-accent rounded-xl">
            View All Orders
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const currentStepIndex = statusSteps.findIndex((s) => s.key === order.status);

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
            onClick={() => navigate('/orders')}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Track Order</h1>
            <p className="text-muted-foreground font-mono">{order.id}</p>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Tracking Progress */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-xl font-bold text-foreground mb-6">Delivery Status</h2>
              
              {/* Status Timeline */}
              <div className="relative">
                {statusSteps.map((step, index) => {
                  const isCompleted = index <= currentStepIndex;
                  const isCurrent = index === currentStepIndex;
                  const Icon = step.icon;
                  
                  return (
                    <div key={step.key} className="flex gap-4 pb-8 last:pb-0">
                      {/* Line */}
                      {index < statusSteps.length - 1 && (
                        <div
                          className={`absolute left-5 w-0.5 h-16 mt-10 ${
                            index < currentStepIndex ? 'bg-primary' : 'bg-border'
                          }`}
                          style={{ top: `${index * 96}px` }}
                        />
                      )}
                      
                      {/* Icon */}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isCompleted
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-muted-foreground'
                        } ${isCurrent ? 'ring-4 ring-primary/20' : ''}`}
                      >
                        <Icon className="w-5 h-5" />
                      </motion.div>
                      
                      {/* Content */}
                      <div className="flex-1 pt-1">
                        <h3 className={`font-semibold ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {step.label}
                        </h3>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                        {isCurrent && (
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="inline-block mt-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                          >
                            Current Status
                          </motion.span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 bg-card border border-border rounded-2xl p-6"
            >
              <h2 className="text-xl font-bold text-foreground mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-3 bg-secondary/50 rounded-xl">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                      <p className="text-primary font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Order Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-24 space-y-6">
              {/* Delivery Info */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="text-lg font-bold text-foreground mb-4">Delivery Information</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Shipping To</p>
                    <p className="font-medium text-foreground">{order.shippingAddress.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.shippingAddress.address}, {order.shippingAddress.city} {order.shippingAddress.zip}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Estimated Delivery</p>
                    <p className="font-medium text-foreground">
                      {order.estimatedDelivery.toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Payment Method</p>
                    <p className="font-medium text-foreground">{order.paymentMethod}</p>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="text-lg font-bold text-foreground mb-4">Order Summary</h2>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Order Date</span>
                    <span className="text-foreground">
                      {order.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Items</span>
                    <span className="text-foreground">{order.items.length}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
                    <span>Total</span>
                    <span className="text-primary">${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Button onClick={() => navigate('/products')} variant="outline" className="w-full rounded-xl">
                Continue Shopping
              </Button>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderTracking;
