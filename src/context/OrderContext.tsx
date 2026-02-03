import { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem } from './CartContext';

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'processing' | 'confirmed' | 'shipped' | 'out_for_delivery' | 'delivered';
  createdAt: Date;
  estimatedDelivery: Date;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    zip: string;
  };
  paymentMethod: string;
}

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'estimatedDelivery'>) => string;
  getOrder: (id: string) => Order | undefined;
  updateOrderStatus: (id: string, status: Order['status']) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  const addOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'estimatedDelivery'>): string => {
    const id = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const createdAt = new Date();
    const estimatedDelivery = new Date(createdAt.getTime() + 5 * 24 * 60 * 60 * 1000); // 5 days from now

    const newOrder: Order = {
      ...orderData,
      id,
      createdAt,
      estimatedDelivery,
    };

    setOrders((prev) => [newOrder, ...prev]);
    
    // Simulate order status updates
    setTimeout(() => updateOrderStatus(id, 'confirmed'), 3000);
    setTimeout(() => updateOrderStatus(id, 'shipped'), 8000);
    setTimeout(() => updateOrderStatus(id, 'out_for_delivery'), 15000);
    setTimeout(() => updateOrderStatus(id, 'delivered'), 25000);

    return id;
  };

  const getOrder = (id: string) => orders.find((order) => order.id === id);

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, status } : order))
    );
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, getOrder, updateOrderStatus }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
