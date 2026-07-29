import React, { createContext, useContext, useState, useEffect } from 'react';
import { MenuItem, Restaurant, DeliveryMode } from '../types';
import { DELIVERY_MODE_CONFIGS } from '../services/deliveryLogistics';

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  restaurantId: string;
}

interface CartContextType {
  items: CartItem[];
  currentRestaurant: Restaurant | null;
  deliveryMode: DeliveryMode;
  setDeliveryMode: (mode: DeliveryMode) => void;
  addItem: (item: MenuItem, restaurant: Restaurant) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  appliedCoupon: string | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  subtotal: number;
  discountAmount: number;
  gstTax: number;
  deliveryFee: number;
  droneSurgeFee: number;
  totalAmount: number;
  totalWeightGrams: number;
  totalItemsCount: number;
  toastNotice: string | null;
  setToastNotice: (msg: string | null) => void;
}

const CART_STORAGE_KEY = 'flybite_cart_v2';
const RESTAURANT_STORAGE_KEY = 'flybite_restaurant_v2';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currentRestaurant, setCurrentRestaurant] = useState<Restaurant | null>(() => {
    try {
      const saved = localStorage.getItem(RESTAURANT_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>('drone_express');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      if (currentRestaurant) {
        localStorage.setItem(RESTAURANT_STORAGE_KEY, JSON.stringify(currentRestaurant));
      } else {
        localStorage.removeItem(RESTAURANT_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to sync cart to localStorage', e);
    }
  }, [items, currentRestaurant]);

  const addItem = (item: MenuItem, restaurant: Restaurant) => {
    if (currentRestaurant && currentRestaurant.id !== restaurant.id) {
      if (!window.confirm(`Your basket contains items from ${currentRestaurant.name}. Discard and start a new order from ${restaurant.name}?`)) {
        return;
      }
      setItems([{ menuItem: item, quantity: 1, restaurantId: restaurant.id }]);
      setCurrentRestaurant(restaurant);
      setToastNotice(`Started new basket at ${restaurant.name}`);
      return;
    }

    setCurrentRestaurant(restaurant);
    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.menuItem.id === item.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      }
      return [...prev, { menuItem: item, quantity: 1, restaurantId: restaurant.id }];
    });
    setToastNotice(`Added ${item.name} to basket`);
  };

  const removeItem = (itemId: string) => {
    setItems((prev) => {
      const next = prev.filter((i) => i.menuItem.id !== itemId);
      if (next.length === 0) {
        setCurrentRestaurant(null);
      }
      return next;
    });
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setItems((prev) => {
      return prev
        .map((i) => {
          if (i.menuItem.id === itemId) {
            const nextQty = i.quantity + delta;
            return nextQty > 0 ? { ...i, quantity: nextQty } : null;
          }
          return i;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const clearCart = () => {
    setItems([]);
    setCurrentRestaurant(null);
    localStorage.removeItem(CART_STORAGE_KEY);
    localStorage.removeItem(RESTAURANT_STORAGE_KEY);
  };

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'FLYBITE50') {
      if (subtotal < 300) {
        return { success: false, message: 'Coupon FLYBITE50 requires a minimum item subtotal of ₹300.' };
      }
      setAppliedCoupon('FLYBITE50');
      return { success: true, message: 'Coupon FLYBITE50 applied! ₹150 OFF.' };
    }
    if (cleanCode === 'FIRSTDRONE') {
      setAppliedCoupon('FIRSTDRONE');
      return { success: true, message: 'Coupon FIRSTDRONE applied! Drone Air Express surge waived.' };
    }
    return { success: false, message: 'Invalid promo code. Try FLYBITE50 or FIRSTDRONE.' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const subtotal = items.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);

  let discountAmount = 0;
  if (appliedCoupon === 'FLYBITE50' && subtotal >= 300) {
    discountAmount = 150;
  } else if (appliedCoupon === 'FIRSTDRONE' && deliveryMode === 'drone_express') {
    discountAmount = 49;
  }

  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  const gstTax = Math.round(discountedSubtotal * 0.05);

  const modeConfig = DELIVERY_MODE_CONFIGS[deliveryMode];
  const deliveryFee = subtotal > 0 ? modeConfig.fee : 0;
  const droneSurgeFee = subtotal > 0 && deliveryMode === 'drone_express' ? 49 : 0;
  const totalAmount = Math.max(0, discountedSubtotal + gstTax + deliveryFee + droneSurgeFee);

  const totalWeightGrams = items.reduce((sum, item) => sum + item.menuItem.weightGrams * item.quantity, 0);
  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        currentRestaurant,
        deliveryMode,
        setDeliveryMode,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        subtotal,
        discountAmount,
        gstTax,
        deliveryFee,
        droneSurgeFee,
        totalAmount,
        totalWeightGrams,
        totalItemsCount,
        toastNotice,
        setToastNotice
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
