import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isLoading: boolean; // Thêm isLoading state
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Thêm loading state

  useEffect(() => {
    // Kiểm tra auth từ localStorage
    const basicAuth = localStorage.getItem('auth');
    const userData = localStorage.getItem('user');
    if (basicAuth && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
    setIsLoading(false); // Set loading false sau khi đã kiểm tra xong
  }, []);

  const login = (user: User) => {
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('auth');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};