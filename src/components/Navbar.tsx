import React from 'react';
import { Navbar as SharedNavbar } from '../shared/ui/Navbar';

interface NavbarProps {
  onOpenCart: () => void;
  onOpenLiveTracker: () => void;
}

export const Navbar: React.FC<NavbarProps> = (props) => {
  return <SharedNavbar {...props} />;
};
