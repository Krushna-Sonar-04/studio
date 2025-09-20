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

const getRoleBasePath = (role: UserRole): string => {
    switch (role) {
        case 'Head of Department': return '/admin';
        case 'Approving Manager': return '/approving-manager';
        case 'Fund Manager': return '/fund-manager';
        default: return `/${role.toLowerCase()}`;
    }
};

const getAllowedPaths = (role: UserRole): string[] => {
    const basePath = getRoleBasePath(role);
    const sharedPaths = [
        // All roles can see issue details
        '/citizen/issues', 
        '/citizen/announcements'
    ];
    
    // Admins can see everything under their path
    if (role === 'Head of Department') {
        return [basePath, ...sharedPaths];
    }
    
    // Other roles have specific paths
    return [basePath, ...sharedPaths];
};


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedUser = localStorage.getItem('civic-lens-user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
       if (!user || user.id !== parsedUser.id) {
          setUser(parsedUser);
       }
    }
  }, [user]);

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

    if (!storedUserJson && !isPublicPath) {
        // Not logged in and not on a public page -> redirect to login
        router.push('/login');
    } else if (storedUserJson) {
        const storedUser = JSON.parse(storedUserJson) as User;
        const userDashboard = ROLE_DASHBOARD_PATHS[storedUser.role];

        // Logged in and on a public page -> redirect to dashboard
        if (isPublicPath) {
            router.push(userDashboard);
            return;
        }

        // Check if the current path is allowed for the user's role
        const allowedPaths = getAllowedPaths(storedUser.role);
        const isPathAllowed = allowedPaths.some(p => pathname.startsWith(p));
        
        if (!isPathAllowed) {
            console.warn(`Redirecting user with role ${storedUser.role} from unauthorized path ${pathname} to ${userDashboard}`);
            router.push(userDashboard);
        }
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
