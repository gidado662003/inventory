"use client";
import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface ProductItem {
  name: string;
  quantity: number;
  salePrice: number;
}

interface CustomAlertDialogProps {
  trigger: React.ReactNode;
  title: string;
  description: string;
  cancelText?: string;
  confirmText?: string;
  onConfirm: (data: ProductItem) => void;
  initialData?: ProductItem;
}

export const CustomAlertDialog = ({
  trigger,
  title,
  description,
  cancelText = "Cancel",
  confirmText = "Continue",
  onConfirm,
  initialData,
}: CustomAlertDialogProps) => {
  const [newEntry, setNewEntry] = useState<ProductItem>({
    name: "",
    quantity: 0,
    salePrice: 0,
  });

  useEffect(() => {
    if (initialData) {
      setNewEntry(initialData);
    } else {
      setNewEntry({ name: "", quantity: 0, salePrice: 0 });
    }
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewEntry((prev) => ({
      ...prev,
      [name]: name === "name" ? value : Number(value) || 0,
    }));
  };

  const handleConfirm = () => {
    if (!newEntry.name.trim()) {
      alert("Product name is required");
      return;
    }
    if (newEntry.quantity < 0 || newEntry.salePrice < 0) {
      alert("Values cannot be negative");
      return;
    }
    onConfirm(newEntry);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent className="max-w-md rounded-xl">
        <AlertDialogHeader className="border-b pb-4">
          <AlertDialogTitle className="text-xl font-semibold text-gray-800">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="space-y-4 py-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
              id="name"
              name="name"
              value={newEntry.name}
              onChange={handleInputChange}
              required
              placeholder="Enter product name"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Price (₦) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                  id="price"
                  name="salePrice"
                  value={newEntry.salePrice || ""}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>
            </div>
            
            <div>
              <label
                htmlFor="quantity"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                id="quantity"
                name="quantity"
                value={newEntry.quantity || ""}
                onChange={handleInputChange}
                min="0"
                placeholder="0"
              />
            </div>
          </div>
        </div>
        
        <AlertDialogFooter className="border-t pt-4">
          <AlertDialogCancel className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition">
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition"
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};