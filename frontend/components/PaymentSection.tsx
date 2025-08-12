import React, { useState } from "react";
import { PaymentType, PAYMENT_OPTIONS } from "@/types/sales";
import { Customer } from "@/types/customer";
import { CustomToast } from "./CustomToast";

interface PaymentSectionProps {
  cart: any[];
  customers: Customer[];
  onUpdatePaymentType: (paymentType: string) => void;
  onSaveSale: (customer: string, amountPaid: number) => void;
}

export const PaymentSection: React.FC<PaymentSectionProps> = ({
  cart,
  customers,
  onUpdatePaymentType,
  onSaveSale,
}) => {
  const [paymentType, setPaymentType] = useState<PaymentType | "">("");
  const [customer, setCustomer] = useState<string>("");
  const [amountPaid, setAmountPaid] = useState(0);

  const totalAmount = cart.reduce(
    (acc, item) => acc + item.quantity * item.salePrice,
    0
  );

  const handlePaymentTypeChange = (type: PaymentType) => {
    setPaymentType(type);
    onUpdatePaymentType(type);
  };

  const handleSaveSale = () => {
    onSaveSale(customer, amountPaid);
    // Reset form
    setPaymentType("");
    setCustomer("");
    setAmountPaid(0);
  };

  return (
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

      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700">Payment Method</h4>
        <div className="grid grid-cols-4 gap-3">
          {PAYMENT_OPTIONS.map(({ type, color }) => (
            <button
              key={type}
              type="button"
              onClick={() => handlePaymentTypeChange(type)}
              className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${
                paymentType === type
                  ? `border-2 border-gray-900 ${color} font-semibold`
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <span>{type}</span>
            </button>
          ))}
        </div>

        {/* Partial Payment Details */}
        {(paymentType === "Partial" || paymentType === "Unpaid") && (
          <div className="space-y-3 mt-3 animate-fadeIn">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Information
              </label>
              <div className="flex gap-2">
                <select
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
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
                <button
                  type="button"
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 transition-colors"
                  onClick={() =>
                    CustomToast({
                      message: "Feature coming soon!",
                      description:
                        "New customer registration will be available in the next update",
                      type: "info",
                    })
                  }
                >
                  + New
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount Paid
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    ₦
                  </span>
                  <input
                    type="number"
                    readOnly={paymentType === "Unpaid"}
                    max={totalAmount}
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(Number(e.target.value))}
                    step="0.01"
                    className="w-full pl-8 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Balance Due
                </label>
                <div className="p-2 bg-gray-50 rounded-md border border-gray-200 font-medium">
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
          className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          ✅ Save to Sales
        </button>
      }
    </div>
  );
};
