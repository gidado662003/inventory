"use client";

import dynamic from "next/dynamic";

const Navbar = dynamic(() => import("@/components/navbar"));

export default Navbar;
