import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';

import { Navbar } from './components/Navbar';
import { RestaurantList } from './components/CustomerPortal/RestaurantList';
import { RestaurantDetail } from './components/CustomerPortal/RestaurantDetail';
import { CartDrawer } from './components/CustomerPortal/CartDrawer';
import { UPIPaymentModal } from './components/CustomerPortal/UPIPaymentModal';
import { LiveOrderTracker } from './components/DroneLogistics/LiveOrderTracker';

import { RestaurantDashboard } from './components/RestaurantPortal/RestaurantDashboard';
import { FleetControlDashboard } from './components/DronePortal/FleetControlDashboard';
import { AdminDashboard } from './components/AdminPortal/AdminDashboard';
import { ToastContainer, ToastMessage } from './components/Toast';

import { Restaurant } from './types';
import { ShieldCheck, Zap } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeRole } = useAuth();
  const { toastNotice, setToastNotice } = useCart();
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isLiveTrackerOpen, setIsLiveTrackerOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    if (toastNotice) {
      const newToast: ToastMessage = {
        id: `toast-${Date.now()}`,
        type: 'info',
        text: toastNotice
      };
      setToasts((prev) => [newToast, ...prev].slice(0, 3));
      setToastNotice(null);
    }
  }, [toastNotice, setToastNotice]);

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-orange-500 selection:text-white">
      <div>
        <Navbar
          onOpenCart={() => setIsCartOpen(true)}
          onOpenLiveTracker={() => setIsLiveTrackerOpen(true)}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

      {/* Global Toast Container */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />

      {/* Global Modals */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedToPayment={() => {
          setIsCartOpen(false);
          setIsPaymentOpen(true);
        }}
      />

      <UPIPaymentModal
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

      {/* Indian Market Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 px-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <span className="font-extrabold text-white text-sm">FlyBite Express India</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" /> FSSAI Certified
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-cyan-400">
              <Zap className="w-3.5 h-3.5" /> DGCA Airspace Green Corridor
            </span>
          </div>

          <div className="flex items-center space-x-4 text-slate-400">
            <span>UPI / GPay / PhonePe / Paytm Supported</span>
            <span>© 2026 FlyBite Technologies Pvt. Ltd.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <OrderProvider>
          <AppContent />
        </OrderProvider>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
