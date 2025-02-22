import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CharacterContextType {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

const CharacterContext = createContext<CharacterContextType | undefined>(undefined);

export const CharacterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <CharacterContext.Provider value={{ selectedId, setSelectedId }}>
      {children}
    </CharacterContext.Provider>
  );
};

export const useCharacter = () => {
  const context = useContext(CharacterContext);
  if (!context) {
    throw new Error('useCharacter must be used within a CharacterProvider');
  }
  return context;
}; 