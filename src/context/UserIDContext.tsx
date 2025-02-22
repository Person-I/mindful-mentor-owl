import React, { createContext, useContext, useEffect, useState } from 'react';

// Create a context for the user ID
const UserIDContext = createContext<string | undefined>(undefined);

// Function to generate a random string
const generateRandomID = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Create a provider component
export const UserIDProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userID, setUserID] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Check if a user ID is already stored in local storage
    let storedUserID = localStorage.getItem('userID');
    if (!storedUserID) {
      // If not, generate a new one and save it
      storedUserID = generateRandomID();
      localStorage.setItem('userID', storedUserID);
    }
    setUserID(storedUserID);
  }, []);

  return (
    <UserIDContext.Provider value={userID}>
      {children}
    </UserIDContext.Provider>
  );
};

// Custom hook to use the UserIDContext
export const useUserID = () => {
  const context = useContext(UserIDContext);
  if (context === undefined) {
    throw new Error('useUserID must be used within a UserIDProvider');
  }
  return context;
}; 