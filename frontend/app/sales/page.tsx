import { TopBar } from "@/components/TopBar";
import SalesSpreadsheet from "@/components/SalesSpreadsheet";

export default function Sales() {
  return (
    <>
      <TopBar />
      <div className="py-2">
        <SalesSpreadsheet />
      </div>
    </>
  );
}
