import React, { createContext, useContext, useState } from 'react';
import { User, UserRole } from '../types';
import { MOCK_USERS } from '../data/mockData';
import { securityService } from '../services/securityService';

interface AuthContextType {
  currentUser: User;
  activeRole: UserRole;
  isLoggedIn: boolean;
  switchRole: (role: UserRole) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  loginCustomerOTP: (phone: string) => void;
  verifyOTP: (otp: string) => boolean;
  loginAdminPassword: (email: string, pass: string) => boolean;
  logout: () => void;
  otpSent: boolean;
  pendingPhone: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeRole, setActiveRole] = useState<UserRole>('customer');
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS.customer);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true); // Logged in by default for demo ease
  const [selectedCity, setSelectedCity] = useState<string>('Bangalore (Koramangala/Indiranagar)');
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [pendingPhone, setPendingPhone] = useState<string>('');

  const switchRole = (role: UserRole) => {
    setActiveRole(role);
    setCurrentUser(MOCK_USERS[role] || MOCK_USERS.customer);
    setIsLoggedIn(true);
    securityService.logAction(
      MOCK_USERS[role]?.name || 'User',
      role,
      `Role switched to ${role.toUpperCase()}`,
      '192.168.1.100',
      'low',
      `Switched context portal view to ${role}`
    );
  };

  const loginCustomerOTP = (phone: string) => {
    setPendingPhone(phone);
    setOtpSent(true);
    securityService.logAction(
      phone,
      'customer',
      'Requested SMS Login OTP',
      '192.168.1.55',
      'low',
      `Sent 6-digit OTP to Indian mobile ${phone}`
    );
  };

  const verifyOTP = (otp: string): boolean => {
    if (otp === '123456' || otp.length === 6) {
      const updatedUser = {
        ...MOCK_USERS.customer,
        phone: pendingPhone || MOCK_USERS.customer.phone
      };
      setIsLoggedIn(true);
      setActiveRole('customer');
      setCurrentUser(updatedUser);
      setOtpSent(false);
      securityService.logAction(
        updatedUser.name,
        'customer',
        'Customer OTP Auth Success',
        '192.168.1.55',
        'low',
        `Authenticated customer via SMS OTP verification (${updatedUser.phone})`
      );
      return true;
    }
    return false;
  };

  const loginAdminPassword = (email: string, pass: string): boolean => {
    if (email === 'admin@flybite.in' && pass.length >= 4) {
      setIsLoggedIn(true);
      setActiveRole('admin');
      setCurrentUser(MOCK_USERS.admin);
      securityService.logAction(
        'Admin',
        'admin',
        'Admin Credential Auth Success',
        '192.168.1.1',
        'medium',
        `SuperAdmin logged into Governance Portal`
      );
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
    securityService.logAction(
      currentUser.name,
      activeRole,
      'User Logout',
      '192.168.1.100',
      'low',
      `User logged out of session`
    );
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        activeRole,
        isLoggedIn,
        switchRole,
        selectedCity,
        setSelectedCity,
        loginCustomerOTP,
        verifyOTP,
        loginAdminPassword,
        logout,
        otpSent,
        pendingPhone
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
