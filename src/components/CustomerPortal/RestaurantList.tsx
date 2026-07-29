import React, { useState } from 'react';
import { Restaurant, DeliveryMode } from '../../types';
import { MOCK_RESTAURANTS } from '../../data/mockData';
import { DELIVERY_MODE_CONFIGS } from '../../services/deliveryLogistics';
import { useCart } from '../../context/CartContext';
import { Search, Star, Zap, ShieldCheck, Leaf, Compass, Tag, ChevronRight, Copy, Check } from 'lucide-react';

interface RestaurantListProps {
  onSelectRestaurant: (restaurant: Restaurant) => void;
}

export const RestaurantList: React.FC<RestaurantListProps> = ({ onSelectRestaurant }) => {
  const { setToastNotice } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState<string>('All');
  const [pureVegOnly, setPureVegOnly] = useState(false);
  const [previewMode, setPreviewMode] = useState<DeliveryMode>('drone_express');
  const [copiedCoupon, setCopiedCoupon] = useState(false);

  const cuisines = [
    { name: 'All', icon: '✨' },
    { name: 'Biryani', icon: '🍲' },
    { name: 'South Indian', icon: '🥞' },
    { name: 'North Indian', icon: '🥘' },
    { name: 'Pure Veg', icon: '🌱' }
  ];

  const modes: DeliveryMode[] = ['walking', 'cycling', 'bike', 'car', 'drone_express'];

  const filteredRestaurants = MOCK_RESTAURANTS.filter((rest) => {
    const matchesSearch =
      rest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rest.locality.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rest.cuisine.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
      rest.menu.some((m) => m.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCuisine =
      selectedCuisine === 'All' ||
      (selectedCuisine === 'Pure Veg' ? rest.cuisine.includes('Pure Veg') : rest.cuisine.includes(selectedCuisine));

    const matchesPureVeg = !pureVegOnly || rest.cuisine.includes('Pure Veg');

    return matchesSearch && matchesCuisine && matchesPureVeg;
  });

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText('FLYBITE50');
    setCopiedCoupon(true);
    setToastNotice('Promo code FLYBITE50 copied to clipboard!');
    setTimeout(() => setCopiedCoupon(false), 2500);
  };

  const previewCfg = DELIVERY_MODE_CONFIGS[previewMode];

  return (
    <div className="space-y-8">
      
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-orange-950/70 to-slate-950 border border-orange-500/40 p-8 sm:p-10 shadow-2xl glow-orange">
        <div className="absolute right-0 top-0 -mt-16 -mr-16 w-96 h-96 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 -mb-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 grid md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-2 space-y-4">
            <div className="inline-flex items-center space-x-2 bg-orange-500/20 border border-orange-500/40 text-orange-300 text-xs px-3.5 py-1.5 rounded-full font-extrabold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>5 Transport Delivery Modes • DGCA Air Space & Ground Riders</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
              Authentic Indian Food Delivered by <span className="shimmer-text">Riders & Autonomous Drones</span>
            </h1>
            
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              Bypass traffic jams in Bangalore, Mumbai & Delhi. Choose Walking, Cycling, EV Bike, Car, or Drone Air Express from FSSAI certified kitchens.
            </p>

            {/* Interactive 5 Transport Modes Preview Bar */}
            <div className="pt-2 space-y-2">
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">
                Preview Transport Mode Options:
              </span>
              <div className="flex flex-wrap gap-2">
                {modes.map((m) => {
                  const cfg = DELIVERY_MODE_CONFIGS[m];
                  const isSel = previewMode === m;
                  return (
                    <button
                      key={m}
                      onClick={() => setPreviewMode(m)}
                      className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                        isSel
                          ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-orange-400 shadow-md scale-105'
                          : 'bg-slate-900/90 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      <span>{cfg.icon}</span>
                      <span>{cfg.title.split(' ')[0]}</span>
                      <span className="text-[10px] text-amber-300 font-mono">₹{cfg.fee}</span>
                    </button>
                  );
                })}
              </div>

              <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 flex items-center justify-between text-xs text-slate-300 max-w-xl">
                <span>{previewCfg.icon} <strong className="text-white">{previewCfg.title}</strong>: {previewCfg.description}</span>
                <span className="bg-cyan-500/20 text-cyan-400 font-extrabold px-2 py-0.5 rounded text-[10px] shrink-0 ml-2">
                  ~{previewCfg.etaMinutes} MINS
                </span>
              </div>
            </div>
          </div>
          
          {/* Promo Card Feature */}
          <div className="glass-card p-6 rounded-2xl border border-orange-500/40 space-y-4 bg-gradient-to-b from-orange-950/40 to-slate-900/90 shadow-xl glow-orange">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-amber-400 font-extrabold text-xs uppercase tracking-wider">
                <Tag className="w-4 h-4" />
                <span>Welcome Promo</span>
              </div>
              <span className="bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded text-[10px]">
                ₹150 OFF
              </span>
            </div>

            <div>
              <p className="text-3xl font-black text-white">FLYBITE50</p>
              <p className="text-xs text-slate-300">Save ₹150 on your first Air Express or Rider Order (Min ₹300)</p>
            </div>

            <button
              onClick={handleCopyCoupon}
              className="w-full bg-slate-950 hover:bg-slate-900 text-amber-300 font-mono font-black py-2.5 rounded-xl border border-amber-500/40 flex items-center justify-center space-x-2 text-xs transition-all shadow-inner"
            >
              {copiedCoupon ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>COPIED TO CLIPBOARD</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-amber-400" />
                  <span>COPY CODE: FLYBITE50</span>
                </>
              )}
            </button>

            <p className="text-[10px] text-slate-400 text-center">Valid across all verified kitchens in Bangalore & NCR</p>
          </div>
        </div>
      </div>

      {/* Filter Bar & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 glass-panel p-4 rounded-2xl border border-slate-800">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search Biryani, Dosa, Paneer, Restaurant..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 focus:border-orange-500 text-slate-100 text-sm rounded-xl pl-10 pr-4 py-2.5 outline-none transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {cuisines.map((c) => (
            <button
              key={c.name}
              onClick={() => setSelectedCuisine(c.name)}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCuisine === c.name
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30 scale-105'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>{c.icon}</span>
              <span>{c.name}</span>
            </button>
          ))}

          <button
            onClick={() => setPureVegOnly(!pureVegOnly)}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
              pureVegOnly
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-md shadow-emerald-500/20 scale-105'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-emerald-400'
            }`}
          >
            <Leaf className="w-3.5 h-3.5 text-emerald-400" />
            <span>Pure Veg Only</span>
          </button>
        </div>
      </div>

      {/* Restaurant Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRestaurants.map((restaurant) => {
          const isPureVeg = restaurant.cuisine.includes('Pure Veg');
          return (
            <div
              key={restaurant.id}
              onClick={() => onSelectRestaurant(restaurant)}
              className="group glass-card glass-card-hover rounded-2xl overflow-hidden border border-slate-800 hover:border-orange-500/50 transition-all duration-300 cursor-pointer shadow-xl"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                  <div className="bg-slate-950/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700/80 flex items-center space-x-1.5 text-[11px] text-slate-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>FSSAI #{restaurant.fssaiLicense.slice(-6)}</span>
                  </div>
                  {isPureVeg && (
                    <div className="bg-emerald-500/90 text-slate-950 font-black px-2.5 py-0.5 rounded-lg text-[10px] flex items-center space-x-1 shadow-md">
                      <Leaf className="w-3 h-3 fill-slate-950" />
                      <span>100% PURE VEG</span>
                    </div>
                  )}
                </div>

                {restaurant.dronePadAvailable && (
                  <div className="absolute top-3 right-3 bg-cyan-400 text-slate-950 font-black px-2.5 py-1 rounded-lg text-[11px] shadow-lg flex items-center space-x-1">
                    <Zap className="w-3.5 h-3.5 fill-slate-950" />
                    <span>Drone 12 Mins</span>
                  </div>
                )}

                <div className="absolute bottom-3 left-3 flex items-center space-x-1 bg-emerald-500 text-slate-950 font-black text-xs px-2.5 py-1 rounded-lg">
                  <Star className="w-3.5 h-3.5 fill-slate-950" />
                  <span>{restaurant.rating}</span>
                </div>
              </div>

              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors">
                      {restaurant.name}
                    </h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <Compass className="w-3 h-3 text-slate-500" />
                      {restaurant.locality}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {restaurant.cuisine.map((c) => (
                    <span
                      key={c}
                      className="bg-slate-900 text-slate-300 text-[10px] px-2 py-0.5 rounded-md font-semibold border border-slate-800"
                    >
                      {c}
                    </span>
                  ))}
                </div>

                <div className="bg-slate-900/60 p-2 rounded-xl text-[11px] text-slate-400 border border-slate-800/60 flex items-center justify-between">
                  <span className="truncate">Top Dish: <strong className="text-white font-bold">{restaurant.menu[0]?.name}</strong></span>
                  <ChevronRight className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>₹{restaurant.costForTwo} for two</span>
                  <div className="flex items-center space-x-2">
                    <span className="line-through text-slate-500">{restaurant.deliveryTimeMin}m ground</span>
                    <span className="text-cyan-400 font-bold">{restaurant.droneDeliveryTimeMin}m Air Express</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
