import React from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { CartItem } from "@/types/sales";

interface CartItemsProps {
  cart: CartItem[];
  onRemoveItem: (index: number) => void;
}

export const CartItems: React.FC<CartItemsProps> = ({ cart, onRemoveItem }) => {
  return (
    <div className="bg-muted border border-border rounded-lg p-4 shadow-sm">
      <h4 className="text-sm font-medium text-foreground mb-2">🛍 Cart Items</h4>
      {cart.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">
          Your cart is empty
        </p>
      ) : (
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
          {cart.map((item, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center bg-card px-3 py-2 rounded-md border border-border hover:bg-muted/50"
            >
              <span className="font-medium text-card-foreground">
                {item.name} × {item.quantity}
              </span>
              <span className="flex items-center gap-4 text-muted-foreground">
                ₦{(item.salePrice * item.quantity).toLocaleString()}
                <AiOutlineDelete
                  className="text-destructive cursor-pointer hover:text-destructive/80 transition-colors"
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
