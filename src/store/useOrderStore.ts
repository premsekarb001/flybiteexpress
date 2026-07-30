import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Order, OrderStatus, CartItem, DeliveryMode, PaymentDetails } from '../types';
import { MOCK_DRONES, MOCK_GROUND_RIDERS } from '../data/mockData';

interface OrderState {
  orders: Order[];
  activeOrderId: string | null;

  placeOrder: (
    customerId: string,
    customerName: string,
    customerPhone: string,
    restaurantId: string,
    restaurantName: string,
    items: CartItem[],
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
  setActiveOrder: (orderId: string | null) => void;
  getActiveOrder: () => Order | undefined;
  cancelOrder: (orderId: string) => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      activeOrderId: null,

      placeOrder: (
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
        payment
      ) => {
        const orderId = `ORD-FB-${Math.floor(100000 + Math.random() * 900000)}`;
        const landingOtp = String(Math.floor(1000 + Math.random() * 9000));
        const estimatedArrivalMinutes = deliveryMode === 'drone_express' ? 12 : 25;

        const assignedDrone = deliveryMode === 'drone_express' ? MOCK_DRONES[0] : undefined;
        const assignedRider = deliveryMode !== 'drone_express'
          ? MOCK_GROUND_RIDERS.find((r) => r.mode === deliveryMode) || MOCK_GROUND_RIDERS[0]
          : undefined;

        const newOrder: Order = {
          id: orderId,
          customerId,
          customerName,
          customerPhone,
          restaurantId,
          restaurantName,
          items: [...items],
          subtotal,
          discountAmount,
          gstTax,
          deliveryFee,
          droneSurgeFee,
          totalAmount,
          deliveryMode,
          deliveryAddress,
          landingOtp,
          status: 'placed',
          payment,
          assignedDrone,
          assignedRider,
          createdAt: new Date().toISOString(),
          estimatedArrivalMinutes
        };

        set((state) => ({
          orders: [newOrder, ...state.orders],
          activeOrderId: orderId
        }));

        return newOrder;
      },

      updateOrderStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map((ord) => (ord.id === orderId ? { ...ord, status } : ord))
        }));
      },

      setActiveOrder: (orderId) => {
        set({ activeOrderId: orderId });
      },

      getActiveOrder: () => {
        const { orders, activeOrderId } = get();
        if (!activeOrderId) return orders[0];
        return orders.find((o) => o.id === activeOrderId) || orders[0];
      },

      cancelOrder: (orderId) => {
        set((state) => ({
          orders: state.orders.map((ord) => (ord.id === orderId ? { ...ord, status: 'cancelled' } : ord))
        }));
      }
    }),
    {
      name: 'flybite_orders_store_v3',
      storage: createJSONStorage(() => localStorage)
    }
  )
);
