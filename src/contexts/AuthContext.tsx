import React, { createContext, useContext, useState, useCallback } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  isNewUser?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (provider: 'google' | 'microsoft') => Promise<void>;
  logout: () => void;
  completeOnboarding: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user for demo purposes
const MOCK_USER: User = {
  id: 'user-1',
  name: 'Priya Sharma',
  email: 'priya@company.com',
  avatarUrl: undefined,
  isNewUser: false,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (provider: 'google' | 'microsoft') => {
    setIsLoading(true);
    // Simulate OAuth flow
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Check if user has completed onboarding (mock: check localStorage)
    const hasCompletedOnboarding = localStorage.getItem('pmtaskos_onboarded') === 'true';
    
    setUser({
      ...MOCK_USER,
      isNewUser: !hasCompletedOnboarding,
    });
    setIsLoading(false);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('pmtaskos_onboarded');
  }, []);

  const completeOnboarding = useCallback(() => {
    localStorage.setItem('pmtaskos_onboarded', 'true');
    setUser(prev => prev ? { ...prev, isNewUser: false } : null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        completeOnboarding,
      }}
    >
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
