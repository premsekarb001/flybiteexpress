import React from 'react';

export const RestaurantCardSkeleton: React.FC = () => {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden animate-pulse shadow-lg">
      <div className="h-48 bg-slate-800/80 w-full relative">
        <div className="absolute top-3 right-3 bg-slate-700 h-6 w-16 rounded-full" />
      </div>
      <div className="p-5 space-y-3">
        <div className="flex justify-between items-start">
          <div className="h-6 bg-slate-800 rounded w-2/3" />
          <div className="h-6 bg-slate-800 rounded w-12" />
        </div>
        <div className="h-4 bg-slate-800/70 rounded w-1/2" />
        <div className="flex items-center space-x-2 pt-2 border-t border-slate-800/60">
          <div className="h-4 bg-slate-800 rounded w-1/3" />
          <div className="h-4 bg-slate-800 rounded w-1/3" />
        </div>
      </div>
    </div>
  );
};

export const MenuItemCardSkeleton: React.FC = () => {
  return (
    <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-4 flex justify-between items-center animate-pulse">
      <div className="space-y-2 flex-1 pr-4">
        <div className="flex items-center space-x-2">
          <div className="h-4 w-4 rounded-full bg-slate-800" />
          <div className="h-5 bg-slate-800 rounded w-1/2" />
        </div>
        <div className="h-4 bg-slate-800/60 rounded w-3/4" />
        <div className="h-5 bg-slate-800/80 rounded w-20" />
      </div>
      <div className="w-28 h-28 bg-slate-800 rounded-lg" />
    </div>
  );
};

export const BannerSkeleton: React.FC = () => {
  return (
    <div className="w-full h-64 bg-slate-900 rounded-3xl animate-pulse border border-slate-800 p-8 flex flex-col justify-end space-y-4">
      <div className="h-8 bg-slate-800 rounded w-1/3" />
      <div className="h-4 bg-slate-800/70 rounded w-1/2" />
    </div>
  );
};
