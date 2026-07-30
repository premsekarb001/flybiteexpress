import React, { useState, useEffect } from 'react';
import { useAuthStore } from './store/useAuthStore';
import { useCartStore } from './store/useCartStore';
import { useOrderStore } from './store/useOrderStore';
import { Navbar } from './shared/ui/Navbar';
import { RestaurantList } from './features/restaurant/components/RestaurantList';
import { RestaurantDetail } from './features/restaurant/components/RestaurantDetail';
import { CartDrawer } from './features/cart/components/CartDrawer';
import { CheckoutModal } from './features/checkout/components/CheckoutModal';
import { LiveOrderTracker } from './features/tracking/components/LiveOrderTracker';
import { AccountModal } from './shared/ui/AccountModal';
import { RestaurantDashboard } from './components/RestaurantPortal/RestaurantDashboard';
import { FleetControlDashboard } from './components/DronePortal/FleetControlDashboard';
import { AdminDashboard } from './components/AdminPortal/AdminDashboard';
import { ToastContainer, ToastMessage } from './shared/ui/Toast';
import { ErrorBoundary } from './shared/ui/ErrorBoundary';
import { Restaurant } from './types';
import { Lock, ArrowLeft } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const activeRole = useAuthStore((state) => state.activeRole);
  const switchRole = useAuthStore((state) => state.switchRole);
  const toastNotice = useCartStore((state) => state.toastNotice);
  const setToastNotice = useCartStore((state) => state.setToastNotice);

  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isLiveTrackerOpen, setIsLiveTrackerOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    if (toastNotice) {
      const id = `toast-${Date.now()}`;
      setToasts((prev) => [...prev, { id, text: toastNotice }]);
      setToastNotice(null);
    }
  }, [toastNotice, setToastNotice]);

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-amber-500 selection:text-slate-950 font-sans">
      <div>
        <Navbar
          onOpenCart={() => setIsCartOpen(true)}
          onOpenLiveTracker={() => setIsLiveTrackerOpen(true)}
          onOpenAccountModal={() => setIsAccountOpen(true)}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeRole !== 'customer' && (
            <div className="mb-6 p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between">
              <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
                <Lock className="w-4 h-4" />
                <span>Restricted Management View: {activeRole.toUpperCase()}</span>
              </div>
              <button
                onClick={() => switchRole('customer')}
                className="px-4 py-2 bg-amber-500 text-slate-950 font-black text-xs rounded-xl hover:bg-amber-600 transition flex items-center space-x-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Consumer App</span>
              </button>
            </div>
          )}

          {activeRole === 'customer' && (
            <>
              {selectedRestaurant ? (
                <RestaurantDetail
                  restaurant={selectedRestaurant}
                  onBack={() => setSelectedRestaurant(null)}
                  onOpenCart={() => setIsCartOpen(true)}
                />
              ) : (
                <RestaurantList onSelectRestaurant={(rest) => setSelectedRestaurant(rest)} />
              )}
            </>
          )}

          {activeRole === 'restaurant' && <RestaurantDashboard />}
          {activeRole === 'drone_pilot' && <FleetControlDashboard />}
          {activeRole === 'admin' && <AdminDashboard />}
        </main>
      </div>

      {/* Global Consumer Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-8 text-center text-xs text-slate-500 space-y-3">
        <div className="flex justify-center space-x-4">
          <span>DGCA Air Corridor Verified</span>
          <span>•</span>
          <span>FSSAI Hygiene Certified</span>
          <span>•</span>
          <span>NPCI 256-Bit SSL UPI</span>
        </div>
        <p>© 2026 FlyBite Express India. Multi-Modal Ground &amp; Autonomous VTOL Air Express Food Delivery.</p>
        <div className="pt-2">
          <button
            onClick={() => setIsAccountOpen(true)}
            className="text-[11px] text-slate-600 hover:text-slate-400 underline transition"
          >
            Merchant &amp; Operations Access
          </button>
        </div>
      </footer>

      {/* Global Toast Container */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />

      {/* Global Modals & Drawers */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedToPayment={() => {
          setIsCartOpen(false);
          setIsPaymentOpen(true);
        }}
      />

      <CheckoutModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        onPaymentSuccess={() => {
          setIsPaymentOpen(false);
          setIsLiveTrackerOpen(true);
        }}
      />

      <LiveOrderTracker
        isOpen={isLiveTrackerOpen}
        onClose={() => setIsLiveTrackerOpen(false)}
      />

      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
      />
    </div>
  );
};

export function App() {
  return (
    <ErrorBoundary>
      <MainAppContent />
    </ErrorBoundary>
  );
}

export default App;
