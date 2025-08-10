import React from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { CartItem } from "@/types/sales";

interface CartItemsProps {
  cart: CartItem[];
  onRemoveItem: (index: number) => void;
}

export const CartItems: React.FC<CartItemsProps> = ({ cart, onRemoveItem }) => {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm">
      <h4 className="text-sm font-medium text-gray-600 mb-2">🛍 Cart Items</h4>
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
                  onClick={() => onRemoveItem(idx)}
                />
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
