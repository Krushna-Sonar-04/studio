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
      setUser(JSON.parse(storedUser));
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
    const storedUserJson = localStorage.getItem('civic-lens-user');
    const isPublicPath = ['/login', '/'].includes(pathname);
    const isAppPath = pathname.startsWith('/app'); // Future-proofing for /app routes

    if (storedUserJson) {
      const storedUser = JSON.parse(storedUserJson);
      const userDashboard = ROLE_DASHBOARD_PATHS[storedUser.role];
      // If user is logged in and on a public page, redirect to their dashboard
      if (isPublicPath) {
        router.push(userDashboard);
      }
      // If user is trying to access a page that doesn't match their role, redirect
      else if (!pathname.startsWith(userDashboard.split('/').slice(0,2).join('/'))) {
         // router.push(userDashboard); // This can be too aggressive, let's just log for now.
         console.warn(`User with role ${storedUser.role} attempting to access ${pathname}`);
      }
    } else if (!isPublicPath) {
      // If no user and not on a public path, redirect to login
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
