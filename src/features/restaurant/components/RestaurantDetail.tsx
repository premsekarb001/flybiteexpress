import React, { useState } from 'react';
import { ArrowLeft, Search, Star, Clock, Radio, ShieldCheck, ShoppingBag, Filter } from 'lucide-react';
import { Restaurant, DietaryType } from '../../../types';
import { MenuItemCard } from './MenuItemCard';
import { useCartStore, useCartCalculations } from '../../../store/useCartStore';

interface RestaurantDetailProps {
  restaurant: Restaurant;
  onBack: () => void;
  onOpenCart: () => void;
}

export const RestaurantDetail: React.FC<RestaurantDetailProps> = ({
  restaurant,
  onBack,
  onOpenCart
}) => {
  const { totalItemsCount } = useCartCalculations();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [dietaryFilter, setDietaryFilter] = useState<DietaryType | 'all'>('all');

  const categories = ['All', ...Array.from(new Set(restaurant.menu.map((item) => item.category)))];

  const filteredMenu = restaurant.menu.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesDietary = dietaryFilter === 'all' || item.dietary === dietaryFilter;

    return matchesSearch && matchesCategory && matchesDietary;
  });

  return (
    <div className="space-y-6 pb-20 animate-fadeIn">
      {/* Top Nav Action */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-slate-300 hover:text-amber-400 font-bold text-sm bg-slate-900 border border-slate-800 px-4 py-2 rounded-2xl transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Restaurants</span>
        </button>

        {totalItemsCount > 0 && (
          <button
            onClick={onOpenCart}
            className="flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black px-4 py-2 rounded-2xl text-xs shadow-lg transition"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Basket ({totalItemsCount} items)</span>
          </button>
        )}
      </div>

      {/* Restaurant Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
        <div className="h-56 sm:h-64 w-full relative">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        </div>

        <div className="p-6 sm:p-8 -mt-20 relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                {restaurant.dronePadAvailable && (
                  <span className="bg-amber-500 text-slate-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                    <Radio className="w-3 h-3 text-slate-950" />
                    <span>VTOL Air Pad Ready</span>
                  </span>
                )}
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Hygiene {restaurant.hygieneRating}</span>
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-100">{restaurant.name}</h1>
              <p className="text-xs sm:text-sm text-slate-300">
                {restaurant.cuisine.join(' • ')} • {restaurant.locality}, {restaurant.city}
              </p>
            </div>

            <div className="flex items-center space-x-4 bg-slate-950/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 text-amber-400 font-black text-base">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{restaurant.rating.toFixed(1)}</span>
                </div>
                <div className="text-[10px] text-slate-400 font-semibold mt-0.5">500+ Ratings</div>
              </div>
              <div className="h-8 w-px bg-slate-800" />
              <div className="text-center">
                <div className="text-amber-400 font-black text-base">
                  {restaurant.droneDeliveryTimeMin} mins
                </div>
                <div className="text-[10px] text-slate-400 font-semibold mt-0.5">Drone Air Express</div>
              </div>
              <div className="h-8 w-px bg-slate-800" />
              <div className="text-center">
                <div className="text-slate-100 font-black text-base">₹{restaurant.costForTwo}</div>
                <div className="text-[10px] text-slate-400 font-semibold mt-0.5">For Two</div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
            <span>FSSAI License: <span className="font-mono text-slate-300">{restaurant.fssaiLicense}</span></span>
            <span>•</span>
            <span>Max Drone Payload: <span className="font-bold text-amber-400">{restaurant.maxDronePayloadKg} kg</span></span>
          </div>
        </div>
      </div>

      {/* Menu Search & Filter Controls */}
      <div className="sticky top-20 z-30 bg-slate-950/90 backdrop-blur-md p-4 rounded-2xl border border-slate-800/80 space-y-3 shadow-xl">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search dishes in ${restaurant.name}...`}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Dietary Filter Buttons */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
            {(['all', 'veg', 'non-veg', 'jain'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setDietaryFilter(type)}
                className={`px-3 py-2 rounded-xl text-xs font-bold uppercase transition whitespace-nowrap ${
                  dietaryFilter === type
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Category Horizontal Filter Pills */}
        <div className="flex space-x-2 overflow-x-auto pt-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu List */}
      <div className="space-y-4">
        {filteredMenu.length > 0 ? (
          filteredMenu.map((item) => (
            <MenuItemCard key={item.id} item={item} restaurant={restaurant} />
          ))
        ) : (
          <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-3xl p-8 space-y-3">
            <Filter className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-slate-300">No matching dishes found</h3>
            <p className="text-xs text-slate-500">
              Try adjusting your search query or dietary filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setDietaryFilter('all');
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold rounded-xl transition"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
