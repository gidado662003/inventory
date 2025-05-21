"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CiHome } from "react-icons/ci";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { FcSalesPerformance } from "react-icons/fc";
import { RiCustomerService2Line } from "react-icons/ri";
import { TbReport } from "react-icons/tb";
import { IoIosMenu, IoIosLogOut } from "react-icons/io";

function Navbar() {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();

  const navItems = [
    {
      name: "Dashboard",
      link: "/dashboard",
      icon: <CiHome className="min-w-[24px]" size={24} />,
    },
    {
      name: "Products",
      link: "/products",
      icon: (
        <MdOutlineProductionQuantityLimits className="min-w-[24px]" size={24} />
      ),
    },
    {
      name: "Sales",
      link: "/sales",
      icon: <FcSalesPerformance className="min-w-[24px]" size={24} />,
    },
    {
      name: "Customers",
      link: "/customers",
      icon: <RiCustomerService2Line className="min-w-[24px]" size={24} />,
    },
    {
      name: "Reports",
      link: "/reports",
      icon: <TbReport className="min-w-[24px]" size={24} />,
    },
  ];

  return (
    <div
      className={`z-10 bg-[#1a1a1a] text-white flex flex-col border-r border-[#2a2a2a] shadow-lg transition-all duration-200 ${
        isOpen ? "w-60" : "w-20"
      } h-full`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#2a2a2a]">
        {isOpen && (
          <h1 className="text-lg font-bold whitespace-nowrap">Inventory</h1>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-full hover:bg-[#2a2a2a] transition-colors"
          aria-label={isOpen ? "Collapse menu" : "Expand menu"}
        >
          <IoIosMenu size={24} />
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto py-4 space-y-1 px-2">
        {navItems.map((item, index) => {
          const isActive = pathname === item.link;

          return (
            <Link
              key={index}
              href={item.link}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-red-600 text-white shadow-md"
                  : "hover:bg-[#2a2a2a] hover:text-red-400"
              }`}
              title={!isOpen ? item.name : ""}
            >
              <div className={`${isActive ? "text-white" : "text-gray-300"}`}>
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
      <div className="p-4 border-t border-[#2a2a2a]">
        {isOpen ? (
          <button className="flex items-center justify-center gap-2 w-full py-2 px-4 rounded-lg bg-red-600 hover:bg-red-700 transition-colors text-sm font-medium">
            <IoIosLogOut size={18} />
            Logout
          </button>
        ) : (
          <button
            title="Logout"
            className="flex items-center justify-center w-full py-2 px-4 rounded-lg bg-red-600 hover:bg-red-700 transition-colors"
          >
            <IoIosLogOut size={18} />
          </button>
        )}
      </div>
    </div>
  );
}

export default Navbar;
