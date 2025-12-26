import { useState, useEffect, useCallback } from "react";
import { CellBase, Matrix } from "react-spreadsheet";
import { getProducts, createSale, getSales, getCustomers } from "@/app/api";
import { CustomToast } from "@/components/CustomToast";
import { useAuth } from "@/app/context";
import { Item, CartItem, SalesSummary } from "@/types/sales";
import { Customer } from "@/types/customer";
import {
  getCurrentTime,
  calculateSalesSummary,
  validateStockAvailability,
} from "@/lib/sales-utils";

const INITIAL_SPREADSHEET_DATA: Matrix<CellBase<any>> = [
  [
    { value: "Time", readOnly: true },
    { value: "Item", readOnly: true },
    { value: "Quantity", readOnly: true },
    { value: "Price", readOnly: true },
    { value: "Total", readOnly: true },
    { value: "Payment Type", readOnly: true },
    { value: "Customer", readOnly: true },
  ],
];

export const useSales = () => {
  const { user } = useAuth();
  const [itemOptions, setItemOptions] = useState<Item[]>([]);
  const [data, setData] = useState<Matrix<CellBase<any>>>(
    INITIAL_SPREADSHEET_DATA
  );
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [salesSummary, setSalesSummary] = useState<SalesSummary>({
    cash: 0,
    transfer: 0,
    outstanding: 0,
    partial: 0,
    total: 0,
    totalSales: 0,
  });

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customersData, products, sales] = (await Promise.all([
          getCustomers(),
          getProducts(),
          getSales(),
        ])) as [Customer[], Item[], any[]];

        setItemOptions(products);
        setCustomers(customersData);

        // Process sales data for spreadsheet
        const newRows: Matrix<CellBase<any>> = [];
        sales.forEach((sale: any) => {
          const saleTime = sale.date
            ? new Date(sale.date).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })
            : getCurrentTime();

          sale.items.forEach((item: any) => {
            const getCustomer = customersData.find(
              (customer) => customer._id === sale.customerName
            );
            const name = getCustomer ? getCustomer?.customerName : "complete";
            newRows.push([
              { value: saleTime },
              { value: item.name },
              { value: item.quantity },
              { value: `₦${item.salePrice.toFixed(2)}` },
              { value: `₦${(item.quantity * item.salePrice).toFixed(2)}` },
              { value: item.paymentType },
              { value: name },
            ]);
          });
        });

        setData([...INITIAL_SPREADSHEET_DATA, ...newRows]);
      } catch (error) {
        console.error("Error fetching data:", error);
        CustomToast({
          message: "Error Loading Data",
          description: "Failed to load products, customers, or sales data",
          type: "error",
        });
      }
    };

    fetchData();
  }, []);

  // Calculate summary when data changes
  useEffect(() => {
    const summary = calculateSalesSummary(data);
    setSalesSummary(summary);
  }, [data]);

  const addToCart = useCallback(
    (selectedItem: string, quantity: string, paymentType: string) => {
      if (!selectedItem || !quantity || parseInt(quantity) <= 0) return;

      const itemData = itemOptions.find((item) => item.name === selectedItem);
      const validation = validateStockAvailability(
        itemData,
        parseInt(quantity)
      );

      if (!validation.isValid) {
        CustomToast({
          message: "Stock Error",
          description: validation.message || "Invalid item or quantity",
          type: "error",
        });
        return;
      }

      // Update item options (reduce stock)
      setItemOptions((prev) =>
        prev.map((item) =>
          item.name === selectedItem
            ? { ...item, quantity: item.quantity - parseInt(quantity) }
            : item
        )
      );

      // Update cart
      setCart((prevCart) => {
        const existingIndex = prevCart.findIndex(
          (item) => item.name === selectedItem
        );
        const updatedCart = [...prevCart];

        if (existingIndex >= 0) {
          updatedCart[existingIndex].quantity += parseInt(quantity);
        } else {
          updatedCart.push({
            id: itemData!._id,
            name: itemData!.name,
            salePrice: itemData!.salePrice,
            quantity: parseInt(quantity),
            paymentType,
            customer: "",
          });
        }

        return updatedCart;
      });
    },
    [itemOptions]
  );

  const removeFromCart = useCallback((index: number) => {
    setCart((prev) => prev.filter((_, idx) => idx !== index));
  }, []);

  const updateCartPaymentType = useCallback((paymentType: string) => {
    setCart((prev) => prev.map((item) => ({ ...item, paymentType })));
  }, []);

  const createNewSale = useCallback(
    async (customer: string, amountPaid: number) => {
      if (cart.length === 0) return;

      const hasPartialPayment = cart.some(
        (item) => item.paymentType === "Partial"
      );

      if (hasPartialPayment && (!customer || customer.trim() === "")) {
        CustomToast({
          message: "Customer Required",
          description: "Please select a customer for partial payments",
          type: "error",
        });
        return;
      }

      const sale = {
        items: cart.map((item) => ({
          product: item.id,
          name: item.name,
          salePrice: item.salePrice,
          quantity: item.quantity,
          paymentType: item.paymentType,
          soldBy: user?.username,
        })),
        customerName: customer,
        amountPaid: amountPaid,
      };

      try {
        await createSale(sale);
        setCart([]);

        // Refresh spreadsheet data
        const sales = await getSales();
        const newRows: Matrix<CellBase<any>> = [];
        sales.forEach((sale: any) => {
          const saleTime = sale.date
            ? new Date(sale.date).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })
            : getCurrentTime();

          const getCustomer = customers.find(
            (cust) => cust._id === sale.customerName
          );
          const customerName = getCustomer
            ? getCustomer.customerName
            : "complete";

          sale.items.forEach((item: any) => {
            newRows.push([
              { value: saleTime },
              { value: item.name },
              { value: item.quantity },
              { value: `₦${item.salePrice.toFixed(2)}` },
              { value: `₦${(item.quantity * item.salePrice).toFixed(2)}` },
              { value: item.paymentType },
              { value: customerName },
            ]);
          });
        });
        setData([...INITIAL_SPREADSHEET_DATA, ...newRows]);

        CustomToast({
          message: "Sale Created Successfully",
          description: "The sale has been recorded",
          type: "success",
        });
      } catch (error) {
        console.error("Error creating sale:", error);
        CustomToast({
          message: "Error Creating Sale",
          description: "Failed to create sale",
          type: "error",
        });
      }
    },
    [cart, user?.username]
  );

  const calculateTotals = useCallback(() => {
    const summary = calculateSalesSummary(data);
    setSalesSummary(summary);
  }, [data]);

  return {
    // State
    itemOptions,
    data,
    setData,
    cart,
    customers,
    setCustomers,
    salesSummary,

    // Actions
    addToCart,
    removeFromCart,
    updateCartPaymentType,
    createNewSale,
    calculateTotals,
  };
};
