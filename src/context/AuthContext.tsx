import React, { createContext, useState, useEffect, ReactNode } from "react";
import type { User } from "../types/index";

// Context type
interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  logout: () => void;
  setUser:(user:object) => void;
}

// Props for AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

// Create context
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  logout: () => {},
  setUser:() => {},
  
});

// Provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (err) {
        console.error("Failed to parse user from localStorage", err);
        setUser(null);
      }
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ setUser, user, isLoggedIn: !!user, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
