import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, Radio, Bike, Car, Footprints, ArrowRight, AlertCircle } from 'lucide-react';
import { useCartStore, useCartCalculations } from '../../../store/useCartStore';
import { CartSummary } from './CartSummary';
import { DELIVERY_MODE_CONFIGS } from '../../../services/deliveryLogistics';
import { DeliveryMode } from '../../../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToPayment: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onProceedToPayment
}) => {
  const {
    items,
    currentRestaurant,
    updateQuantity,
    removeItem,
    clearCart,
    deliveryMode,
    setDeliveryMode
  } = useCartStore();

  const { totalItemsCount, totalWeightGrams, totalAmount } = useCartCalculations();

  if (!isOpen) return null;

  const deliveryModesList: { mode: DeliveryMode; label: string; icon: any }[] = [
    { mode: 'drone_express', label: 'Drone Air (12m)', icon: Radio },
    { mode: 'bike', label: 'EV Bike (30m)', icon: Bike },
    { mode: 'walking', label: 'Eco Foot (20m)', icon: Footprints },
    { mode: 'car', label: 'Sedan (35m)', icon: Car }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="absolute inset-0 overflow-hidden">
        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
          <div className="pointer-events-auto w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between">
            {/* Drawer Header */}
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/30">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-100">Your Express Basket</h3>
                  <p className="text-xs text-slate-400">
                    {currentRestaurant ? currentRestaurant.name : 'Empty Basket'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {items.length > 0 ? (
                <>
                  {/* Delivery Mode Selector */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Select Mode of Transport
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {deliveryModesList.map((m) => {
                        const Icon = m.icon;
                        const isSelected = deliveryMode === m.mode;
                        return (
                          <button
                            key={m.mode}
                            onClick={() => setDeliveryMode(m.mode)}
                            className={`p-3 rounded-2xl border text-left flex items-center space-x-2.5 transition ${
                              isSelected
                                ? 'bg-amber-500/20 border-amber-500 text-amber-400 font-bold shadow-md'
                                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/40'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            <span className="text-xs">{m.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Item List */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <span>Order Items ({totalItemsCount})</span>
                      <button
                        onClick={clearCart}
                        className="text-rose-400 hover:text-rose-300 transition text-[11px] flex items-center space-x-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Clear All</span>
                      </button>
                    </div>

                    <div className="space-y-3">
                      {items.map((item) => (
                        <div
                          key={item.cartItemId}
                          className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3.5 space-y-2"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-xs font-bold text-slate-100">
                                {item.menuItem.name}
                              </h4>
                              {item.selectedCustomizations.length > 0 && (
                                <div className="text-[10px] text-amber-400 mt-0.5 space-y-0.5">
                                  {item.selectedCustomizations.map((c) => (
                                    <div key={c.optionId}>
                                      • {c.optionName} {c.price > 0 && `(+₹${c.price})`}
                                    </div>
                                  ))}
                                </div>
                              )}
                              {item.specialInstructions && (
                                <div className="text-[10px] text-slate-400 italic mt-0.5">
                                  Note: "{item.specialInstructions}"
                                </div>
                              )}
                            </div>
                            <span className="text-xs font-black text-amber-400">
                              ₹{item.totalPrice}
                            </span>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                            <span className="text-[11px] text-slate-400">
                              ₹{item.unitPrice} each
                            </span>

                            <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-xl px-2 py-1">
                              <button
                                onClick={() => updateQuantity(item.cartItemId, -1)}
                                className="text-slate-400 hover:text-white p-0.5"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="text-xs font-bold text-slate-100 px-1">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.cartItemId, 1)}
                                className="text-slate-400 hover:text-white p-0.5"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Fee Summary */}
                  <CartSummary />
                </>
              ) : (
                /* Empty Cart State */
                <div className="text-center py-16 space-y-4">
                  <div className="w-20 h-20 bg-slate-950 rounded-full flex items-center justify-center mx-auto border border-slate-800 text-slate-600">
                    <ShoppingBag className="w-10 h-10" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-200">Your basket is empty</h3>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    Explore delicious food from top restaurants and add items to your cart.
                  </p>
                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg hover:bg-amber-600 transition"
                  >
                    Browse Restaurants
                  </button>
                </div>
              )}
            </div>

            {/* Footer Action */}
            {items.length > 0 && (
              <div className="p-4 bg-slate-950 border-t border-slate-800">
                <button
                  onClick={onProceedToPayment}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black rounded-2xl text-sm transition shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-2"
                >
                  <span>Proceed to Checkout (₹{totalAmount})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
