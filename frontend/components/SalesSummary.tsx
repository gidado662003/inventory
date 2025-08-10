import React from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { SalesSummary as SalesSummaryType } from "@/types/sales";

interface SalesSummaryProps {
  summary: SalesSummaryType;
  onCalculate: () => void;
  trigger: React.ReactNode;
}

export const SalesSummary: React.FC<SalesSummaryProps> = ({
  summary,
  onCalculate,
  trigger,
}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div onClick={onCalculate}>{trigger}</div>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold text-gray-800 mb-2">
            Sales Summary Report
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription className="space-y-3 text-gray-700">
          <div className="flex justify-between items-center border-b pb-2">
            <span className="font-medium">Cash at hand:</span>
            <span className="font-semibold">
              ₦{summary.cash.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center border-b pb-2">
            <span className="font-medium">Transfer:</span>
            <span className="font-semibold">
              ₦{summary.transfer.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center border-b pb-2">
            <span className="font-medium">Unpaid:</span>
            <span className="font-semibold">
              ₦{summary.unpaid.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="font-bold">Total:</span>
            <span className="text-lg font-bold text-blue-600">
              ₦{summary.total.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="font-bold">Total Sales:</span>
            <span className="text-lg font-bold text-blue-600">
              {summary.totalSales.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="font-bold">Partial:</span>
            <span className="text-lg font-bold text-blue-600">
              ₦{summary.partial.toLocaleString()}
            </span>
          </div>
        </AlertDialogDescription>
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 transition-colors">
            Close
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
