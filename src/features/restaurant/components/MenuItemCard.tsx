import React, { useState } from 'react';
import { Plus, Minus, Flame, Sparkles, Scale } from 'lucide-react';
import { MenuItem, Restaurant } from '../../../types';
import { useCartStore } from '../../../store/useCartStore';
import { ItemCustomizerModal } from './ItemCustomizerModal';

interface MenuItemCardProps {
  item: MenuItem;
  restaurant: Restaurant;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, restaurant }) => {
  const addItem = useCartStore((state) => state.addItem);
  const cartItems = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  // Find all cart items matching this menu item
  const matchingCartItems = cartItems.filter((i) => i.menuItem.id === item.id);
  const totalCartQty = matchingCartItems.reduce((sum, i) => sum + i.quantity, 0);

  const handleAddClick = () => {
    if (item.customizationGroups && item.customizationGroups.length > 0) {
      setIsCustomizerOpen(true);
    } else {
      addItem(item, restaurant, []);
    }
  };

  const handleDecrement = () => {
    if (matchingCartItems.length > 0) {
      // Decrement the last added customization variant of this item
      const target = matchingCartItems[matchingCartItems.length - 1];
      updateQuantity(target.cartItemId, -1);
    }
  };

  return (
    <>
      <div className="bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 rounded-2xl p-4 sm:p-5 flex justify-between items-start transition space-x-4 group shadow-md hover:shadow-xl">
        {/* Left: Details */}
        <div className="flex-1 space-y-2">
          {/* Dietary & Badges */}
          <div className="flex items-center space-x-2">
            <span
              className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center ${
                item.dietary === 'veg'
                  ? 'border-emerald-500 bg-emerald-500/10'
                  : item.dietary === 'jain'
                  ? 'border-purple-500 bg-purple-500/10'
                  : item.dietary === 'vegan'
                  ? 'border-teal-500 bg-teal-500/10'
                  : item.dietary === 'gluten-free'
                  ? 'border-amber-500 bg-amber-500/10'
                  : 'border-rose-500 bg-rose-500/10'
              }`}
              title={item.dietary}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  item.dietary === 'veg'
                    ? 'bg-emerald-500'
                    : item.dietary === 'jain'
                    ? 'bg-purple-500'
                    : item.dietary === 'vegan'
                    ? 'bg-teal-400'
                    : item.dietary === 'gluten-free'
                    ? 'bg-amber-400'
                    : 'bg-rose-500'
                }`}
              />
            </span>

            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {item.dietary}
            </span>

            {item.bestseller && (
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Bestseller
              </span>
            )}

            {item.spicyLevel && (
              <div className="flex items-center text-[10px] text-rose-400 font-bold">
                <Flame className="w-3 h-3 fill-rose-500 text-rose-500 mr-0.5" />
                {'🌶️'.repeat(item.spicyLevel)}
              </div>
            )}
          </div>

          <h4 className="text-base font-bold text-slate-100 group-hover:text-amber-400 transition">
            {item.name}
          </h4>

          <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{item.description}</p>

          <div className="flex items-center space-x-4 pt-1">
            <span className="text-lg font-black text-slate-100">₹{item.price}</span>

            <span className="text-[11px] text-slate-400 flex items-center space-x-1">
              <Scale className="w-3 h-3 text-slate-500" />
              <span>{item.weightGrams}g</span>
            </span>

            {item.customizationGroups && item.customizationGroups.length > 0 && (
              <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                Customizable
              </span>
            )}
          </div>
        </div>

        {/* Right: Image & Add / Quantity Toggle Control */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

          {totalCartQty > 0 ? (
            <div className="absolute bottom-2 left-2 right-2 py-1 bg-amber-500 text-slate-950 rounded-xl font-black text-xs flex items-center justify-between px-2 shadow-lg border border-amber-400">
              <button
                onClick={handleDecrement}
                className="p-1 hover:bg-amber-600 rounded-lg transition"
                title="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5 text-slate-950" />
              </button>
              <span className="text-xs font-black">{totalCartQty}</span>
              <button
                onClick={handleAddClick}
                className="p-1 hover:bg-amber-600 rounded-lg transition"
                title="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5 text-slate-950" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddClick}
              disabled={!item.isAvailable}
              className="absolute bottom-2 left-2 right-2 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 text-slate-950 font-black rounded-xl text-xs transition shadow-lg flex items-center justify-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{item.customizationGroups?.length ? 'CUSTOMIZE' : 'ADD'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Item Customizer Modal */}
      {item.customizationGroups && (
        <ItemCustomizerModal
          isOpen={isCustomizerOpen}
          onClose={() => setIsCustomizerOpen(false)}
          menuItem={item}
          restaurant={restaurant}
        />
      )}
    </>
  );
};
