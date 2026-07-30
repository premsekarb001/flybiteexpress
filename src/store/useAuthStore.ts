import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, UserRole } from '../types';
import { MOCK_USERS } from '../data/mockData';
import { securityService } from '../services/securityService';

interface AuthState {
  currentUser: User;
  activeRole: UserRole;
  isLoggedIn: boolean;
  otpSent: boolean;
  pendingPhone: string;

  // Actions
  switchRole: (role: UserRole) => void;
  loginCustomerOTP: (phone: string) => void;
  verifyOTP: (otp: string) => boolean;
  loginAdminPassword: (email: string, pass: string) => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: MOCK_USERS.customer,
      activeRole: 'customer',
      isLoggedIn: true,
      otpSent: false,
      pendingPhone: '',

      switchRole: (role) => {
        const targetUser = MOCK_USERS[role] || MOCK_USERS.customer;
        set({
          activeRole: role,
          currentUser: targetUser,
          isLoggedIn: true
        });
        securityService.logAction(
          targetUser.name,
          role,
          `Role switched to ${role.toUpperCase()}`,
          '192.168.1.100',
          'low',
          `Switched context portal view to ${role}`
        );
      },

      loginCustomerOTP: (phone) => {
        set({ pendingPhone: phone, otpSent: true });
        securityService.logAction(
          phone,
          'customer',
          'Requested SMS Login OTP',
          '192.168.1.55',
          'low',
          `Sent 6-digit OTP to mobile ${phone}`
        );
      },

      verifyOTP: (otp) => {
        const { pendingPhone } = get();
        if (otp === '123456' || otp.length === 6) {
          const updatedUser: User = {
            ...MOCK_USERS.customer,
            phone: pendingPhone || MOCK_USERS.customer.phone
          };
          set({
            isLoggedIn: true,
            activeRole: 'customer',
            currentUser: updatedUser,
            otpSent: false
          });
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
      },

      loginAdminPassword: (email, pass) => {
        if (email === 'admin@flybite.in' && pass.length >= 4) {
          set({
            isLoggedIn: true,
            activeRole: 'admin',
            currentUser: MOCK_USERS.admin
          });
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
      },

      logout: () => {
        const { currentUser, activeRole } = get();
        set({
          isLoggedIn: false,
          activeRole: 'customer',
          currentUser: MOCK_USERS.customer
        });
        securityService.logAction(
          currentUser.name,
          activeRole,
          'User Logout',
          '192.168.1.100',
          'low',
          `User logged out of session`
        );
      }
    }),
    {
      name: 'flybite_auth_store_v2',
      storage: createJSONStorage(() => localStorage)
    }
  )
);
