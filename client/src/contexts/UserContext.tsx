import { createContext, useContext, ReactNode } from 'react';

interface User {
  id: number;
  email: string;
  name?: string;
  role?: string;
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  // Simple mock user context for build
  // In production, this should fetch user from API
  const value: UserContextType = {
    user: null,
    isLoading: false,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
