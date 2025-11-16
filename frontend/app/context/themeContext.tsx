"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

interface ThemeContextType {
  setTheme: (theme: boolean) => void;
  currentTheme: boolean;
  setCurrentTheme: React.Dispatch<React.SetStateAction<boolean>>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentTheme, setCurrentTheme] = useState<boolean>(false);
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme) {
      setCurrentTheme(JSON.parse(theme));
    }
  }, []);
  console.log(currentTheme);
  useEffect(() => {
    if (currentTheme) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [currentTheme]);
  const setTheme = (theme: boolean) => {
    setCurrentTheme(theme);
    localStorage.setItem("theme", JSON.stringify(theme));
  };
  return (
    <ThemeContext.Provider value={{ setTheme, currentTheme, setCurrentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
