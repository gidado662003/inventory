"use client";

import { TopBar } from "@/components/TopBar";
import SalesSpreadsheet from "@/components/temp";

export default function Sales() {
  return (
    <>
      <TopBar />
      <div className="p-6">
        <SalesSpreadsheet />
      </div>
    </>
  );
}
