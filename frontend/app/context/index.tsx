// context/AuthContext.tsx
"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

type Role = "admin" | "moderator" | "user";

interface User {
  id?: string;
  username?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [user, setUserState] = useState<User | null>(null);

  const router = useRouter();
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setUserState(JSON.parse(user));
    }
  }, []);
  const setUser = (user: User | null) => {
    setUserState(user);
    localStorage.setItem("user", JSON.stringify(user));
  };
  const logout = () => {
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
