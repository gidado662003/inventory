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
  _id: string;
  name: string;
  quantity: number;
  salePrice: number;
  stock?: number;
}

interface CustomAlertDialogProps {
  trigger: React.ReactNode;
  title: string;
  description: string;
  cancelText?: string;
  confirmText?: string;
  onConfirm?: (data: Omit<ProductItem, "stock">) => void;
  initialData?: ProductItem;
  stockToggle?: boolean;
}

export const CustomAlertDialog = ({
  trigger,
  title,
  description,
  cancelText = "Cancel",
  confirmText = "Continue",
  onConfirm,
  initialData,
  stockToggle,
}: CustomAlertDialogProps) => {
  const [newEntry, setNewEntry] = useState<ProductItem>({
    _id: "",
    name: "",
    quantity: 0,
    salePrice: 0,
    stock: 0,
  });

  useEffect(() => {
    if (initialData) {
      setNewEntry({
        _id: initialData._id || "",
        name: initialData.name || "",
        quantity: initialData.quantity ?? 0,
        salePrice: initialData.salePrice ?? 0,
        stock: initialData.stock ?? 0,
      });
    } else {
      setNewEntry({
        _id: "",
        name: "",
        quantity: 0,
        salePrice: 0,
        stock: 0,
      });
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
    const entry = stockToggle
      ? {
          ...newEntry,
          quantity: newEntry.quantity + (newEntry.stock ?? 0),
          stock: 0,
        }
      : newEntry;

    if (!entry.name.trim()) {
      alert("Product name is required");
      return;
    }

    if (entry.quantity < 0 || entry.salePrice < 0) {
      alert("Values cannot be negative");
      return;
    }

    if (onConfirm) {
      const { stock, ...dataWithoutStock } = entry;
      onConfirm(dataWithoutStock);
    }

    setNewEntry({
      _id: "",
      name: "",
      quantity: 0,
      salePrice: 0,
      stock: 0,
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent className="max-w-md rounded-xl bg-card border border-border">
        <AlertDialogHeader className="border-b border-border pb-4">
          <AlertDialogTitle className="text-xl font-semibold text-card-foreground">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-foreground mb-1"
            >
              Product Name <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring transition bg-background text-foreground"
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
                className="block text-sm font-medium text-foreground mb-1"
              >
                Price (₦) <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring transition bg-background text-foreground"
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
                className="block text-sm font-medium text-foreground mb-1"
              >
                Quantity <span className="text-destructive">*</span>
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring transition bg-background text-foreground"
                id="quantity"
                name="quantity"
                value={newEntry.quantity || ""}
                readOnly={stockToggle ? true : false}
                onChange={handleInputChange}
                min="0"
                placeholder="0"
              />
            </div>
          </div>
          {stockToggle && (
            <div>
              <label
                htmlFor="stock"
                className="block text-sm font-medium text-foreground mb-1"
              >
                New Stock <span className="text-destructive">*</span>
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring transition bg-background text-foreground"
                id="stock"
                name="stock"
                value={newEntry.stock || ""}
                onChange={handleInputChange}
                min="0"
                placeholder="0"
              />
            </div>
          )}
        </div>

        <AlertDialogFooter className="border-t border-border pt-4">
          <AlertDialogCancel className="px-4 py-2 text-sm font-medium text-foreground bg-background border border-border rounded-lg hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition">
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition"
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
