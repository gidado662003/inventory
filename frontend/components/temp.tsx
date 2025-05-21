"use client";

import React, { useState } from "react";
import Spreadsheet, { CellBase, Matrix } from "react-spreadsheet";
import { AiOutlineDelete } from "react-icons/ai";
// Define types
type Item = {
  name: string;
  price: number;
};

type CartItem = {
  name: string;
  price: number;
  quantity: number;
};

type SpreadsheetCell = {
  value: string | number;
};

// Product Options
const itemOptions: Item[] = [
  { name: "Coke", price: 1500 },
  { name: "Pepsi", price: 1300 },
  { name: "Water", price: 1000 },
  { name: "komando", price: 1300 },
];

// Get current time
const getCurrentTime = (): string => {
  const now = new Date();
  return now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const SalesSpreadsheet = () => {
  const [data, setData] = useState<Matrix<CellBase<any>>>([
    [
      { value: "Time" },
      { value: "Item" },
      { value: "Quantity" },
      { value: "Price" },
      { value: "Total" },
    ],
  ]);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");

  const handleAddToCart = (): void => {
    if (!selectedItem || !quantity || parseInt(quantity) <= 0) return;

    const itemData = itemOptions.find((item) => item.name === selectedItem);
    if (!itemData) return;

    const existingIndex = cart.findIndex((item) => item.name === selectedItem);
    const updatedCart = [...cart];

    if (existingIndex >= 0) {
      updatedCart[existingIndex].quantity += parseInt(quantity);
    } else {
      updatedCart.push({
        name: itemData.name,
        price: itemData.price,
        quantity: parseInt(quantity),
      });
    }

    setCart(updatedCart);
    setSelectedItem("");
    setQuantity("");
  };

  const handleAddCartToSales = (): void => {
    if (cart.length === 0) return;

    const newRows = cart.map((item) => {
      const total = (item.quantity * item.price).toFixed(2);
      return [
        { value: getCurrentTime() },
        { value: item.name },
        { value: item.quantity.toString() },
        { value: `₦${item.price.toFixed(2).toLocaleString()}` },
        { value: `₦${total}` },
      ];
    });

    setData((prev) => [...prev, ...newRows]);
    setCart([]);
  };

  const totalAmount = cart.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  const removeItemFromCart = (index: number) => {
    const editCart = cart.filter((_, idx) => idx !== index);
    setCart(editCart);
    console.log(cart[index].quantity);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        🧾 Sales Spreadsheet
      </h2>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Spreadsheet Section */}
        <div className="flex-1 overflow-auto border border-gray-200 rounded-lg p-2 shadow-sm">
          <Spreadsheet data={data} onChange={setData} className="w-full" />
        </div>

        {/* Cart Section */}
        <div className="w-full lg:w-96 space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              🛒 Add Items
            </h3>

            {/* Form Section */}
            <div className="space-y-3">
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                value={selectedItem}
                onChange={(e) => setSelectedItem(e.target.value)}
              >
                <option value="">Select Item</option>
                {itemOptions.map((item) => (
                  <option key={item.name} value={item.name}>
                    {item.name} - ₦{item.price.toLocaleString()}
                  </option>
                ))}
              </select>

              <input
                type="number"
                min="1"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />

              <button
                onClick={handleAddToCart}
                disabled={!selectedItem || !quantity}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span>➕</span>
                <span>Add to Cart</span>
              </button>
            </div>
          </div>

          {/* Cart Items */}
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
                    className="flex justify-between items-center bg-white px-3 py-2 rounded-md border border-gray-200 hover:bg-gray-50 transition"
                  >
                    <span className="font-medium text-gray-700">
                      {item.name} × {item.quantity}
                    </span>

                    <span className="flex gap-[20px] items-center text-gray-600">
                      ₦{(item.price * item.quantity).toLocaleString()}
                      <span>
                        <AiOutlineDelete
                          className="w-[20px] text-red-600 cursor-pointer"
                          onClick={() => removeItemFromCart(idx)}
                        />
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Total & Save */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold text-gray-700">Total:</span>
              <span className="text-lg font-bold text-blue-600">
                ₦
                {totalAmount.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>

            <button
              onClick={handleAddCartToSales}
              disabled={cart.length === 0}
              className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span>✅</span>
              <span>Save to Sales</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesSpreadsheet;
