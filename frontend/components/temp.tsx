"use client";

import React, { useEffect, useState } from "react";
import Spreadsheet, { CellBase, Matrix } from "react-spreadsheet";
import { AiOutlineDelete } from "react-icons/ai";
import { getProducts, createSale, getSales } from "@/app/api";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

// Type Definitions
type Item = {
  _id: string;
  name: string;
  salePrice: number;
  quantity: number;
};

type CartItem = {
  id: string;
  name: string;
  salePrice: number;
  quantity: number;
  paymentType: string;
};

const getCurrentTime = (): string => {
  const now = new Date();
  return now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const SalesSpreadsheet = () => {
  const [itemOptions, setItemOptions] = useState<Item[]>([]);
  const [data, setData] = useState<Matrix<CellBase<any>>>([
    [
      { value: "Time", readOnly: true },
      { value: "Item", readOnly: true },
      { value: "Quantity", readOnly: true },
      { value: "Price", readOnly: true },
      { value: "Total", readOnly: true },
      { value: "Payment Type", readOnly: true },
    ],
  ]);
  const [cash, setCash] = useState(0);
  const [transfer, setTransfer] = useState(0);
  const [unpaid, setUnpaid] = useState(0);
  const [total, setTotal] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  function calculateTotals() {
    const parseAmount = (val: any): number => {
      if (typeof val === "string") {
        return Number(val.replace(/[₦,]/g, "")) || 0;
      }
      return typeof val === "number" ? val : 0;
    };

    const cash = data
      .slice(1)
      .filter((row) => row[5]?.value === "Cash")
      .reduce((acc, row) => acc + parseAmount(row[4]?.value), 0);

    const transfer = data
      .slice(1)
      .filter((row) => row[5]?.value === "Transfer")
      .reduce((acc, row) => acc + parseAmount(row[4]?.value), 0);

    const unpaid = data
      .slice(1)
      .filter((row) => row[5]?.value === "Unpaid")
      .reduce((acc, row) => acc + parseAmount(row[4]?.value), 0);

    setCash(cash);
    setTransfer(transfer);
    setUnpaid(unpaid);
    setTotal(cash + transfer + unpaid);
  }

  useEffect(() => {
    const header = data[0];
    const priceColIndex = header.findIndex((item) => item?.value === "Total");
    const quantityColIndex = header.findIndex(
      (item) => item?.value === "Quantity"
    );

    if (priceColIndex !== -1 || quantityColIndex !== -1) {
      const priceData = data.slice(1).map((row) => {
        const val = row[priceColIndex]?.value;
        return typeof val === "string"
          ? Number(val.replace("₦", ""))
          : Number(val);
      });

      const totalPrice = priceData.reduce((acc, item) => acc + item, 0);

      const quantityData = data.slice(1).map((row) => {
        const val = row[quantityColIndex]?.value;
        return typeof val === "string"
          ? Number(val.replace("₦", ""))
          : Number(val);
      });

      const quantityPrice = quantityData.reduce((acc, item) => acc + item, 0);
      setTotalSales(quantityPrice);
    }
  }, [data]);

  useEffect(() => {
    const fetchSales = async () => {
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

        sale.items.forEach((item: any) => {
          newRows.push([
            { value: saleTime, readOnly: true },
            { value: item.name, readOnly: true },
            { value: item.quantity },
            { value: `₦${item.salePrice.toFixed(2)}` },
            { value: `₦${(item.quantity * item.salePrice).toFixed(2)}` },
            { value: item.paymentType },
          ]);
        });
      });
      setData((prev) => [...prev, ...newRows]);
    };

    fetchSales();
  }, []);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [quantity, setQuantity] = useState("");
  const [paymentType, setPaymentType] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      const products = await getProducts();
      setItemOptions(products);
    };
    fetchProducts();
  }, [data]);

  const handleAddToCart = () => {
    if (!selectedItem || !quantity || parseInt(quantity) <= 0) return;

    const itemData = itemOptions.find((item) => item.name === selectedItem);
    if (!itemData) return;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.name === selectedItem
      );
      const updatedCart = [...prevCart];

      if (existingIndex >= 0) {
        updatedCart[existingIndex].quantity += parseInt(quantity);
      } else {
        updatedCart.push({
          id: itemData._id,
          name: itemData.name,
          salePrice: itemData.salePrice,
          quantity: parseInt(quantity),
          paymentType,
        });
      }

      return updatedCart;
    });

    setSelectedItem("");
    setQuantity("");
    setPaymentType("");
  };

  const handleAddCartToSales = (): void => {
    if (cart.length === 0) return;

    const newRows = cart.map((item) => {
      const total = (item.quantity * item.salePrice).toFixed(2);
      return [
        { value: getCurrentTime() },
        { value: item.name },
        { value: item.quantity.toString() },
        { value: `₦${item.salePrice.toFixed(2)}` },
        { value: `₦${total}` },
        { value: paymentType },
      ];
    });

    setData((prev) => [...prev, ...newRows]);
    setCart([]);
  };

  const removeItemFromCart = (index: number) => {
    const updatedCart = cart.filter((_, idx) => idx !== index);
    setCart(updatedCart);
  };

  const totalAmount = cart.reduce(
    (acc, item) => acc + item.quantity * item.salePrice,
    0
  );
  const handleCreateSale = async () => {
    if (cart.length === 0) return;

    const sale = {
      items: cart.map((item) => ({
        product: item.id,
        name: item.name,
        salePrice: item.salePrice,
        quantity: item.quantity,
        paymentType: item.paymentType,
      })),
    };

    try {
      await createSale(sale);
      setCart([]); // Clear cart after successful sale
      setData((prev) => [...prev]); // Refresh the spreadsheet
    } catch (error) {
      console.error("Error creating sale:", error);
    }
  };
  return (
    <div className="bg-white p-6 rounded-xl shadow-md max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          🧾 Sales Spreadsheet
        </h2>
        <div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                onClick={calculateTotals}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Generate summary report
              </button>
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
                    ₦{cash.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-medium">Transfer:</span>
                  <span className="font-semibold">
                    ₦{transfer.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-medium">Unpaid:</span>
                  <span className="font-semibold">
                    ₦{unpaid.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="font-bold">Total:</span>
                  <span className="text-lg font-bold text-blue-600">
                    ₦{total.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="font-bold">Total Sales:</span>
                  <span className="text-lg font-bold text-blue-600">
                    {totalSales.toLocaleString()}
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
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Spreadsheet Section */}
        <div className="flex-1 overflow-auto border border-gray-200 rounded-lg p-2 shadow-sm">
          <Spreadsheet data={data} onChange={setData} className="w-full" />
        </div>

        {/* Cart Section */}
        <div className="w-full lg:w-96 space-y-4">
          {/* Add Items Form */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              🛒 Add Items
            </h3>

            <div className="space-y-3">
              <select
                aria-label="Select product"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-700"
                value={selectedItem}
                onChange={(e) => setSelectedItem(e.target.value)}
              >
                <option value="">Select Item</option>
                {itemOptions.length > 0 ? (
                  itemOptions.map((item) => {
                    return item.quantity > 0 ? (
                      <option key={item.name} value={item.name}>
                        {item.name} - ₦{item.salePrice.toLocaleString()} -{" "}
                        {item.quantity} in stock
                      </option>
                    ) : (
                      <option disabled key={item.name} value={item.name}>
                        {item.name} - ₦{item.salePrice.toLocaleString()} - Out
                        of stock
                      </option>
                    );
                  })
                ) : (
                  <option value="">No items available</option>
                )}
              </select>

              <input
                type="number"
                min="1"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />

              <button
                onClick={handleAddToCart}
                disabled={!selectedItem || !quantity}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                ➕ Add to Cart
              </button>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm">
            <h4 className="text-sm font-medium text-gray-600 mb-2">
              🛍 Cart Items
            </h4>
            {cart.length === 0 ? (
              <p className="text-sm text-gray-500 italic">Your cart is empty</p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {cart.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center bg-white px-3 py-2 rounded-md border border-gray-200 hover:bg-gray-50"
                  >
                    <span className="font-medium text-gray-700">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="flex items-center gap-4 text-gray-600">
                      ₦{(item.salePrice * item.quantity).toLocaleString()}
                      <AiOutlineDelete
                        className="text-red-600 cursor-pointer"
                        onClick={() => removeItemFromCart(idx)}
                      />
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Payment & Save */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-700">Total:</span>
              <span className="text-lg font-bold text-blue-600">
                ₦
                {totalAmount.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>

            {/* Payment Type */}
            <div className="flex justify-between text-sm font-medium text-gray-600">
              {["Cash", "Transfer", "Unpaid"].map((type) => (
                <label key={type} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="payment"
                    value={type}
                    checked={paymentType === type}
                    onChange={(e) => {
                      setPaymentType(e.target.value);
                      setCart((prev) => {
                        return prev.map((item) => {
                          return { ...item, paymentType: e.target.value };
                        });
                      });
                    }}
                  />
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </label>
              ))}
            </div>

            {/* Save Button */}
            <button
              onClick={() => {
                handleAddCartToSales();
                handleCreateSale();
              }}
              disabled={cart.length === 0 || paymentType === ""}
              className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              ✅ Save to Sales
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesSpreadsheet;
