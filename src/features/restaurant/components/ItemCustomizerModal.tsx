import React, { useState, useEffect } from 'react';
import { X, Check, Plus, Minus, Flame, Sparkles } from 'lucide-react';
import { MenuItem, Restaurant, SelectedCustomization, CustomizationOption } from '../../../types';
import { useCartStore } from '../../../store/useCartStore';

interface ItemCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  menuItem: MenuItem;
  restaurant: Restaurant;
}

export const ItemCustomizerModal: React.FC<ItemCustomizerModalProps> = ({
  isOpen,
  onClose,
  menuItem,
  restaurant
}) => {
  const addItem = useCartStore((state) => state.addItem);
  const [selectedMap, setSelectedMap] = useState<Record<string, CustomizationOption[]>>({});
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Pre-select required single-choice options (minSelect === 1)
  useEffect(() => {
    if (menuItem.customizationGroups) {
      const initialMap: Record<string, CustomizationOption[]> = {};
      menuItem.customizationGroups.forEach((group) => {
        if (group.minSelect === 1 && group.options.length > 0) {
          initialMap[group.id] = [group.options[0]];
        } else {
          initialMap[group.id] = [];
        }
      });
      setSelectedMap(initialMap);
    }
  }, [menuItem]);

  if (!isOpen) return null;

  const handleOptionToggle = (
    groupId: string,
    option: CustomizationOption,
    minSelect: number,
    maxSelect: number
  ) => {
    setSelectedMap((prev) => {
      const currentList = prev[groupId] || [];
      const isAlreadySelected = currentList.some((o) => o.id === option.id);

      if (maxSelect === 1) {
        // Single choice selection
        return { ...prev, [groupId]: [option] };
      }

      // Multi-choice selection
      if (isAlreadySelected) {
        return {
          ...prev,
          [groupId]: currentList.filter((o) => o.id !== option.id)
        };
      } else {
        if (currentList.length >= maxSelect) return prev;
        return {
          ...prev,
          [groupId]: [...currentList, option]
        };
      }
    });
  };

  // Calculate unit price based on selected customizations
  const totalCustomizationPrice = Object.values(selectedMap)
    .flat()
    .reduce((sum, opt) => sum + opt.price, 0);

  const unitPrice = menuItem.price + totalCustomizationPrice;

  const handleAddToCart = () => {
    const flatCustomizations: SelectedCustomization[] = [];
    menuItem.customizationGroups?.forEach((group) => {
      const selected = selectedMap[group.id] || [];
      selected.forEach((opt) => {
        flatCustomizations.push({
          groupId: group.id,
          groupName: group.name,
          optionId: opt.id,
          optionName: opt.name,
          price: opt.price
        });
      });
    });

    addItem(menuItem, restaurant, flatCustomizations, specialInstructions);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="relative h-44 w-full bg-slate-950">
          <img
            src={menuItem.image}
            alt={menuItem.name}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-slate-950/80 hover:bg-slate-950 text-slate-300 hover:text-white rounded-full transition border border-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex items-center space-x-2">
              <span
                className={`text-[10px] uppercase font-black px-2 py-0.5 rounded ${
                  menuItem.dietary === 'veg'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : menuItem.dietary === 'jain'
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}
              >
                {menuItem.dietary}
              </span>
              {menuItem.bestseller && (
                <span className="bg-amber-500/20 text-amber-400 text-[10px] uppercase font-black px-2 py-0.5 rounded border border-amber-500/30">
                  Bestseller
                </span>
              )}
            </div>
            <h3 className="text-xl font-bold text-slate-100 mt-1">{menuItem.name}</h3>
            <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">{menuItem.description}</p>
          </div>
        </div>

        {/* Customization Options Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {menuItem.customizationGroups?.map((group) => {
            const selectedList = selectedMap[group.id] || [];
            return (
              <div key={group.id} className="space-y-3">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <h4 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
                    {group.name}
                  </h4>
                  <span className="text-[11px] font-semibold text-amber-400">
                    {group.minSelect === 1 ? 'Select 1 option' : `Select up to ${group.maxSelect}`}
                  </span>
                </div>

                <div className="space-y-2">
                  {group.options.map((option) => {
                    const isSelected = selectedList.some((o) => o.id === option.id);
                    return (
                      <button
                        key={option.id}
                        onClick={() =>
                          handleOptionToggle(group.id, option, group.minSelect, group.maxSelect)
                        }
                        className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-left transition ${
                          isSelected
                            ? 'bg-amber-500/10 border-amber-500/50 text-white shadow-md'
                            : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/40'
                        }`}
                      >
                        <span className="text-xs font-semibold">{option.name}</span>
                        <div className="flex items-center space-x-3">
                          <span className="text-xs font-bold text-amber-400">
                            {option.price > 0 ? `+₹${option.price}` : 'FREE'}
                          </span>
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                              isSelected
                                ? 'bg-amber-500 border-amber-500 text-slate-950 font-bold'
                                : 'border-slate-700'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5" />}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Special Instructions Input */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <label className="block text-xs font-semibold text-slate-400">
              Special Cooking Instructions / Allergies (Optional)
            </label>
            <input
              type="text"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g., Less oil, extra spicy, no onions"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Footer with calculated total price & Add to Basket */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-between items-center">
          <div>
            <div className="text-[11px] text-slate-400">Total Price</div>
            <div className="text-xl font-black text-amber-400">₹{unitPrice}</div>
          </div>

          <button
            onClick={handleAddToCart}
            className="py-3 px-6 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black rounded-2xl text-sm transition shadow-lg shadow-amber-500/20 flex items-center space-x-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Add Item to Basket</span>
          </button>
        </div>
      </div>
    </div>
  );
};
