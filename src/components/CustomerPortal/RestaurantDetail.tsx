import React, { useState } from 'react';
import { Restaurant, MenuItem } from '../../types';
import { useCart } from '../../context/CartContext';
import { ArrowLeft, ShieldCheck, Zap, Star, Scale, Plus, Minus, Search, Sparkles } from 'lucide-react';

interface RestaurantDetailProps {
  restaurant: Restaurant;
  onBack: () => void;
  onOpenCart: () => void;
}

export const RestaurantDetail: React.FC<RestaurantDetailProps> = ({ restaurant, onBack, onOpenCart }) => {
  const { addItem, updateQuantity, items, totalItemsCount } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [dishSearch, setDishSearch] = useState<string>('');

  const categories = ['All', ...Array.from(new Set(restaurant.menu.map((i) => i.category)))];

  const getItemQuantity = (itemId: string) => {
    const found = items.find((i) => i.menuItem.id === itemId);
    return found ? found.quantity : 0;
  };

  const filteredMenu = restaurant.menu.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(dishSearch.toLowerCase()) ||
      item.description.toLowerCase().includes(dishSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors text-sm font-semibold bg-slate-900 px-4 py-2 rounded-xl border border-slate-800"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Restaurants</span>
      </button>

      {/* Restaurant Header Banner */}
      <div className="relative overflow-hidden rounded-3xl glass-panel border border-slate-800 p-8 shadow-2xl">
        <div className="grid md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-3">
              <span className="bg-emerald-500 text-slate-950 font-black text-xs px-2.5 py-1 rounded-md flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-slate-950" />
                {restaurant.rating}
              </span>
              <span className="text-xs text-slate-400 font-medium">10,000+ Indian Foodies Served</span>
            </div>

            <h1 className="text-3xl font-extrabold text-white">{restaurant.name}</h1>
            <p className="text-slate-400 text-sm">{restaurant.locality}, {restaurant.city}</p>

            <div className="flex flex-wrap gap-2 pt-2">
              <div className="flex items-center space-x-1.5 bg-slate-900 border border-slate-700/80 px-3 py-1 rounded-lg text-xs text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>FSSAI License: {restaurant.fssaiLicense}</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 rounded-lg text-xs text-cyan-400 font-bold">
                <Zap className="w-4 h-4" />
                <span>Air Express Launchpad Active (Max {restaurant.maxDronePayloadKg} kg)</span>
              </div>
            </div>
          </div>

          <div className="relative h-40 rounded-2xl overflow-hidden border border-slate-700">
            <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* Category Navigation & Search Bar */}
      <div className="sticky top-20 z-20 glass-panel p-3.5 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search menu items..."
            value={dishSearch}
            onChange={(e) => setDishSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-white text-xs rounded-xl pl-9 pr-3 py-2 outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* Menu Catalog */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center justify-between">
          <span>{selectedCategory} Catalog ({filteredMenu.length})</span>
          <span className="text-xs font-normal text-slate-400">Prices inclusive of GST</span>
        </h2>

        {filteredMenu.length === 0 ? (
          <div className="glass-card p-12 text-center rounded-2xl text-slate-400 text-sm">
            No dishes matching "{dishSearch}" in {selectedCategory}.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredMenu.map((item: MenuItem) => {
              const qty = getItemQuantity(item.id);
              return (
                <div
                  key={item.id}
                  className="glass-card p-5 rounded-2xl border border-slate-800 flex justify-between gap-4 hover:border-slate-700 transition-all shadow-md"
                >
                  <div className="space-y-2 flex-1">
                    {/* FSSAI Veg / Non-Veg Marker & Spicy Meter */}
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center p-0.5 ${
                          item.dietary === 'veg'
                            ? 'border-emerald-500'
                            : item.dietary === 'jain'
                            ? 'border-amber-500'
                            : 'border-rose-500'
                        }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${
                            item.dietary === 'veg'
                              ? 'bg-emerald-500'
                              : item.dietary === 'jain'
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                        />
                      </div>
                      {item.bestseller && (
                        <span className="bg-amber-500/20 text-amber-300 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase flex items-center gap-1 border border-amber-500/30">
                          <Sparkles className="w-2.5 h-2.5" /> Bestseller
                        </span>
                      )}
                      {item.spicyLevel && (
                        <span className="text-xs" title={`Spicy Level: ${item.spicyLevel}/3`}>
                          {'🌶️'.repeat(item.spicyLevel)}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-white">{item.name}</h3>
                    <p className="text-sm font-extrabold text-orange-400">₹{item.price}</p>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{item.description}</p>

                    <div className="flex items-center space-x-2 text-[11px] text-slate-500 pt-1">
                      <Scale className="w-3 h-3 text-cyan-400" />
                      <span>Weight: {item.weightGrams}g (Drone Payload Factor)</span>
                    </div>
                  </div>

                  {/* Image & Add Controller */}
                  <div className="flex flex-col items-center space-y-3 shrink-0">
                    <div className="w-24 h-24 rounded-xl overflow-hidden relative border border-slate-700">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>

                    {qty === 0 ? (
                      <button
                        onClick={() => addItem(item, restaurant)}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs py-1.5 px-4 rounded-xl shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center space-x-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>ADD</span>
                      </button>
                    ) : (
                      <div className="flex items-center space-x-2 bg-slate-900 border border-orange-500 rounded-xl p-1 text-white text-xs font-bold shadow-md">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-slate-700 text-orange-400"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-4 text-center">{qty}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-slate-700 text-orange-400"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Bottom Cart Bar */}
      {totalItemsCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 w-full max-w-xl px-4 animate-slide-up">
          <div className="glass-panel border border-orange-500/50 p-4 rounded-2xl shadow-2xl flex items-center justify-between glow-orange backdrop-blur-2xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 font-black text-sm shadow-inner font-mono">
                {totalItemsCount}
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Items in Food Basket</p>
                <p className="text-sm font-extrabold text-white">Review &amp; Air Express Checkout</p>
              </div>
            </div>
            <button
              onClick={onOpenCart}
              className="bg-gradient-to-r from-orange-500 via-amber-500 to-cyan-500 hover:from-orange-600 hover:to-cyan-600 text-white font-extrabold text-xs px-5 py-3 rounded-xl shadow-lg transition-all flex items-center space-x-1.5 group"
            >
              <span>View Cart &amp; Checkout</span>
              <span className="group-hover:translate-x-1 transition-transform text-sm">→</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
