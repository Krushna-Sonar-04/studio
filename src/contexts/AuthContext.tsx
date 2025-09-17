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
    const storedUser = localStorage.getItem('civic-lens-user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      // If user is stored, ensure they are on an app page, not a public one
      const dashboardPath = ROLE_DASHBOARD_PATHS[parsedUser.role] || '/';
      if (!pathname.startsWith('/app')) {
        // router.push(dashboardPath); // This might be too aggressive
      }
    } else if (!['/login'].includes(pathname)) {
       // If no user and not on login page, redirect to login
       // This handles the case of trying to access protected routes directly
       router.push('/login');
    }
  }, []);

  const login = (role: UserRole) => {
    const userToLogin = mockUsers.find((u) => u.role === role);
    if (userToLogin) {
      localStorage.setItem('civic-lens-user', JSON.stringify(userToLogin));
      setUser(userToLogin);
      const path = ROLE_DASHBOARD_PATHS[userToLogin.role];
      router.push(path);
    }
  };

  const logout = () => {
    localStorage.removeItem('civic-lens-user');
    setUser(null);
    router.push("/login");
  };
  
  // This effect handles protecting routes
  useEffect(() => {
    const storedUser = localStorage.getItem('civic-lens-user');
    const isPublicPath = ['/login'].includes(pathname);

    if (!storedUser && !isPublicPath) {
      router.push('/login');
    }

  }, [pathname, router]);

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
