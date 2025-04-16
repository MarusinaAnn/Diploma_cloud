import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "./api/axiosConfig";

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  setIsAuthenticated: (val: boolean) => void;
  setIsAdmin: (val: boolean) => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isAdmin: false,
  setIsAuthenticated: () => {},
  setIsAdmin: () => {},
  checkAuth: async () => {},
});

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAuth = async () => {
    try {
      const res = await axios.get("api/auth/me/", {
        headers: { "Cache-Control": "no-cache" },
      });
      if (res?.data?.username) {
        setIsAuthenticated(true);
        setIsAdmin(res.data.is_admin);
      } else {
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    } catch {
      setIsAuthenticated(false);
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isAdmin, setIsAuthenticated, setIsAdmin, checkAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};
