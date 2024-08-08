'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: number;
  image: string;
  name?: string;
  description?: string;
}

interface UserContextProps {
  users: User[] | any;
  fetchUsers: () => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/story');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      // console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <UserContext.Provider value={{ users, fetchUsers }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('error');
  }
  return context;
};
