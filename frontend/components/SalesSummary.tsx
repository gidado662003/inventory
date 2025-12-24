import React, { useState, useEffect } from "react";
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
import { getReport } from "@/app/api";
import { format, parseISO } from "date-fns";
import { FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SalesSummaryProps {
  summary: SalesSummaryType;
  onCalculate: () => void;
  trigger: React.ReactNode;
}

interface ReportData {
  date: string;
  items: Array<{
    name: string;
    quantity: number;
    salePrice: number;
    paymentType: string;
  }>;
}

export const SalesSummary: React.FC<SalesSummaryProps> = ({
  summary,
  onCalculate,
  trigger,
}) => {
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const today = new Date();
      const todayStr = today.toISOString().split("T")[0];
      const response = await getReport(todayStr, todayStr + "T23:59:59");
      setReportData(response);
    } catch (error) {
      console.error("Failed to fetch report data:", error);
    } finally {
      setLoading(false);
    }
  };

  const flatItems = reportData.flatMap((sale) =>
    sale.items.map((item) => ({
      ...item,
      date: sale.date,
    }))
  );

  // Calculate enhanced metrics
  const totalRevenue = flatItems.reduce(
    (acc, item) => acc + item.quantity * item.salePrice,
    0
  );
  const totalQuantity = flatItems.reduce((acc, item) => acc + item.quantity, 0);
  const averageSale =
    flatItems.length > 0 ? totalRevenue / flatItems.length : 0;
  const averageItemPrice =
    flatItems.length > 0
      ? flatItems.reduce((acc, item) => acc + item.salePrice, 0) /
        flatItems.length
      : 0;

  // Top products
  const productSales = flatItems.reduce((acc, item) => {
    if (!acc[item.name]) {
      acc[item.name] = { quantity: 0, revenue: 0 };
    }
    acc[item.name].quantity += item.quantity;
    acc[item.name].revenue += item.quantity * item.salePrice;
    return acc;
  }, {} as Record<string, { quantity: number; revenue: number }>);

  const topProducts = Object.entries(productSales)
    .map(([name, data]) => ({
      name,
      quantity: data.quantity,
      revenue: data.revenue,
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const safeFormatDate = (dateStr: string) => {
    try {
      // Handle both ISO strings and Date objects
      const date =
        typeof dateStr === "string" ? parseISO(dateStr) : new Date(dateStr);
      return format(date, "yyyy-MM-dd");
    } catch (error) {
      return dateStr;
    }
  };

  const exportToCSV = () => {
    const headers = [
      "Date",
      "Product",
      "Quantity",
      "Unit Price",
      "Total",
      "Payment Type",
    ];
    const csvContent = [
      headers.join(","),
      ...flatItems.map((item) => {
        let formattedDate = item.date;
        try {
          formattedDate = format(parseISO(item.date), "yyyy-MM-dd");
        } catch (e) {
          formattedDate = item.date;
        }
        return [
          `"${formattedDate}"`,
          `"${item.name}"`,
          item.quantity,
          item.salePrice.toFixed(2),
          (item.quantity * item.salePrice).toFixed(2),
          `"${item.paymentType}"`,
        ].join(",");
      }),
      ["Summary", "", totalQuantity, "", totalRevenue.toFixed(2), ""].join(","),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const today = new Date().toISOString().split("T")[0];
    link.setAttribute("download", `sales-report-${today}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div onClick={onCalculate}>{trigger}</div>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-5xl max-h-[90vh] overflow-auto rounded-xl border border-border bg-card p-6 shadow-xl">
        <AlertDialogHeader>
          <div className="flex justify-between items-center mb-4">
            <AlertDialogTitle className="text-2xl font-bold text-card-foreground">
              Enhanced Sales Summary Report
            </AlertDialogTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={exportToCSV}
                className="flex items-center gap-2"
              >
                <FileSpreadsheet className="h-4 w-4" />
                CSV
              </Button>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogDescription className="space-y-6 text-foreground">
          {loading ? (
            <div className="text-center py-8">Loading report data...</div>
          ) : (
            <>
              {/* Key Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    Cash at Hand
                  </p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    ₦{summary.cash.toLocaleString()}
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">
                    Transfer
                  </p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    ₦{summary.transfer.toLocaleString()}
                  </p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    Outstanding
                  </p>
                  <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                    ₦{summary.outstanding.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Total Revenue and Sales */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-4 rounded-lg border border-primary/20">
                  <p className="text-sm font-medium text-foreground">
                    Total Revenue
                  </p>
                  <p className="text-3xl font-bold text-primary">
                    ₦{summary.total.toLocaleString()}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 p-4 rounded-lg border border-secondary/20">
                  <p className="text-sm font-medium text-foreground">
                    Total Items Sold
                  </p>
                  <p className="text-3xl font-bold ">
                    {summary.totalSales.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Top Products List */}
              {topProducts.length > 0 && (
                <div className="bg-card border border-border p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Top Products</h3>
                  <div className="space-y-2">
                    {topProducts.map((product, index) => (
                      <div
                        key={product.name}
                        className="flex justify-between items-center p-2 bg-muted/50 rounded"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-muted-foreground">
                            #{index + 1}
                          </span>
                          <span className="font-medium">{product.name}</span>
                        </div>
                        <div className="flex gap-4 text-sm">
                          <span className="text-muted-foreground">
                            Qty: {product.quantity}
                          </span>
                          <span className="font-semibold">
                            ₦{product.revenue.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </AlertDialogDescription>
        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel className="px-4 py-2 border border-border rounded-md bg-background text-foreground hover:bg-muted transition-colors">
            Close
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
