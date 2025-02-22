import React, { createContext, useState, useEffect, useContext } from 'react';

interface UserContextValue {
  userId: string;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

interface UserProviderProps {
  children: React.ReactNode;
}

const generateRandomString = (length: number = 8): string => {
  return Math.random().toString(36).substring(2, 2 + length);
};

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      const newUserId = generateRandomString();
      localStorage.setItem('userId', newUserId);
      setUserId(newUserId);
    }
  }, []);

  return (
    <UserContext.Provider value={{ userId }}>
      {children}
    </UserContext.Provider>
  );
};

/**
 * Custom hook to access the UserContext
 * Usage example:
 *    const { userId } = useUser();
 */
export const useUser = (): UserContextValue => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
