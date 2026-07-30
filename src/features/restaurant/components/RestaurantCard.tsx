import React from 'react';
import { Star, Clock, Radio, ShieldCheck, Zap } from 'lucide-react';
import { Restaurant } from '../../../types';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onSelect: (restaurant: Restaurant) => void;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(restaurant)}
      className="group bg-slate-900/60 border border-slate-800/90 hover:border-amber-500/50 rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-500/10 flex flex-col justify-between"
    >
      {/* Cover Image */}
      <div className="relative h-48 w-full bg-slate-950 overflow-hidden">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {restaurant.dronePadAvailable && (
            <span className="bg-amber-500 text-slate-950 text-[10px] font-black uppercase px-2.5 py-1 rounded-full flex items-center space-x-1 shadow-md">
              <Radio className="w-3 h-3 text-slate-950 animate-pulse" />
              <span>VTOL Air Pad</span>
            </span>
          )}
          <span className="bg-slate-950/80 backdrop-blur-md text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center space-x-1">
            <ShieldCheck className="w-3 h-3" />
            <span>Hygiene {restaurant.hygieneRating}</span>
          </span>
        </div>

        {/* Rating Pill */}
        <div className="absolute top-3 right-3 bg-slate-950/90 backdrop-blur-md border border-slate-800 text-slate-100 px-2.5 py-1 rounded-full text-xs font-black flex items-center space-x-1 shadow-lg">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{restaurant.rating.toFixed(1)}</span>
        </div>

        {/* Locality & ETA Footer over image */}
        <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end">
          <div>
            <h3 className="text-lg font-black text-slate-100 group-hover:text-amber-400 transition leading-snug">
              {restaurant.name}
            </h3>
            <p className="text-xs text-slate-400">{restaurant.locality}</p>
          </div>
        </div>
      </div>

      {/* Card Details Body */}
      <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {/* Cuisines */}
          <div className="flex flex-wrap gap-1">
            {restaurant.cuisine.map((c) => (
              <span
                key={c}
                className="text-[11px] font-medium bg-slate-800/60 text-slate-300 px-2 py-0.5 rounded-lg border border-slate-800"
              >
                {c}
              </span>
            ))}
          </div>
        </div>

        {/* Speed ETA Bar */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center space-x-1 text-amber-400">
            <Zap className="w-4 h-4 fill-amber-400" />
            <span>Air Express: {restaurant.droneDeliveryTimeMin} mins</span>
          </div>
          <div className="flex items-center space-x-1 text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            <span>Ground: {restaurant.deliveryTimeMin} mins</span>
          </div>
        </div>
      </div>
    </div>
  );
};
