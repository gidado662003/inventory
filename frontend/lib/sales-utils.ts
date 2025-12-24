import { CellBase, Matrix } from "react-spreadsheet";
import { SalesSummary } from "@/types/sales";

export const getCurrentTime = (): string => {
  const now = new Date();
  return now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export const parseAmount = (val: any): number => {
  if (typeof val === "string") {
    return Number(val.replace(/[₦,]/g, "")) || 0;
  }
  return typeof val === "number" ? val : 0;
};

export const calculateSalesSummary = (
  data: Matrix<CellBase<any>>
): SalesSummary => {
  const cash = data
    .slice(1)
    .filter((row) => row[5]?.value === "Cash")
    .reduce((acc, row) => acc + parseAmount(row[4]?.value), 0);

  const transfer = data
    .slice(1)
    .filter((row) => row[5]?.value === "Transfer")
    .reduce((acc, row) => acc + parseAmount(row[4]?.value), 0);

  const outstanding = data
    .slice(1)
    .filter(
      (row) =>
        row[5]?.value?.toLowerCase() === "outstanding" ||
        row[5]?.value === "Unpaid"
    )
    .reduce((acc, row) => acc + parseAmount(row[4]?.value), 0);

  const partial = data
    .slice(1)
    .filter((row) => row[5]?.value === "Partial")
    .reduce((acc, row) => acc + parseAmount(row[4]?.value), 0);

  const total = cash + transfer + outstanding + partial;

  // Calculate total sales (quantity)
  const header = data[0];
  const quantityColIndex = header.findIndex(
    (item) => item?.value === "Quantity"
  );
  const totalSales =
    quantityColIndex !== -1
      ? data.slice(1).reduce((acc, row) => {
          const val = row[quantityColIndex]?.value;
          return (
            acc + (typeof val === "string" ? Number(val) : Number(val) || 0)
          );
        }, 0)
      : 0;

  return {
    cash,
    transfer,
    outstanding,
    partial,
    total,
    totalSales,
  };
};

export const formatCurrency = (amount: number): string => {
  return `₦${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
  })}`;
};

export const validateStockAvailability = (
  itemData: any,
  requestedQuantity: number
): { isValid: boolean; message?: string } => {
  if (!itemData) {
    return { isValid: false, message: "Item not found" };
  }

  if (itemData.quantity < requestedQuantity) {
    return {
      isValid: false,
      message: `Not enough stock. Only ${itemData.quantity} available.`,
    };
  }

  return { isValid: true };
};
