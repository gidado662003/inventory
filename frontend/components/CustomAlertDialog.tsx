"use client";
import { useState } from "react";
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
}

export const CustomAlertDialog = ({
  trigger,
  title,
  description,
  cancelText = "Cancel",
  confirmText = "Continue",
  onConfirm,
}: CustomAlertDialogProps) => {
  const [newEntry, setNewEntry] = useState<ProductItem>({
    name: "",
    quantity: 0,
    salePrice: 0,
  });

  const getNewEntryData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewEntry((prev) => ({
      ...prev,
      [name]:
        name === "salePrice"
          ? parseFloat(value)
          : name === "quantity"
          ? parseInt(value)
          : value,
    }));
  };

  const handleConfirm = () => {
    onConfirm(newEntry);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <div className="w-full flex flex-col gap-y-4">
          <div>
            <label htmlFor="name" className="ml-3 mb-3">
              Name
            </label>
            <input
              type="text"
              className="border-2 p-2 w-full rounded-[20px]"
              id="name"
              name="name"
              onChange={getNewEntryData}
            />
          </div>
          <div className="flex justify-between gap-5 items-center">
            <div>
              <label htmlFor="price" className="ml-3 mb-3">
                Selling Price
              </label>
              <input
                type="number"
                className="w-full p-2 border-2 rounded-[20px]"
                id="price"
                name="salePrice"
                onChange={getNewEntryData}
              />
            </div>
            <div>
              <label htmlFor="quantity" className="ml-3 mb-3">
                Quantity
              </label>
              <input
                type="number"
                className="w-full p-2 border-2 rounded-[20px]"
                id="quantity"
                name="quantity"
                onChange={getNewEntryData}
              />
            </div>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
