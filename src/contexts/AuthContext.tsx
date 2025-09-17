"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { User, UserRole } from "@/lib/types";
import { mockUsers } from "@/lib/mock-data";
import { ROLE_DASHBOARD_PATHS } from "@/lib/constants";
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  login: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedUser = localStorage.getItem('civitas-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (role: UserRole) => {
    const userToLogin = mockUsers.find((u) => u.role === role);
    if (userToLogin) {
      localStorage.setItem('civitas-user', JSON.stringify(userToLogin));
      setUser(userToLogin);
      const path = ROLE_DASHBOARD_PATHS[userToLogin.role];
      router.push(path);
    }
  };

  const logout = () => {
    localStorage.removeItem('civitas-user');
    setUser(null);
    router.push("/login");
  };

  useEffect(() => {
    const publicPaths = ['/login'];
    const pathIsProtected = !publicPaths.includes(pathname);
    
    if (pathIsProtected && !user) {
        // router.push('/login'); // This can cause redirect loops on initial load
    }
  }, [pathname, user, router]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
