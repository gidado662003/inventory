"use client";

import React, { useState, useEffect } from "react";
import { TopBar } from "@/components/TopBar";
import { getSales, getProducts, getCustomers, getReport } from "../api";
import { format, subDays, parseISO } from "date-fns";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
} from "lucide-react";
import { ClipLoader } from "react-spinners";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Sale {
  _id: string;
  date: string;
  items: Array<{
    name: string;
    quantity: number;
    salePrice: number;
    paymentType: string;
  }>;
  customerName?: string;
}

interface Product {
  _id: string;
  name: string;
  quantity: number;
  salePrice: number;
}

interface Customer {
  _id: string;
  customerName: string;
  amountOwed?: number;
}

type TimeRange = "today" | "week" | "month" | "year";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>("week");
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

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
      case "year":
        setStartDate(format(subDays(today, 365), "yyyy-MM-dd"));
        setEndDate(todayStr);
        break;
    }
  }, [timeRange]);

  useEffect(() => {
    fetchDashboardData();
  }, [startDate, endDate]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [salesData, productsData, customersData] = await Promise.all([
        getReport(startDate, endDate + "T23:59:59"),
        getProducts(),
        getCustomers(),
      ]);

      setSales(salesData);
      setProducts(productsData);
      setCustomers(customersData);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate metrics
  const flatItems = sales.flatMap((sale) =>
    sale.items.map((item) => ({
      ...item,
      date: sale.date,
    }))
  );

  const totalRevenue = flatItems.reduce(
    (acc, item) => acc + item.quantity * item.salePrice,
    0
  );

  const totalItemsSold = flatItems.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  const totalTransactions = sales.length;

  const averageTransactionValue =
    totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

  // Payment type breakdown
  const paymentBreakdown = flatItems.reduce((acc, item) => {
    const amount = item.quantity * item.salePrice;
    const type = item.paymentType || "Unknown";
    if (!acc[type]) {
      acc[type] = 0;
    }
    acc[type] += amount;
    return acc;
  }, {} as Record<string, number>);

  const paymentChartData = Object.entries(paymentBreakdown).map(
    ([name, value]) => ({
      name,
      value: Math.round(value),
    })
  );

  // Daily sales trend
  const dailySales = sales.reduce((acc, sale) => {
    const date = format(parseISO(sale.date), "MMM dd");
    if (!acc[date]) {
      acc[date] = { date, revenue: 0, transactions: 0 };
    }
    const revenue = sale.items.reduce(
      (sum, item) => sum + item.quantity * item.salePrice,
      0
    );
    acc[date].revenue += revenue;
    acc[date].transactions += 1;
    return acc;
  }, {} as Record<string, { date: string; revenue: number; transactions: number }>);

  const dailySalesData = Object.values(dailySales).sort((a, b) =>
    a.date.localeCompare(b.date)
  );

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

  // Low stock products
  const lowStockProducts = products.filter((p) => p.quantity < 10);

  // Total customers with outstanding payments
  const customersWithDebt = customers.filter(
    (c) => c.amountOwed && c.amountOwed > 0
  );
  const outstanding = customersWithDebt.reduce(
    (acc, c) => acc + (c.amountOwed || 0),
    0
  );

  // Calculate growth (comparing current period with previous period)
  const getPreviousPeriodData = async () => {
    const today = new Date();
    let prevStartDate = "";
    let prevEndDate = "";

    switch (timeRange) {
      case "today":
        prevStartDate = format(subDays(today, 1), "yyyy-MM-dd");
        prevEndDate = format(subDays(today, 1), "yyyy-MM-dd");
        break;
      case "week":
        prevStartDate = format(subDays(today, 14), "yyyy-MM-dd");
        prevEndDate = format(subDays(today, 7), "yyyy-MM-dd");
        break;
      case "month":
        prevStartDate = format(subDays(today, 60), "yyyy-MM-dd");
        prevEndDate = format(subDays(today, 30), "yyyy-MM-dd");
        break;
      case "year":
        prevStartDate = format(subDays(today, 730), "yyyy-MM-dd");
        prevEndDate = format(subDays(today, 365), "yyyy-MM-dd");
        break;
    }

    try {
      const prevSales = await getReport(
        prevStartDate,
        prevEndDate + "T23:59:59"
      );
      const prevFlatItems = prevSales.flatMap((sale: Sale) =>
        sale.items.map((item) => ({
          ...item,
          date: sale.date,
        }))
      );
      const prevRevenue = prevFlatItems.reduce(
        (acc: number, item: any) => acc + item.quantity * item.salePrice,
        0
      );
      return prevRevenue;
    } catch (error) {
      return 0;
    }
  };

  const [revenueGrowth, setRevenueGrowth] = useState<number>(0);
  const [prevRevenue, setPrevRevenue] = useState<number>(0);

  useEffect(() => {
    const calculateGrowth = async () => {
      const prevRev = await getPreviousPeriodData();
      setPrevRevenue(prevRev);
      if (prevRev > 0) {
        const growth = ((totalRevenue - prevRev) / prevRev) * 100;
        setRevenueGrowth(growth);
      }
    };
    calculateGrowth();
  }, [totalRevenue, timeRange]);

  if (loading) {
    return (
      <>
        <TopBar />
        <div className="flex justify-center items-center h-screen">
          <ClipLoader size={40} color="#ef4444" />
        </div>
      </>
    );
  }

  return (
    <>
      <TopBar />
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Overview of your business performance
              </p>
            </div>
            <div className="flex items-center gap-3">
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
                  <SelectItem value="year">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Total Revenue"
              value={totalRevenue}
              icon={<DollarSign className="h-5 w-5" />}
              trend={revenueGrowth}
              format="currency"
              color="blue"
            />
            <MetricCard
              title="Items Sold"
              value={totalItemsSold}
              icon={<ShoppingCart className="h-5 w-5" />}
              format="number"
              color="green"
            />
            <MetricCard
              title="Transactions"
              value={totalTransactions}
              icon={<Package className="h-5 w-5" />}
              format="number"
              color="purple"
            />
            <MetricCard
              title="Avg. Transaction"
              value={averageTransactionValue}
              icon={<TrendingUp className="h-5 w-5" />}
              format="currency"
              color="orange"
            />
          </div>

          {/* Secondary Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Products
                  </p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    {products.length}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Customers
                  </p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    {customers.length}
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                  <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Outstanding Payments
                  </p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    {/* ₦{totalOutstanding.toLocaleString()} */}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {customersWithDebt.length} customers
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Sales Trend */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Sales Trend
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={dailySalesData}>
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [
                      `₦${value.toLocaleString()}`,
                      "Revenue",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8884d8"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Payment Method Breakdown */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Payment Method Breakdown
              </h3>
              {paymentChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={paymentChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {paymentChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => `₦${value.toLocaleString()}`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                  No payment data available
                </div>
              )}
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Top Products */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Top 5 Products by Revenue
              </h3>
              {topProducts.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={topProducts}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis />
                      <Tooltip
                        formatter={(value) => `₦${value.toLocaleString()}`}
                      />
                      <Bar
                        dataKey="revenue"
                        fill="#8884d8"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {topProducts.map((product, index) => (
                      <div
                        key={product.name}
                        className="flex justify-between items-center p-2 bg-muted/50 rounded"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-muted-foreground w-6">
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
                </>
              ) : (
                <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                  No product data available
                </div>
              )}
            </div>

            {/* Low Stock Alerts */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                Low Stock Alerts
              </h3>
              {lowStockProducts.length > 0 ? (
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {lowStockProducts.map((product) => (
                    <div
                      key={product._id}
                      className="flex justify-between items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-foreground">
                          {product.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Only {product.quantity} units remaining
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                          ₦{product.salePrice.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                  All products are well stocked
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Recent Sales Activity
            </h3>
            {sales.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Date
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Items
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                        Total
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Payment
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sales.slice(0, 10).map((sale) => {
                      const total = sale.items.reduce(
                        (sum, item) => sum + item.quantity * item.salePrice,
                        0
                      );
                      const paymentTypes = [
                        ...new Set(sale.items.map((item) => item.paymentType)),
                      ];
                      return (
                        <tr
                          key={sale._id}
                          className="border-b border-border hover:bg-muted/50 transition-colors"
                        >
                          <td className="py-3 px-4 text-sm">
                            {format(parseISO(sale.date), "MMM dd, yyyy HH:mm")}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            {sale.items.length} item(s)
                          </td>
                          <td className="py-3 px-4 text-sm text-right font-semibold">
                            ₦{total.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            <div className="flex flex-wrap gap-1">
                              {paymentTypes.map((type) => (
                                <span
                                  key={type}
                                  className="px-2 py-1 bg-primary/10 text-primary text-xs rounded"
                                >
                                  {type}
                                </span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No recent sales activity
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

interface MetricCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend?: number;
  format?: "currency" | "number";
  color?: "blue" | "green" | "purple" | "orange";
}

function MetricCard({
  title,
  value,
  icon,
  trend,
  format = "number",
  color = "blue",
}: MetricCardProps) {
  const colorClasses = {
    blue: "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400",
    green: "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400",
    purple:
      "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400",
    orange:
      "bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400",
  };

  const formattedValue =
    format === "currency"
      ? `₦${value.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      : value.toLocaleString();

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>{icon}</div>
      </div>
      <div className="flex items-end justify-between">
        <p className="text-2xl font-bold text-foreground">{formattedValue}</p>
        {trend !== undefined && (
          <div
            className={`flex items-center gap-1 text-sm ${
              trend >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {trend >= 0 ? (
              <ArrowUpRight className="h-4 w-4" />
            ) : (
              <ArrowDownRight className="h-4 w-4" />
            )}
            <span>{Math.abs(trend).toFixed(1)}%</span>
          </div>
        )}
      </div>
    </div>
  );
}
