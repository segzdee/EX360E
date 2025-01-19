"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of the AuthContext
interface AuthContextType {
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
}

// Create the AuthContext
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
