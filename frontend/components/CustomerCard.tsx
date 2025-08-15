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
    <div className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-all duration-200 cursor-pointer hover:border-primary/20 group">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary p-3 rounded-full group-hover:bg-primary/20 transition-colors">
            <FiUser size={20} />
          </div>
          <div>
            <h2 className="text-lg capitalize font-semibold text-card-foreground transition-colors">
              {customer.customerName}
            </h2>
            {customer.phone && (
              <div className="flex items-center gap-2 text-muted-foreground mt-1 transition-colors">
                <FiPhone size={14} />
                <span>{formatPhoneNumber(customer.phone)}</span>
              </div>
            )}
          </div>
        </div>

        {customer.amountOwed && customer.amountOwed > 0 ? (
          <div className="flex items-center gap-1 bg-destructive/10 text-destructive px-3 py-1 rounded-full text-sm border border-destructive/20">
            <AiOutlineExclamationCircle />
            <span>Owes {formatCurrency(customer.amountOwed)}</span>
          </div>
        ) : (
          <div className="text-green-600 bg-green-500/10 px-3 py-1 rounded-full text-sm border border-green-500/20">
            Paid up
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-border/50 flex justify-between items-center">
        <button
          onClick={() => onViewDetails(customer)}
          className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
        >
          View Details
        </button>
        <div className="flex items-center gap-6">
          <button
            onClick={() => onEdit(customer)}
            className="text-muted-foreground hover:text-primary text-sm transition-colors"
          >
            <span className="hidden md:block cursor-pointer">Edit</span>
            <span className="block md:hidden">
              <FiEdit2 size={16} />
            </span>
          </button>
          <button
            onClick={() => onDelete(customer._id)}
            className="text-muted-foreground hover:text-destructive text-sm transition-colors"
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
