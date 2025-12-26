import React, { useState } from "react";
import { PaymentType, PAYMENT_OPTIONS } from "@/types/sales";
import { Customer } from "@/types/customer";
import { CustomToast } from "./CustomToast";
import { CustomerForm } from "./CustomerForm";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "./ui/alert-dialog";
import { createCustomer, getCustomers } from "@/app/api";

interface PaymentSectionProps {
  cart: any[];
  customers: Customer[];
  onUpdatePaymentType: (paymentType: string) => void;
  onSaveSale: (customer: string, amountPaid: number) => void;
  onUpdateCustomers: (customers: Customer[]) => void;
}

export const PaymentSection: React.FC<PaymentSectionProps> = ({
  cart,
  customers,
  onUpdatePaymentType,
  onSaveSale,
  onUpdateCustomers,
}) => {
  const [paymentType, setPaymentType] = useState<PaymentType | "">("");
  const [customer, setCustomer] = useState<string>("");
  const [amountPaid, setAmountPaid] = useState(0);

  const totalAmount = cart.reduce(
    (acc, item) => acc + item.quantity * item.salePrice,
    0
  );

  const handlePaymentTypeChange = (type: PaymentType) => {
    const newType = type === "Partial/Unpaid" ? "outstanding" : type;
    setPaymentType(type);
    onUpdatePaymentType(newType);
  };

  const handleSaveSale = () => {
    onSaveSale(customer, amountPaid);
    // Reset form
    setPaymentType("");
    setCustomer("");
    setAmountPaid(0);
  };

  return (
    <div className="bg-muted p-4 rounded-lg shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <span className="font-semibold text-foreground">Total:</span>
        <span className="text-lg font-bold text-primary">
          ₦
          {totalAmount.toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}
        </span>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-medium text-foreground">Payment Method</h4>
        <div className="grid grid-cols-3 gap-3">
          {PAYMENT_OPTIONS.map(({ type, color }) => (
            <button
              key={type}
              type="button"
              onClick={() => handlePaymentTypeChange(type)}
              className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${
                paymentType === type
                  ? `border-2 border-foreground ${color} font-semibold`
                  : "border-border hover:bg-muted/50"
              }`}
            >
              <span>{type}</span>
            </button>
          ))}
        </div>

        {/* Partial Payment Details */}
        {paymentType === "Partial/Unpaid" && (
          <div className="space-y-3 mt-3 animate-fadeIn">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Customer Information
              </label>
              <div className="flex gap-2">
                <select
                  className="flex-1 border border-border rounded-md px-3 py-2 focus:ring-2 focus:ring-ring focus:border-ring outline-none bg-background text-foreground"
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                >
                  <option value="">Select Existing Customer</option>
                  {customers.map((customer) => (
                    <option key={customer._id} value={customer._id}>
                      {customer.customerName}
                    </option>
                  ))}
                </select>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      type="button"
                      className="px-3 py-2 bg-muted hover:bg-muted/80 rounded-md text-foreground transition-colors"
                    >
                      + New
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>New Customer</AlertDialogTitle>
                      <AlertDialogDescription>
                        Add a new customer to your system
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <CustomerForm
                      onSubmit={async (data) => {
                        try {
                          await createCustomer(data);
                          const updatedCustomers = await getCustomers();
                          onUpdateCustomers(updatedCustomers);
                          // Close the dialog
                          // Show success message
                        } catch (error) {
                          console.error(error);
                        }
                      }}
                      onCancel={() => {}}
                    />
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Amount Paid
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                    ₦
                  </span>
                  <input
                    type="number"
                    // readOnly={paymentType === "Partial/Unpaid"}
                    max={totalAmount}
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(Number(e.target.value))}
                    step="0.01"
                    className="w-full pl-8 border border-border rounded-md px-3 py-2 focus:ring-2 focus:ring-ring focus:border-ring outline-none bg-background text-foreground"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Balance Due
                </label>
                <div className="p-2 bg-muted rounded-md border border-border font-medium text-foreground">
                  ₦{(totalAmount - amountPaid).toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Save Button */}
      {
        <button
          onClick={handleSaveSale}
          disabled={cart.length === 0 || paymentType === ""}
          className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          ✅ Save to Sales
        </button>
      }
    </div>
  );
};
