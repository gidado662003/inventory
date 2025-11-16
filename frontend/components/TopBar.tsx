"use client";

import { FaUserCircle, FaRegMoon, FaSun, FaChevronDown } from "react-icons/fa";
import { useAuth } from "@/app/context";
import { useTheme } from "@/app/context/themeContext";
import Image from "next/image";
import { useState } from "react";
import { format } from "date-fns";

export const TopBar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const now = new Date();
  const { user, logout } = useAuth();
  const { setTheme, currentTheme, setCurrentTheme } = useTheme();

  const toggleTheme = () => {
    setCurrentTheme(!currentTheme);
    setTheme(!currentTheme);
  };

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 text-foreground px-6 py-3 border-b border-border shadow-sm">
      <div className="flex items-center gap-4">
        <div className="relative w-10 h-10">
          <Image src="/logo.svg" alt="logo" fill className="object-contain" />
        </div>
        <div className="hidden md:flex items-center gap-2">
          <p className="text-sm font-medium text-foreground">
            {format(now, "EEEE, MMMM d")}
          </p>
          <span className="w-1 h-1 rounded-full bg-muted-foreground" />
          <p className="text-sm font-medium text-muted-foreground">
            {format(now, "h:mm a")}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 relative">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-accent transition-colors duration-200 text-muted-foreground hover:text-foreground"
          aria-label={
            currentTheme ? "Switch to light mode" : "Switch to dark mode"
          }
        >
          {currentTheme ? (
            <FaSun className="text-lg" />
          ) : (
            <FaRegMoon className="text-lg" />
          )}
        </button>

        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-2 cursor-pointer hover:bg-accent rounded-full p-1 pr-2 transition-colors duration-200"
            onClick={toggleDropdown}
          >
            <FaUserCircle className="text-2xl text-muted-foreground" />
            <p className="text-sm font-medium hidden sm:block">
              {user?.username}
            </p>
            <FaChevronDown
              className={`text-xs text-muted-foreground transition-transform duration-200 ${
                showDropdown ? "rotate-180" : ""
              }`}
            />
          </div>

          {showDropdown && (
            <div className="absolute right-0 top-12 w-48 bg-popover border border-border rounded-md shadow-lg overflow-hidden z-50 transition-all duration-200 ease-out">
              <div className="p-4 border-b border-border">
                <p className="text-sm font-medium">{user?.username}</p>
              </div>
              <button
                onClick={() => {
                  logout();
                  setShowDropdown(false);
                }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-accent transition-colors duration-200 text-destructive"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
