import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CreditCard, Truck, Shield, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/context/CartContext';
import { useOrders } from '@/context/OrderContext';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { addOrder } = useOrders();
  const navigate = useNavigate();
  
  const [step, setStep] = useState<'shipping' | 'payment' | 'processing' | 'success'>('shipping');
  const [orderId, setOrderId] = useState<string>('');
  
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    phone: '',
  });
  
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  });

  const shipping = totalPrice > 50 ? 0 : 9.99;
  const tax = totalPrice * 0.08;
  const orderTotal = totalPrice + shipping + tax;

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');
    
    // Simulate payment processing
    setTimeout(() => {
      const newOrderId = addOrder({
        items: [...items],
        total: orderTotal,
        status: 'processing',
        shippingAddress: {
          name: shippingInfo.name,
          address: shippingInfo.address,
          city: shippingInfo.city,
          zip: shippingInfo.zip,
        },
        paymentMethod: `**** **** **** ${paymentInfo.cardNumber.slice(-4)}`,
      });
      setOrderId(newOrderId);
      clearCart();
      setStep('success');
    }, 2500);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  if (items.length === 0 && step !== 'success') {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {step === 'success' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-lg mx-auto text-center py-16"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 10, delay: 0.2 }}
                className="w-24 h-24 mx-auto mb-6 rounded-full bg-success/20 flex items-center justify-center"
              >
                <CheckCircle className="w-12 h-12 text-success" />
              </motion.div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Order Confirmed!</h1>
              <p className="text-muted-foreground mb-4">Thank you for your purchase</p>
              <div className="bg-card border border-border rounded-xl p-4 mb-6">
                <p className="text-sm text-muted-foreground">Order ID</p>
                <p className="text-lg font-mono font-bold text-primary">{orderId}</p>
              </div>
              <div className="space-y-3">
                <Button onClick={() => navigate(`/orders/${orderId}`)} className="w-full btn-accent rounded-xl text-lg py-6">
                  <Truck className="w-5 h-5 mr-2" />
                  Track My Order
                </Button>
                <Button variant="outline" onClick={() => navigate('/products')} className="w-full rounded-xl">
                  Continue Shopping
                </Button>
              </div>
            </motion.div>
          ) : step === 'processing' ? (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-lg mx-auto text-center py-16"
            >
              <Loader2 className="w-16 h-16 mx-auto mb-6 text-primary animate-spin" />
              <h2 className="text-2xl font-bold text-foreground mb-2">Processing Payment...</h2>
              <p className="text-muted-foreground">Please wait while we process your order</p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Back Button & Title */}
              <div className="flex items-center gap-4 mb-8">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => step === 'payment' ? setStep('shipping') : navigate('/cart')}
                  className="rounded-full"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Checkout</h1>
                  <p className="text-muted-foreground">
                    Step {step === 'shipping' ? '1' : '2'} of 2: {step === 'shipping' ? 'Shipping' : 'Payment'}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="flex gap-2 mb-8">
                <div className="flex-1 h-2 rounded-full bg-primary" />
                <div className={`flex-1 h-2 rounded-full ${step === 'payment' ? 'bg-primary' : 'bg-secondary'}`} />
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                {/* Form */}
                <div className="lg:col-span-2">
                  {step === 'shipping' ? (
                    <motion.form
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      onSubmit={handleShippingSubmit}
                      className="bg-card border border-border rounded-2xl p-6 space-y-4"
                    >
                      <h2 className="text-xl font-bold text-foreground mb-4">Shipping Information</h2>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            required
                            value={shippingInfo.name}
                            onChange={(e) => setShippingInfo({ ...shippingInfo, name: e.target.value })}
                            placeholder="John Doe"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            required
                            value={shippingInfo.email}
                            onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                            placeholder="john@example.com"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          required
                          value={shippingInfo.address}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                          placeholder="123 Main Street"
                        />
                      </div>
                      
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2 md:col-span-1">
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            required
                            value={shippingInfo.city}
                            onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                            placeholder="New York"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="zip">ZIP Code</Label>
                          <Input
                            id="zip"
                            required
                            value={shippingInfo.zip}
                            onChange={(e) => setShippingInfo({ ...shippingInfo, zip: e.target.value })}
                            placeholder="10001"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            required
                            value={shippingInfo.phone}
                            onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                            placeholder="+1 234 567 890"
                          />
                        </div>
                      </div>

                      <Button type="submit" className="w-full btn-accent rounded-xl text-lg py-6 mt-6">
                        Continue to Payment
                      </Button>
                    </motion.form>
                  ) : (
                    <motion.form
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      onSubmit={handlePaymentSubmit}
                      className="bg-card border border-border rounded-2xl p-6 space-y-4"
                    >
                      <h2 className="text-xl font-bold text-foreground mb-4">Payment Information</h2>
                      <p className="text-sm text-muted-foreground mb-4 bg-accent/10 p-3 rounded-lg">
                        🔒 This is a demo. Use any dummy card details.
                      </p>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          required
                          value={paymentInfo.cardNumber}
                          onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: formatCardNumber(e.target.value) })}
                          placeholder="4242 4242 4242 4242"
                          maxLength={19}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cardName">Name on Card</Label>
                        <Input
                          id="cardName"
                          required
                          value={paymentInfo.cardName}
                          onChange={(e) => setPaymentInfo({ ...paymentInfo, cardName: e.target.value })}
                          placeholder="John Doe"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input
                            id="expiry"
                            required
                            value={paymentInfo.expiry}
                            onChange={(e) => setPaymentInfo({ ...paymentInfo, expiry: e.target.value })}
                            placeholder="MM/YY"
                            maxLength={5}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            required
                            type="password"
                            value={paymentInfo.cvv}
                            onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value })}
                            placeholder="123"
                            maxLength={4}
                          />
                        </div>
                      </div>

                      <Button type="submit" className="w-full btn-accent rounded-xl text-lg py-6 mt-6">
                        <CreditCard className="w-5 h-5 mr-2" />
                        Pay ${orderTotal.toFixed(2)}
                      </Button>
                    </motion.form>
                  )}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <div className="sticky top-24 bg-card rounded-2xl border border-border p-6 space-y-4">
                    <h2 className="text-xl font-bold text-foreground">Order Summary</h2>
                    
                    <div className="space-y-3 max-h-48 overflow-y-auto">
                      {items.map((item) => (
                        <div key={item.id} className="flex gap-3">
                          <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground line-clamp-1">{item.name}</p>
                            <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                          <p className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-border pt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>${totalPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Shipping</span>
                        <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tax</span>
                        <span>${tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
                        <span>Total</span>
                        <span>${orderTotal.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-4 border-t border-border">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Shield className="w-4 h-4 text-primary" />
                        <span>Secure 256-bit SSL encryption</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Truck className="w-4 h-4 text-primary" />
                        <span>Free returns within 30 days</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
