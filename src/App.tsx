import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { OrderProvider, useOrders } from './context/OrderContext';
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
import { ErrorBoundary } from './components/ErrorBoundary';
import { Restaurant } from './types';

const MainAppContent: React.FC = () => {
  const { activeRole } = useAuth();
  const { toastNotice, setToastNotice } = useCart();
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isLiveTrackerOpen, setIsLiveTrackerOpen] = useState(false);

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

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-8 text-center text-xs text-slate-500 space-y-2">
        <div className="flex justify-center space-x-4">
          <span>DGCA Air Corridor Verified</span>
          <span>•</span>
          <span>FSSAI Hygiene Certified</span>
          <span>•</span>
          <span>NPCI 256-Bit SSL UPI</span>
        </div>
        <p>© 2026 FlyBite Express India. Multi-Modal Ground &amp; Drone Air Express Food Delivery.</p>
      </footer>

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
    </div>
  );
};

export function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <OrderProvider>
            <MainAppContent />
          </OrderProvider>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
