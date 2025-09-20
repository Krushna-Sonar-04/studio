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
    // Public paths that don't require authentication
    const isPublicPath = ['/login', '/'].includes(pathname);
    
    if (storedUserJson) {
      const storedUser = JSON.parse(storedUserJson);
      const userRole = storedUser.role as UserRole;
      const userDashboard = ROLE_DASHBOARD_PATHS[userRole];
      const userBasePath = `/${userRole.toLowerCase().replace(/\s/g, '-')}`;

      // If user is logged in and trying to access a public page like /login, redirect them to their dashboard
      if (isPublicPath && user) {
        router.push(userDashboard);
      }
      // If user is on a path that is not public and does not belong to their role, redirect to their dashboard
      else if (!isPublicPath && !pathname.startsWith(userBasePath) && user) {
        console.warn(`Redirecting user with role ${userRole} from unauthorized path ${pathname} to ${userDashboard}`);
        router.push(userDashboard);
      }
    } else if (!isPublicPath) {
      // If no user is logged in and they are trying to access a non-public path, redirect to login
      router.push('/login');
    }

  }, [pathname, router, user]);

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
