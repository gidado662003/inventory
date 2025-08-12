"use client";

import { Customer } from "@/types/customer";
import { FiUser, FiPhone, FiEdit2, FiTrash2 } from "react-icons/fi";
import { AiOutlineExclamationCircle } from "react-icons/ai";

interface CustomerCardProps {
  customer: Customer;
  onViewDetails: (customer: Customer) => void;
  onEdit: (customer: Customer) => void;
  onDelete: (id: string) => void;
}

export function CustomerCard({
  customer,
  onViewDetails,
  onEdit,
  onDelete,
}: CustomerCardProps) {
  const formatPhoneNumber = (phone: string) => {
    // Format Nigerian phone number
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length === 11) {
      return `+234 ${cleaned.slice(1, 4)} ${cleaned.slice(
        4,
        7
      )} ${cleaned.slice(7)}`;
    }
    return phone;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all duration-200 cursor-pointer hover:border-red-200 group">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 text-blue-600 p-3 rounded-full group-hover:bg-blue-200 transition-colors">
            <FiUser size={20} />
          </div>
          <div>
            <h2 className="text-lg capitalize font-semibold text-gray-800 transition-colors">
              {customer.customerName}
            </h2>
            {customer.phone && (
              <div className="flex items-center gap-2 text-gray-600 mt-1 transition-colors">
                <FiPhone size={14} />
                <span>{formatPhoneNumber(customer.phone)}</span>
              </div>
            )}
          </div>
        </div>

        {customer.amountOwed && customer.amountOwed > 0 ? (
          <div className="flex items-center gap-1 bg-red-50 text-red-600 px-3 py-1 rounded-full text-sm border border-red-100">
            <AiOutlineExclamationCircle />
            <span>Owes {formatCurrency(customer.amountOwed)}</span>
          </div>
        ) : (
          <div className="text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm border border-green-100">
            Paid up
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
        <button
          onClick={() => onViewDetails(customer)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
        >
          View Details
        </button>
        <div className="flex items-center gap-6">
          <button
            onClick={() => onEdit(customer)}
            className="text-gray-500 hover:text-red-600 text-sm transition-colors"
          >
            <span className="hidden md:block cursor-pointer">Edit</span>
            <span className="block md:hidden">
              <FiEdit2 size={16} />
            </span>
          </button>
          <button
            onClick={() => onDelete(customer._id)}
            className="text-gray-500 hover:text-red-600 text-sm transition-colors"
          >
            <span className="hidden md:block cursor-pointer">Delete</span>
            <span className="block md:hidden">
              <FiTrash2 size={16} />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
