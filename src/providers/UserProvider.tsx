'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUser as useClerkUser } from '@clerk/nextjs';

interface ExtendedUser {
  id: string;
  email: string;
  username: string;
  clerkId: string;
}

interface UserContextType {
  user: ExtendedUser | null;
  loading: boolean;
  error: string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user: clerkUser } = useClerkUser();
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (clerkUser) {
        try {
          const response = await fetch('/api/user');
          if (!response.ok) throw new Error('Failed to fetch user');
          const dbUser = await response.json();
          setUser(dbUser);
        } catch (err) {
          console.error('Error fetching user:', err);
          setError('Failed to fetch user data');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchUser();
  }, [clerkUser]);

  return (
    <UserContext.Provider value={{ user, loading, error }}>
      {children}
    </UserContext.Provider>
  );
};

export const useExtendedUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useExtendedUser must be used within a UserProvider');
  }
  return context;
};
