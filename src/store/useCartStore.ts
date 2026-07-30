import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { MenuItem, Restaurant, DeliveryMode, CartItem, SelectedCustomization } from '../types';
import { DELIVERY_MODE_CONFIGS } from '../services/deliveryLogistics';

interface CartState {
  items: CartItem[];
  currentRestaurant: Restaurant | null;
  deliveryMode: DeliveryMode;
  appliedCoupon: string | null;
  toastNotice: string | null;

  // Actions
  addItem: (
    item: MenuItem,
    restaurant: Restaurant,
    customizations?: SelectedCustomization[],
    specialInstructions?: string
  ) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  setDeliveryMode: (mode: DeliveryMode) => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  setToastNotice: (msg: string | null) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      currentRestaurant: null,
      deliveryMode: 'drone_express',
      appliedCoupon: null,
      toastNotice: null,

      addItem: (item, restaurant, customizations = [], specialInstructions = '') => {
        const { currentRestaurant, items } = get();

        // Check if cart has items from another restaurant
        if (currentRestaurant && currentRestaurant.id !== restaurant.id && items.length > 0) {
          const confirmSwitch = window.confirm(
            `Your basket contains items from ${currentRestaurant.name}. Discard existing cart and start a new order from ${restaurant.name}?`
          );
          if (!confirmSwitch) return;

          // Clear previous cart for new restaurant
          const customPriceSum = customizations.reduce((acc, c) => acc + c.price, 0);
          const unitPrice = item.price + customPriceSum;
          const cartItemId = `${item.id}-${customizations.map((c) => c.optionId).sort().join('_')}`;

          const newItem: CartItem = {
            cartItemId,
            menuItem: item,
            quantity: 1,
            restaurantId: restaurant.id,
            selectedCustomizations: customizations,
            specialInstructions,
            unitPrice,
            totalPrice: unitPrice
          };

          set({
            items: [newItem],
            currentRestaurant: restaurant,
            toastNotice: `Started new basket at ${restaurant.name}`
          });
          return;
        }

        const customPriceSum = customizations.reduce((acc, c) => acc + c.price, 0);
        const unitPrice = item.price + customPriceSum;
        const customString = customizations.map((c) => c.optionId).sort().join('_');
        const cartItemId = `${item.id}-${customString}`;

        const existingIndex = items.findIndex((i) => i.cartItemId === cartItemId);

        if (existingIndex > -1) {
          const updatedItems = [...items];
          const existing = updatedItems[existingIndex];
          const newQty = existing.quantity + 1;
          updatedItems[existingIndex] = {
            ...existing,
            quantity: newQty,
            totalPrice: existing.unitPrice * newQty
          };
          set({
            items: updatedItems,
            currentRestaurant: restaurant,
            toastNotice: `Added another ${item.name} to basket`
          });
        } else {
          const newItem: CartItem = {
            cartItemId,
            menuItem: item,
            quantity: 1,
            restaurantId: restaurant.id,
            selectedCustomizations: customizations,
            specialInstructions,
            unitPrice,
            totalPrice: unitPrice
          };
          set({
            items: [...items, newItem],
            currentRestaurant: restaurant,
            toastNotice: `Added ${item.name} to basket`
          });
        }
      },

      removeItem: (cartItemId) => {
        const { items } = get();
        const updatedItems = items.filter((i) => i.cartItemId !== cartItemId);
        set({
          items: updatedItems,
          currentRestaurant: updatedItems.length > 0 ? get().currentRestaurant : null
        });
      },

      updateQuantity: (cartItemId, delta) => {
        const { items } = get();
        const updatedItems = items
          .map((item) => {
            if (item.cartItemId === cartItemId) {
              const newQty = item.quantity + delta;
              if (newQty <= 0) return null;
              return {
                ...item,
                quantity: newQty,
                totalPrice: item.unitPrice * newQty
              };
            }
            return item;
          })
          .filter(Boolean) as CartItem[];

        set({
          items: updatedItems,
          currentRestaurant: updatedItems.length > 0 ? get().currentRestaurant : null
        });
      },

      clearCart: () => {
        set({
          items: [],
          currentRestaurant: null,
          appliedCoupon: null
        });
      },

      setDeliveryMode: (mode) => {
        set({ deliveryMode: mode });
      },

      applyCoupon: (code) => {
        const cleanCode = code.trim().toUpperCase();
        const items = get().items;
        const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);

        if (cleanCode === 'FLYBITE50') {
          if (subtotal < 300) {
            return { success: false, message: 'Coupon FLYBITE50 requires a minimum subtotal of ₹300.' };
          }
          set({ appliedCoupon: 'FLYBITE50' });
          return { success: true, message: 'Coupon FLYBITE50 applied! ₹150 OFF.' };
        }

        if (cleanCode === 'FIRSTDRONE') {
          set({ appliedCoupon: 'FIRSTDRONE' });
          return { success: true, message: 'Coupon FIRSTDRONE applied! Drone Air Express surge fee waived.' };
        }

        if (cleanCode === 'AIRSPEED') {
          set({ appliedCoupon: 'AIRSPEED' });
          return { success: true, message: 'Coupon AIRSPEED applied! 10% instant discount.' };
        }

        return { success: false, message: 'Invalid promo code. Try FLYBITE50, FIRSTDRONE, or AIRSPEED.' };
      },

      removeCoupon: () => {
        set({ appliedCoupon: null });
      },

      setToastNotice: (msg) => {
        set({ toastNotice: msg });
      }
    }),
    {
      name: 'flybite_cart_store_v3',
      storage: createJSONStorage(() => localStorage)
    }
  )
);

// Helper functions for billing calculations
export const useCartCalculations = () => {
  const items = useCartStore((state) => state.items);
  const deliveryMode = useCartStore((state) => state.deliveryMode);
  const appliedCoupon = useCartStore((state) => state.appliedCoupon);

  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);

  let discountAmount = 0;
  if (appliedCoupon === 'FLYBITE50' && subtotal >= 300) {
    discountAmount = 150;
  } else if (appliedCoupon === 'FIRSTDRONE' && deliveryMode === 'drone_express') {
    discountAmount = 49;
  } else if (appliedCoupon === 'AIRSPEED') {
    discountAmount = Math.round(subtotal * 0.1);
  }

  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  const gstTax = Math.round(discountedSubtotal * 0.05);

  const modeConfig = DELIVERY_MODE_CONFIGS[deliveryMode];
  const deliveryFee = subtotal > 0 ? modeConfig.fee : 0;
  const droneSurgeFee = subtotal > 0 && deliveryMode === 'drone_express' && appliedCoupon !== 'FIRSTDRONE' ? 49 : 0;

  const totalAmount = Math.max(0, discountedSubtotal + gstTax + deliveryFee + droneSurgeFee);
  const totalWeightGrams = items.reduce((sum, item) => sum + item.menuItem.weightGrams * item.quantity, 0);
  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    subtotal,
    discountAmount,
    discountedSubtotal,
    gstTax,
    deliveryFee,
    droneSurgeFee,
    totalAmount,
    totalWeightGrams,
    totalItemsCount
  };
};
