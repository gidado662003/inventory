"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CiHome } from "react-icons/ci";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { FcSalesPerformance } from "react-icons/fc";
import { RiCustomerService2Line } from "react-icons/ri";
import { TbReport } from "react-icons/tb";
import { IoIosMenu, IoIosLogOut, IoIosClose } from "react-icons/io";
import { FaUsers } from "react-icons/fa";
import { useAuth } from "@/app/context";
import Image from "next/image";
import { logUserout } from "@/app/api";
import { CustomToast } from "./CustomToast";

interface NavItem {
  name: string;
  link: string;
  icon: React.ReactNode;
  mobileIcon: React.ReactNode;
}

function Navbar() {
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);

  const hiddenPaths = ["/login", "/signUp", "/pending", "/"];
  const shouldHide = hiddenPaths.includes(pathname);

  const clearCookies = async () => {
    try {
      const response = await logUserout();
      return response;
    } catch (error: any) {
      CustomToast({
        message: "Error",
        description: error.response.data.message || "Error logging out",
        type: "error",
      });
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsMobileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (shouldHide) return null;

  const navItems: NavItem[] = [
    {
      name: "Dashboard",
      link: "/dashboard",
      icon: <CiHome className="min-w-[24px]" size={24} />,
      mobileIcon: <CiHome size={20} />,
    },
    {
      name: "Products",
      link: "/products",
      icon: (
        <MdOutlineProductionQuantityLimits className="min-w-[24px]" size={24} />
      ),
      mobileIcon: <MdOutlineProductionQuantityLimits size={20} />,
    },
    {
      name: "Sales",
      link: "/sales",
      icon: <FcSalesPerformance className="min-w-[24px]" size={24} />,
      mobileIcon: <FcSalesPerformance size={20} />,
    },
    {
      name: "Users",
      link: "/users",
      icon: <FaUsers className="min-w-[24px]" size={24} />,
      mobileIcon: <FaUsers size={20} />,
    },
    {
      name: "Customers",
      link: "/customers",
      icon: <RiCustomerService2Line className="min-w-[24px]" size={24} />,
      mobileIcon: <RiCustomerService2Line size={20} />,
    },
    {
      name: "Reports",
      link: "/reports",
      icon: <TbReport className="min-w-[24px]" size={24} />,
      mobileIcon: <TbReport size={20} />,
    },
  ];

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const DesktopSidebar = () => (
    <div
      // ref={navRef}
      className={`z-20 bg-sidebar text-sidebar-foreground flex-col border-r border-sidebar-border shadow-lg transition-all duration-300 ease-in-out ${
        isOpen ? "w-50" : "w-20"
      } h-full hidden md:flex`}
    >
      {/* Header */}
      <div className="flex items-center  justify-between p-2 border-b border-sidebar-border">
        {isOpen && (
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold whitespace-nowrap">Inventory</h1>
            {/* <Image src="/logo.svg" alt="logo" width={50} height={50} /> */}
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-full hover:bg-sidebar-accent transition-colors"
          aria-label={isOpen ? "Collapse menu" : "Expand menu"}
        >
          <IoIosMenu size={24} />
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto py-4 space-y-1 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.link;
          return (
            <Link
              key={item.link}
              href={item.link}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                  : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
              title={!isOpen ? item.name : ""}
            >
              <div
                className={`${
                  isActive
                    ? "text-sidebar-primary-foreground"
                    : "text-sidebar-foreground"
                }`}
              >
                {item.icon}
              </div>
              {isOpen && (
                <span className="text-sm whitespace-nowrap">{item.name}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <button
          onClick={() => {
            logout();
            clearCookies();
          }}
          className={`flex items-center ${
            isOpen ? "justify-start gap-2" : "justify-center"
          } w-full py-2 px-4 rounded-lg bg-sidebar-primary hover:bg-sidebar-primary/90 transition-colors text-sm font-medium text-sidebar-primary-foreground`}
          title={!isOpen ? "Logout" : ""}
        >
          <IoIosLogOut size={18} />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  const MobileMenu = () => (
    <div
      className={`fixed inset-0 z-30 bg-black/30 backdrop-blur-lg border border-white/10 shadow-lg rounded-2xl transition-opacity duration-300 ${
        isMobileMenuOpen
          ? "bg-opacity-50 opacity-100"
          : "bg-opacity-0 opacity-0 pointer-events-none"
      } md:hidden`}
      onClick={toggleMobileMenu}
    >
      <div
        className={`absolute left-0 top-0 h-full w-64 bg-sidebar backdrop-blur-2xl shadow-lg transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          <h1 className="text-lg font-bold text-sidebar-foreground">
            Inventory
          </h1>
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-full hover:bg-sidebar-accent transition-colors"
          >
            <IoIosClose size={24} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="py-4 space-y-1 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.link;
            return (
              <Link
                key={item.link}
                href={item.link}
                onClick={toggleMobileMenu}
                className={`flex text-sidebar-foreground items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                    : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <div
                  className={`${
                    isActive
                      ? "text-sidebar-primary-foreground"
                      : "text-sidebar-foreground"
                  }`}
                >
                  {item.icon}
                </div>
                <span className="text-sm whitespace-nowrap">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-sidebar-border">
          <button
            onClick={() => {
              logout();
              toggleMobileMenu();
            }}
            className="flex items-center justify-start gap-2 w-full py-2 px-4 rounded-lg bg-sidebar-primary hover:bg-sidebar-primary/90 transition-colors text-sm font-medium text-sidebar-primary-foreground"
          >
            <IoIosLogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );

  const MobileBottomNav = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-sidebar border-t border-sidebar-border z-20 md:hidden">
      <div className="flex justify-around overflow-x-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.link;
          return (
            <Link
              key={item.link}
              href={item.link}
              className={`flex flex-col items-center py-2 px-1 w-full ${
                isActive ? "text-sidebar-primary" : "text-sidebar-foreground"
              }`}
            >
              <div className="text-center">
                {item.mobileIcon}
                <span className="text-xs mt-1">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileMenu />
      <MobileBottomNav />
    </>
  );
}

export default Navbar;
