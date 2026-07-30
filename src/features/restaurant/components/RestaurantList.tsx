import React, { useState, useEffect } from 'react';
import { Search, MapPin, Sparkles, Filter, Zap, Radio, SlidersHorizontal, RefreshCw } from 'lucide-react';
import { MOCK_RESTAURANTS } from '../../../data/mockData';
import { Restaurant } from '../../../types';
import { RestaurantCard } from './RestaurantCard';
import { RestaurantCardSkeleton } from '../../../shared/ui/SkeletonLoader';
import { useLocationStore } from '../../../store/useLocationStore';

interface RestaurantListProps {
  onSelectRestaurant: (restaurant: Restaurant) => void;
}

export const RestaurantList: React.FC<RestaurantListProps> = ({ onSelectRestaurant }) => {
  const { currentLocation } = useLocationStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(true);

  // Simulate fast skeleton load for async data fetching UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const tags = [
    'All',
    'Pure Veg',
    'Drone Express',
    'Top Rated 4.5+',
    'Under 30 Mins',
    'Biryani',
    'South Indian',
    'North Indian'
  ];

  const filteredRestaurants = MOCK_RESTAURANTS.filter((rest) => {
    // Search query check against restaurant name, locality, cuisines, or menu items
    const matchesSearch =
      searchQuery === '' ||
      rest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rest.locality.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rest.cuisine.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
      rest.menu.some((m) => m.name.toLowerCase().includes(searchQuery.toLowerCase()));

    // Tag filter check
    let matchesTag = true;
    if (activeTag === 'Pure Veg') {
      matchesTag = rest.cuisine.includes('Pure Veg') || rest.menu.every((m) => m.dietary === 'veg' || m.dietary === 'jain');
    } else if (activeTag === 'Drone Express') {
      matchesTag = rest.dronePadAvailable;
    } else if (activeTag === 'Top Rated 4.5+') {
      matchesTag = rest.rating >= 4.5;
    } else if (activeTag === 'Under 30 Mins') {
      matchesTag = rest.droneDeliveryTimeMin <= 25;
    } else if (activeTag === 'Biryani') {
      matchesTag = rest.cuisine.includes('Biryani');
    } else if (activeTag === 'South Indian') {
      matchesTag = rest.cuisine.includes('South Indian');
    } else if (activeTag === 'North Indian') {
      matchesTag = rest.cuisine.includes('North Indian');
    }

    return matchesSearch && matchesTag;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-slate-900/90 to-amber-950/40 border border-slate-800 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -z-0 pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center space-x-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black uppercase px-3 py-1 rounded-full">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Autonomous Air Express Food Logistics</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-100 leading-tight">
            Craving Hot Food? <br />
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">
              Flown Direct to Your Rooftop Pad.
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Order from top FSSAI-certified Indian restaurants in {currentLocation.label}. Bypass ground traffic with zero emissions and sub-15 minute VTOL delivery.
          </p>

          <div className="flex items-center space-x-2 text-xs text-amber-400/90 font-mono pt-2">
            <MapPin className="w-4 h-4 text-amber-400" />
            <span>Active Corridor: {currentLocation.city} ({currentLocation.landingPadCode})</span>
          </div>
        </div>
      </div>

      {/* Discovery Search & Category Tags Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Main Search Input */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by restaurant, dish name (Biryani, Dosa, Butter Chicken), or cuisine..."
              className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl pl-12 pr-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-amber-500 shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-xs bg-slate-800 text-slate-400 hover:text-white px-2 py-1 rounded-lg"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Categorized Horizontal Tag Selectors */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 no-scrollbar">
          {tags.map((tag) => {
            const isActive = activeTag === tag;
            return (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition whitespace-nowrap flex items-center space-x-1.5 ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/20'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {tag === 'Drone Express' && <Radio className="w-3.5 h-3.5" />}
                {tag === 'Top Rated 4.5+' && <Sparkles className="w-3.5 h-3.5" />}
                <span>{tag}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Restaurant Grid Display */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
            <span>Available Restaurants</span>
            <span className="text-xs bg-slate-800 text-amber-400 font-mono px-2.5 py-0.5 rounded-full">
              {filteredRestaurants.length}
            </span>
          </h2>
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
              We couldn't find any kitchen matching "{searchQuery}" under "{activeTag}". Try clearing your filters or searching for another dish.
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
