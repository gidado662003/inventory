"use client";

import React from "react";
import { useState } from "react";
import Spreadsheet from "react-spreadsheet";

const itemOptions = [
  { name: "Coke", price: 1500 },
  { name: "Pepsi", price: 1300 },
  { name: "Water", price: 1000 },
];

const SalesSpreadsheet = () => {
  const [data, setData] = useState([
    [
      { value: "Time" },
      { value: "Item" },
      { value: "Quantity" },
      { value: "Price" },
      { value: "Total" },
    ],
  ]);
  const [selectedItem, setSelectedItem] = useState("");
  const [quantity, setQuantity] = useState("");
  const [cart, setCart] = useState([]);

  function addToCart() {
    if (!selectedItem || !quantity) return;

    const existingItem = cart.findIndex((index) => index.name === selectedItem);
    console.log(existingItem);
    const itemData = itemOptions.find((item) => item.name === selectedItem);
    console.log(itemData);
    if (existingItem >= 0) {
      const updated = [...cart];
      updated[existingItem].quantity += parseInt(quantity);
      setCart(updated);
    } else {
      setCart([
        ...cart,
        {
          name: selectedItem,
          quantity: parseInt(quantity),
          price: itemData?.price,
          total: itemData.price * quantity,
        },
      ]);
    }
    console.log(cart);
    setSelectedItem("");
    setQuantity("");
  }
  function handleCartToSheet() {
    const newSheetData = cart.map((item) => {
      return [
        { value: 2 },
        { value: item.name },
        { value: item.quantity.toString() },
        { value: item.price.toString() },
        { value: item.total },
      ];
    });
    setData([...data, ...newSheetData]);
    setCart([]);
  }
  console.log(data);
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Sales Spreadsheet</h2>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Spreadsheet Section */}
        <div className="flex-1 overflow-auto">
          <Spreadsheet data={data} onChange={() => {}} />
        </div>

        {/* Cart & Form Section */}
        <div className="w-full md:w-80 border-l border-gray-300 pl-4">
          <h3 className="font-semibold text-lg mb-2">Current Purchase</h3>

          {/* Form */}
          <div className="flex flex-col gap-2 mb-4">
            <select
              value={selectedItem}
              className="border p-2 rounded"
              onChange={(e) => setSelectedItem(e.target.value)}
            >
              <option value="">Select Item</option>
              {itemOptions.map((items) => (
                <option key={items.name} value={items.name}>
                  {items.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              min={1}
              className="border p-2 rounded"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />

            <button
              className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              onClick={addToCart}
            >
              + Add to Cart
            </button>
          </div>

          {/* Cart Display */}
          <div className="space-y-2 mb-4">
            {cart.length === 0 && (
              <p className="text-sm text-gray-500">Cart is empty</p>
            )}

            {cart.map((items) => (
              <div>
                <div className="bg-gray-100 px-3 py-2 rounded flex justify-between">
                  <span>
                    {items.name}X{items.quantity}
                  </span>
                  <span className="text-sm text-gray-600">
                    {items.quantity * items.price}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <p>
            Total: ₦
            {cart.reduce((acc, item) => acc + item.price * item.quantity, 0)}
          </p>

          {/* Final Button */}
          <button
            onClick={handleCartToSheet}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
            disabled={cart.length === 0}
          >
            ✅ Add to Sales Record
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalesSpreadsheet;
