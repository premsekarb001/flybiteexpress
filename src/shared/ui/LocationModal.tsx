import React, { useState } from 'react';
import { MapPin, Check, Compass, Radio, X } from 'lucide-react';
import { useLocationStore } from '../../store/useLocationStore';
import { PREDEFINED_LOCATIONS, PredefinedLocation } from '../../data/mockData';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({ isOpen, onClose }) => {
  const { currentLocation, setLocation, setCustomDetails } = useLocationStore();
  const [pincode, setPincode] = useState(currentLocation.pincode);
  const [landingPad, setLandingPad] = useState(currentLocation.landingPadCode);

  if (!isOpen) return null;

  const handleSelectPredefined = (loc: PredefinedLocation) => {
    setLocation(loc);
    setPincode(loc.pincode);
    setLandingPad(loc.landingPadCode);
  };

  const handleSaveCustom = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomDetails(pincode, landingPad);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-gradient-to-r from-amber-500/10 to-orange-500/10">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/30">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-100">Select Delivery Location</h3>
              <p className="text-xs text-slate-400">Choose your city or specify custom drone air corridor pad</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Predefined Hubs */}
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center space-x-2">
              <Compass className="w-4 h-4" />
              <span>Verified Delivery Hubs</span>
            </label>
            <div className="space-y-2">
              {PREDEFINED_LOCATIONS.map((loc) => {
                const isSelected = currentLocation.id === loc.id;
                return (
                  <button
                    key={loc.id}
                    onClick={() => handleSelectPredefined(loc)}
                    className={`w-full text-left p-4 rounded-2xl border transition flex justify-between items-center ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500/50 text-white shadow-lg shadow-amber-500/5'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/50'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-sm text-slate-100">{loc.label}</div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {loc.city} • Pincode: {loc.pincode}
                      </div>
                      <div className="text-[11px] text-amber-400/90 font-mono mt-1 flex items-center space-x-1">
                        <Radio className="w-3 h-3 text-amber-400" />
                        <span>VTOL Drone Pad: {loc.landingPadCode}</span>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Details Input */}
          <form onSubmit={handleSaveCustom} className="pt-4 border-t border-slate-800 space-y-4">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Custom Address Details
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Local Pincode</label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                  placeholder="e.g. 560095"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Rooftop Air Landing Pad Code</label>
                <input
                  type="text"
                  value={landingPad}
                  onChange={(e) => setLandingPad(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-amber-500"
                  placeholder="e.g. BLR-PAD-1001"
                />
              </div>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-semibold transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold rounded-xl text-sm transition shadow-lg shadow-amber-500/20"
              >
                Confirm Location
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
