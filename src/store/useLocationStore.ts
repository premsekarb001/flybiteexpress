import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { PREDEFINED_LOCATIONS, PredefinedLocation } from '../data/mockData';

interface LocationState {
  currentLocation: PredefinedLocation;
  customPincode: string;
  customLandingPad: string;
  setLocation: (location: PredefinedLocation) => void;
  setCustomDetails: (pincode: string, landingPad: string) => void;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      currentLocation: PREDEFINED_LOCATIONS[0],
      customPincode: PREDEFINED_LOCATIONS[0].pincode,
      customLandingPad: PREDEFINED_LOCATIONS[0].landingPadCode,

      setLocation: (location) => {
        set({
          currentLocation: location,
          customPincode: location.pincode,
          customLandingPad: location.landingPadCode
        });
      },

      setCustomDetails: (pincode, landingPad) => {
        set({
          customPincode: pincode,
          customLandingPad: landingPad
        });
      }
    }),
    {
      name: 'flybite_location_store_v1',
      storage: createJSONStorage(() => localStorage)
    }
  )
);
