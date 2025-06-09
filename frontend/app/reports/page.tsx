"use client";
import React, { useState, useEffect } from "react";
import { getReport } from "../api";
import { ClipLoader } from "react-spinners";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format, subDays, parseISO } from "date-fns";
import { Download } from "lucide-react";

interface ReportItem {
  date: string;
  _id: string;
  name: string;
  quantity: number;
  salePrice: number;
  total: number;
  category?: string;
}

type TimeRange = "today" | "week" | "month" | "custom";

interface ChartDataPoint {
  date: string;
  total: number;
  count: number;
}

function Report() {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [calendarOpen, setCalendarOpen] = useState<"start" | "end" | null>(
    null
  );
  const [report, setReport] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [timeRange, setTimeRange] = useState<TimeRange>("week");
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

  // Set default date range based on timeRange selection
  useEffect(() => {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    switch (timeRange) {
      case "today":
        setStartDate(todayStr);
        setEndDate(todayStr);
        break;
      case "week":
        setStartDate(format(subDays(today, 7), "yyyy-MM-dd"));
        setEndDate(todayStr);
        break;
      case "month":
        setStartDate(format(subDays(today, 30), "yyyy-MM-dd"));
        setEndDate(todayStr);
        break;
      case "custom":
        // Keep existing dates when custom is selected
        break;
    }
  }, [timeRange]);

  // Process report data for chart
  useEffect(() => {
    if (report.length > 0) {
      const dailySales = report.reduce((acc, item) => {
        const date = format(parseISO(item.date), "MMM dd");
        if (!acc[date]) {
          acc[date] = { date, total: 0, count: 0 };
        }
        acc[date].total += item.quantity * item.salePrice;
        acc[date].count += item.quantity;
        return acc;
      }, {} as Record<string, ChartDataPoint>);

      setChartData(Object.values(dailySales));
    }
  }, [report]);

  const handleGetReport = async () => {
    if (!startDate || !endDate) return;

    setLoading(true);
    try {
      const response = await getReport(startDate, endDate + "T23:59:59");
      const flatItems = response.flatMap(
        (item: { date: string; items: ReportItem[] }) =>
          item.items.map((i: ReportItem) => ({
            ...i,
            date: item.date,
          }))
      );
      setReport(flatItems);
      setOpen(true);
    } catch (error) {
      console.error("Failed to fetch report", error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = ["Date", "Product", "Quantity", "Unit Price", "Total"];
    const csvContent = [
      headers.join(","),
      ...report.map((item) =>
        [
          `"${format(parseISO(item.date), "yyyy-MM-dd")}"`,
          `"${item.name}"`,
          item.quantity,
          item.salePrice.toFixed(2),
          (item.quantity * item.salePrice).toFixed(2),
        ].join(",")
      ),
      [
        "Summary",
        "",
        report.reduce((acc, item) => acc + item.quantity, 0),
        "",
        report
          .reduce((acc, item) => acc + item.quantity * item.salePrice, 0)
          .toFixed(2),
      ].join(","),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `sales-report-${startDate}-to-${endDate}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalSales = report.reduce(
    (acc, item) => acc + item.quantity * item.salePrice,
    0
  );
  const totalItems = report.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Sales Analytics</h1>
        <div className="flex items-center space-x-2">
          <Select
            value={timeRange}
            onValueChange={(value) => setTimeRange(value as TimeRange)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <div>
            <label
              htmlFor="start-date"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Start Date
            </label>
            <div className="relative">
              <input
                id="start-date"
                type="date"
                className="w-full px-3 py-2 border rounded-md"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setTimeRange("custom");
                }}
                aria-label="Start Date"
                title="Start Date"
                placeholder="Select start date"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="end-date"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              End Date
            </label>
            <div className="relative">
              <input
                id="end-date"
                type="date"
                className="w-full px-3 py-2 border rounded-md"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setTimeRange("custom");
                }}
                aria-label="End Date"
                title="End Date"
                placeholder="Select end date"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-6 space-x-4">
        <Button
          onClick={handleGetReport}
          disabled={loading || !startDate || !endDate}
          className="px-6 py-2"
        >
          {loading ? (
            <ClipLoader color="#ffffff" size={20} />
          ) : (
            "Generate Report"
          )}
        </Button>
      </div>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="max-w-6xl max-h-[90vh] overflow-auto">
          <AlertDialogHeader>
            <div className="flex justify-between items-center">
              <AlertDialogTitle className="text-2xl font-bold text-gray-800">
                Sales Report ({startDate} to {endDate})
              </AlertDialogTitle>
              <Button
                variant="outline"
                onClick={exportToCSV}
                className="flex items-center gap-2"
              >
                <Download size={16} />
                Export CSV
              </Button>
            </div>
          </AlertDialogHeader>

          {report.length > 0 ? (
            <>
              <div className="flex justify-between gap-4 mb-6">
                <div className="bg-blue-50 p-4 w-full rounded-lg">
                  <h3 className="text-sm font-medium text-blue-800">
                    Total Sales
                  </h3>
                  <p className="text-2xl font-bold text-blue-600">
                    ₦{totalSales.toFixed(2)}
                  </p>
                </div>
                <div className="bg-green-50 p-4 w-full  text-center rounded-lg">
                  <h3 className="text-sm font-medium text-green-800">
                    Quantity Sold
                  </h3>
                  <p className="text-2xl font-bold text-green-600">
                    {totalItems}
                  </p>
                </div>
              </div>

              <div className="h-80 mb-8">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [`₦${value}`, "Total Sales"]}
                    />
                    <Legend />
                    <Bar
                      dataKey="total"
                      name="Daily Sales"
                      fill="#8884d8"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="border rounded-lg overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Qty
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Unit Price
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {report.map((item) => (
                        <tr
                          key={item._id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-3 whitespace-nowrap">
                            {format(parseISO(item.date), "MMM dd, yyyy")}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {item.name}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right">
                            ₦{item.salePrice.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right">
                            ₦{(item.quantity * item.salePrice).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-gray-50 font-semibold">
                        <td className="px-4 py-3">Summary</td>
                        <td className="px-4 py-3"></td>
                        <td className="px-4 py-3 text-right">{totalItems}</td>
                        <td className="px-4 py-3"></td>
                        <td className="px-4 py-3 text-right">
                          ₦{totalSales.toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="py-12 text-center">
              <svg
                className="mx-auto h-16 w-16 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                No sales data found
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                No records were found for the selected date range. Try adjusting
                your filters.
              </p>
            </div>
          )}
          <div className="mt-6 flex justify-end">
            <AlertDialogCancel className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800">
              Close Report
            </AlertDialogCancel>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default Report;
