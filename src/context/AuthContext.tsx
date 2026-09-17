"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "@/types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  loginAs: (role: UserRole) => Promise<boolean>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Load user from localStorage or API on initial mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("dinedesk_user");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to parse stored user", e);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string = "password123"): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        return false;
      }

      const data = await res.json();
      if (data.user) {
        setUser(data.user);
        localStorage.setItem("dinedesk_user", JSON.stringify(data.user));
        return true;
      }
      return false;
    } catch (err) {
      console.error("Login request error", err);
      return false;
    }
  };

  const loginAs = async (role: UserRole): Promise<boolean> => {
    const roleEmails: Record<UserRole, string> = {
      ADMIN: "admin@dinedesk.com",
      KITCHEN: "kitchen@dinedesk.com",
      CUSTOMER: "customer@dinedesk.com",
    };

    return await login(roleEmails[role], `${role.toLowerCase()}123`);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("dinedesk_user");
    fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
  };

  const updateUser = (updated: User) => {
    setUser(updated);
    localStorage.setItem("dinedesk_user", JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginAs, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
