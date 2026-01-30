'use client';
import { createContext, useEffect, useState } from 'react';

interface UserType {
  id: number;
  full_name: string;
  email?: string;
  phone?: string;
  role: 'admin' | 'manager' | 'customer';
}

interface ContextType {
  user: UserType | null;
  setUser: (user: UserType | null) => void;
}

export const UserContext = createContext<ContextType | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
