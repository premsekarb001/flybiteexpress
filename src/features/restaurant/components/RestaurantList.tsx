import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Sparkles, Filter, Zap, Radio, RefreshCw, ArrowRight, Flame } from 'lucide-react';
import { Restaurant } from '../../../types';
import { RestaurantCard } from './RestaurantCard';
import { RestaurantCardSkeleton } from '../../../shared/ui/SkeletonLoader';
import { useLocationStore } from '../../../store/useLocationStore';
import { restaurantService } from '../../../services/restaurantService';
import { useDebounce } from '../../../shared/hooks/useDebounce';

interface RestaurantListProps {
  onSelectRestaurant: (restaurant: Restaurant) => void;
}

export const RestaurantList: React.FC<RestaurantListProps> = ({ onSelectRestaurant }) => {
  const { currentLocation } = useLocationStore();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 250);
  const [activeTag, setActiveTag] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(true);
  const restaurantGridRef = useRef<HTMLDivElement>(null);

  // Simulate skeleton load on initial render or tag change
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [activeTag]);

  const categories = [
    { id: 'All', label: 'All Cuisines', icon: '🍽️' },
    { id: 'Biryani', label: 'Biryani', icon: '🍲' },
    { id: 'South Indian', label: 'South Indian', icon: '🥞' },
    { id: 'North Indian', label: 'North Indian', icon: '🥘' },
    { id: 'Drone Express', label: 'Air Express', icon: '🚁' },
    { id: 'Top Rated 4.5+', label: 'Top Rated', icon: '⭐' },
    { id: 'Under 30 Mins', label: 'Under 30m', icon: '⚡' },
    { id: 'Desserts', label: 'Desserts', icon: '🍰' },
    { id: 'Beverages', label: 'Beverages', icon: '🥤' }
  ];

  const filteredRestaurants = restaurantService.filterRestaurants(debouncedQuery, activeTag);

  const handleOrderNowClick = () => {
    restaurantGridRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* High-Converting Hero Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-slate-900/95 to-amber-950/50 border border-slate-800 p-6 sm:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -z-0 pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-5">
          <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black uppercase px-3.5 py-1.5 rounded-full shadow-sm">
            <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Autonomous VTOL Air Express Logistics</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-100 leading-tight">
            Delicious Food. <br />
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">
              Flown Hot to Your Rooftop.
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg">
            Experience sub-15 minute autonomous drone delivery from FSSAI-certified kitchens in {currentLocation.label}. Zero ground traffic delays.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={handleOrderNowClick}
              className="py-3.5 px-7 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-slate-950 font-black rounded-2xl text-sm transition shadow-xl shadow-amber-500/20 flex items-center space-x-2 group"
            >
              <span>Order Now</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </button>

            <div className="flex items-center space-x-2 text-xs text-amber-400/90 font-mono bg-slate-950/70 border border-slate-800 px-3.5 py-2 rounded-2xl">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>Hub: {currentLocation.city} ({currentLocation.landingPadCode})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Discovery Search & Category Filter Grid */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Main Search Input */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by restaurant, dish name (Biryani, Dosa, Kebabs), or cuisine..."
              className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-slate-100 focus:outline-none focus:border-amber-500 shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-3 text-xs bg-slate-800 text-slate-400 hover:text-white px-2.5 py-1 rounded-lg"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Horizontal Category Filter Grid */}
        <div className="flex items-center space-x-2.5 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((cat) => {
            const isActive = activeTag === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTag(cat.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap flex items-center space-x-2 ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/20 font-black'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <span className="text-base">{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured Restaurants Responsive Grid */}
      <div ref={restaurantGridRef} className="pt-2">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-100 flex items-center space-x-2">
              <span>Featured Restaurants</span>
              <span className="text-xs bg-slate-800 text-amber-400 font-mono px-2.5 py-0.5 rounded-full border border-slate-700">
                {filteredRestaurants.length}
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Top FSSAI verified kitchens available for express dispatch</p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <RestaurantCardSkeleton />
            <RestaurantCardSkeleton />
            <RestaurantCardSkeleton />
          </div>
        ) : filteredRestaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                onSelect={onSelectRestaurant}
              />
            ))}
          </div>
        ) : (
          /* Empty Search State */
          <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-3xl p-8 space-y-4">
            <Filter className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-xl font-bold text-slate-200">No restaurants match your search</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              We couldn't find any kitchen matching "{debouncedQuery}" under "{activeTag}". Try clearing your query or resetting filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveTag('All');
              }}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg hover:from-amber-600 hover:to-orange-600 transition inline-flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
