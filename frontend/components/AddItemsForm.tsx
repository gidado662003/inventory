import React, { useState } from "react";
import { Item } from "@/types/sales";

interface AddItemsFormProps {
  itemOptions: Item[];
  onAddToCart: (
    selectedItem: string,
    quantity: string,
    paymentType: string
  ) => void;
}

export const AddItemsForm: React.FC<AddItemsFormProps> = ({
  itemOptions,
  onAddToCart,
}) => {
  const [selectedItem, setSelectedItem] = useState("");
  const [quantity, setQuantity] = useState("");
  const [paymentType, setPaymentType] = useState("");

  const handleSubmit = () => {
    if (!selectedItem || !quantity || parseInt(quantity) <= 0) return;

    onAddToCart(selectedItem, quantity, paymentType);

    // Reset form
    setSelectedItem("");
    setQuantity("");
    setPaymentType("");
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold text-gray-700 mb-3">🛒 Add Items</h3>

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
                <option key={item._id} value={item.name}>
                  {item.name} - ₦{item.salePrice.toLocaleString()} -{" "}
                  {item.quantity} in stock
                </option>
              ) : (
                <option disabled key={item._id} value={item.name}>
                  {item.name} - ₦{item.salePrice.toLocaleString()} - Out of
                  stock
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
          onClick={handleSubmit}
          disabled={!selectedItem || !quantity}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          ➕ Add to Cart
        </button>
      </div>
    </div>
  );
};
