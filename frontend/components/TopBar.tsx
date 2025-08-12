"use client";

import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "@/app/context";
import { useMediaQuery } from "@uidotdev/usehooks";
import Image from "next/image";

export const TopBar = () => {
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
  const now = new Date();
  const { user } = useAuth();

  return (
    <div className="flex items-center justify-between bg-white px-6 py-4 border-b border-gray-200 shadow-sm">
      <div className="text-sm font-medium text-gray-700 flex items-center gap-2">
        {isSmallDevice && (
          <Image src="/logo.svg" alt="logo" width={50} height={50} />
        )}
        <p>{now.toDateString()}</p>
      </div>
      <div className="flex items-center gap-4">
        <FaUserCircle className="text-2xl text-gray-600 cursor-pointer" />
        <p className="text-sm font-medium text-gray-700">{user?.username}</p>
      </div>
    </div>
  );
};
