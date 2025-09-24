// auth/AuthContext.tsx
import { createContext, useContext, useMemo, useState } from "react";
import { useRevalidator } from "react-router-dom";
import type { User, Role } from "./types";

type AuthContextValue = {
  user: User | null;
  isAdmin: boolean;
  isUser: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (required: Role) => boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({
  children,
  initialUser = null,
}: {
  children: React.ReactNode;
  initialUser?: User | null;
}) {
  const [user, setUser] = useState<User | null>(initialUser);
  const revalidator = useRevalidator();

  const isAdmin = user?.role === "admin";
  const isUser = user?.role === "user";
  const isAuthenticated = !!user;

  async function login(email: string, password: string) {
    const response = await fetch("/api/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok || data?.error) {
      throw new Error(data?.error ?? "Login failed");
    }
    setUser(data as User);         // backend skickar alltid role i lowercase
    revalidator.revalidate();      // uppdatera loaders som lyssnar
  }

  async function logout() {
    await fetch("/api/login", {
      method: "DELETE",
      credentials: "include",
    });
    setUser(null);
    revalidator.revalidate();
  }

  function hasRole(required: Role) {
    return user?.role === required;

  }

  const value = useMemo(
    () => ({
      user,
      isAdmin,
      isUser,
      isAuthenticated,
      login,
      logout,
      hasRole,
    }),
    [user, isAdmin, isUser, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth måste användas under <AuthProvider>");
  return ctx;
}
