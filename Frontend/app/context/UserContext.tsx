import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserContextType {
  user_id: string | null;
  setUserId: (id: string | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user_id, setUserId] = useState<string | null>(null);

  const handleSetUserId = (id: string | null) => {
    console.log("Setting user ID:", id);
    setUserId(id);
  }

  return (
      <UserContext.Provider value={{ user_id, setUserId: handleSetUserId }}>
        {children}
      </UserContext.Provider>
  );
};


export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
