import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { validateUserCredentials, refreshUserData } from '@/utils/authUtils';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'cashier' | 'accountant' | 'sales' | 'finance';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already logged in (from localStorage or session)
    const storedUser = localStorage.getItem('pos_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('pos_user');
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const userData = await validateUserCredentials(email, password);
      
      if (userData) {
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('pos_user', JSON.stringify(userData));
      } else {
        throw new Error('Invalid email or password. Please check your credentials and try again.');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      // Provide more specific error messages
      if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Authentication failed. Please try again or contact your system administrator.');
      }
    }
  };

  const refreshUser = async () => {
    if (!user) return;
    
    try {
      const updatedUserData = await refreshUserData(user.email);
      
      if (updatedUserData) {
        // Update user data if it has changed
        if (JSON.stringify(user) !== JSON.stringify(updatedUserData)) {
          setUser(updatedUserData);
          localStorage.setItem('pos_user', JSON.stringify(updatedUserData));
        }
      } else {
        // User no longer exists in Sheet1, log them out
        logout();
      }
    } catch (error: any) {
      console.warn('Failed to refresh user data:', error);
      // Don't log out on refresh failure, might be network issue
      throw new Error(`Failed to refresh user data: ${error.message || 'Unknown error'}`);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('pos_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}