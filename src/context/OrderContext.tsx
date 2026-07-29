import React, { createContext, useContext, useState, useEffect } from 'react';
import { Order, OrderStatus, PaymentDetails, DeliveryMode } from '../types';
import { MOCK_DRONES, MOCK_GROUND_RIDERS } from '../data/mockData';
import { securityService } from '../services/securityService';
import { deliveryLogisticsService } from '../services/deliveryLogistics';

interface OrderContextType {
  orders: Order[];
  activeOrder: Order | null;
  setActiveOrder: (order: Order | null) => void;
  createOrder: (
    customerId: string,
    customerName: string,
    customerPhone: string,
    restaurantId: string,
    restaurantName: string,
    items: any[],
    subtotal: number,
    discountAmount: number,
    gstTax: number,
    deliveryFee: number,
    droneSurgeFee: number,
    totalAmount: number,
    deliveryMode: DeliveryMode,
    deliveryAddress: string,
    payment: PaymentDetails
  ) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  const createOrder = (
    customerId: string,
    customerName: string,
    customerPhone: string,
    restaurantId: string,
    restaurantName: string,
    items: any[],
    subtotal: number,
    discountAmount: number,
    gstTax: number,
    deliveryFee: number,
    droneSurgeFee: number,
    totalAmount: number,
    deliveryMode: DeliveryMode,
    deliveryAddress: string,
    payment: PaymentDetails
  ): Order => {
    const landingOtp = securityService.generateLandingOtp();
    const modeConfig = deliveryLogisticsService.getModeConfig(deliveryMode);

    // Assign appropriate Ground Rider or Drone
    const assignedRider = deliveryMode !== 'drone_express'
      ? MOCK_GROUND_RIDERS.find((r) => r.mode === deliveryMode) || MOCK_GROUND_RIDERS[2]
      : undefined;

    const assignedDrone = deliveryMode === 'drone_express' ? MOCK_DRONES[0] : undefined;

    const newOrder: Order = {
      id: `ORD-IND-${Date.now().toString().slice(-6)}`,
      customerId,
      customerName,
      customerPhone,
      restaurantId,
      restaurantName,
      items,
      subtotal,
      discountAmount,
      gstTax,
      deliveryFee,
      droneSurgeFee,
      totalAmount,
      deliveryMode,
      deliveryAddress,
      deliveryCoordinates: { lat: 12.9279, lng: 77.6751 },
      landingOtp,
      status: 'placed',
      payment,
      assignedDrone,
      assignedRider,
      createdAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      estimatedArrivalMinutes: modeConfig.etaMinutes
    };

    setOrders((prev) => [newOrder, ...prev]);
    setActiveOrder(newOrder);

    securityService.logAction(
      customerName,
      'customer',
      `Placed Order ${newOrder.id}`,
      '192.168.1.10',
      'medium',
      `Payment via ${payment.method.toUpperCase()} (₹${totalAmount}). Delivery Mode: ${modeConfig.title}. OTP: ${landingOtp}`
    );

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updated = { ...ord, status };
          if (activeOrder?.id === orderId) {
            setActiveOrder(updated);
          }
          return updated;
        }
        return ord;
      })
    );
  };

  // Simulate automated order progression
  useEffect(() => {
    if (!activeOrder || activeOrder.status === 'delivered' || activeOrder.status === 'cancelled') {
      return;
    }

    const timer = setTimeout(() => {
      if (activeOrder.status === 'placed') {
        updateOrderStatus(activeOrder.id, 'kitchen_accepted');
      } else if (activeOrder.status === 'kitchen_accepted') {
        updateOrderStatus(activeOrder.id, 'drone_vectoring');
      } else if (activeOrder.status === 'drone_vectoring') {
        updateOrderStatus(activeOrder.id, 'airborne');
      } else if (activeOrder.status === 'airborne') {
        updateOrderStatus(activeOrder.id, 'hovering_landing');
      }
    }, 7000);

    return () => clearTimeout(timer);
  }, [activeOrder?.status]);

  return (
    <OrderContext.Provider
      value={{
        orders,
        activeOrder,
        setActiveOrder,
        createOrder,
        updateOrderStatus
      }}
    >
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
