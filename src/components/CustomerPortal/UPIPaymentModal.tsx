import React from 'react';
import { CheckoutModal } from '../../features/checkout/components/CheckoutModal';

interface UPIPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
}

export const UPIPaymentModal: React.FC<UPIPaymentModalProps> = ({
  isOpen,
  onClose,
  onPaymentSuccess
}) => {
  return (
    <CheckoutModal
      isOpen={isOpen}
      onClose={onClose}
      onPaymentSuccess={onPaymentSuccess}
    />
  );
};
