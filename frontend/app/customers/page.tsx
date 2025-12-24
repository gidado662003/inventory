"use client";

import { TopBar } from "@/components/TopBar";
import { Customer } from "@/types/customer";
import { CustomerCard } from "@/components/CustomerCard";
import { CustomerForm } from "@/components/CustomerForm";
import {
  getCustomers,
  createCustomer,
  deleteCustomer,
  payCustomerOwedGroup,
} from "../api";

import { useState, useEffect } from "react";
import { FiPlus, FiSearch, FiUser } from "react-icons/fi";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { CustomToast } from "@/components/CustomToast";

export default function Page() {
  const [customers, setCustomers] = useState([] as Customer[]);
  console.log(customers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [paymentInputs, setPaymentInputs] = useState<Record<string, string>>(
    {}
  );

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getCustomers();
        setCustomers(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch customers";
        setError(errorMessage);
        CustomToast({
          message: "Error",
          description: errorMessage,
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone?.includes(searchTerm)
  );

  const fetchCustomers = async () => {
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateCustomer = async (data: {
    customerName: string;
    phone: string;
  }) => {
    setIsCreating(true);
    try {
      await createCustomer(data);
      setIsCreating(false);
      await fetchCustomers();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create customers";
      setError(errorMessage);
      CustomToast({
        message: "Error",
        description: errorMessage,
        type: "error",
      });
    }
  };

  const handleViewDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
    setDetailsOpen(true);
  };

  const handleEdit = (customer: Customer) => {
    CustomToast({
      message: "Coming Soon",
      description: "Customer edit feature is coming soon",
      type: "info",
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCustomer(id);
      setCustomers(customers.filter((customer) => customer._id !== id));
      CustomToast({
        message: "Customer deleted",
        description: "Customer deleted successfully",
        type: "success",
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete customer";
      setError(errorMessage);
      CustomToast({
        message: "Error",
        description: errorMessage,
        type: "error",
      });
    }
  };

  const handlePayGroup = async (groupId: string) => {
    if (!selectedCustomer) return;
    const raw = paymentInputs[groupId];
    const amount = Number(raw);
    if (!amount || amount <= 0) {
      CustomToast({
        message: "Invalid amount",
        description: "Enter a positive payment amount",
        type: "error",
      });
      return;
    }
    try {
      await payCustomerOwedGroup(selectedCustomer._id, groupId, amount);
      CustomToast({
        message: "Payment recorded",
        description: "Outstanding updated for this group",
        type: "success",
      });
      setPaymentInputs((prev) => ({ ...prev, [groupId]: "" }));
      const refreshed = await getCustomers();
      setCustomers(refreshed);
      const current = refreshed.find(
        (c: Customer) => c._id === selectedCustomer._id
      );
      setSelectedCustomer(current || null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to record payment";
      setError(errorMessage);
      CustomToast({
        message: "Error",
        description: errorMessage,
        type: "error",
      });
    }
  };

  return (
    <>
      <TopBar />
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold">Customers</h1>

          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search customers..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <AlertDialog open={isCreating} onOpenChange={setIsCreating}>
              <AlertDialogTrigger asChild>
                <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md hover:shadow-lg">
                  <FiPlus size={18} />
                  <span className="hidden md:inline">New Customer</span>
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="border border-red-100">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-red-800">
                    Create Customer
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Add a new customer to your system
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <CustomerForm
                  onSubmit={handleCreateCustomer}
                  onCancel={() => {
                    setIsCreating(false);
                    CustomToast({
                      message: "Cancelled",
                      description: "Customer creation cancelled",
                      type: "info",
                    });
                  }}
                  isLoading={!isCreating}
                />
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {isLoading ? (
          <div className="flex  justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="bg-red-50 rounded-xl p-8 text-center border border-red-100">
            <div className="mx-auto bg-red-100 text-red-600 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <FiUser className="text-2xl" />
            </div>
            <h3 className="text-lg font-medium text-red-800">
              {searchTerm ? "No matching customers found" : "No customers yet"}
            </h3>
            <p className="text-red-600 mt-1">
              {searchTerm
                ? "Try a different search term"
                : "Add your first customer to get started"}
            </p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-2 shadow-md hover:shadow-lg">
                  <FiPlus size={16} />
                  Add Customer
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="border border-red-100">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-red-800">
                    Create Customer
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Add a new customer to your system
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <CustomerForm
                  onSubmit={handleCreateCustomer}
                  onCancel={() => {}}
                  isLoading={isCreating}
                />
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {filteredCustomers.map((customer) => (
              <CustomerCard
                key={customer._id}
                customer={customer}
                onViewDetails={handleViewDetails}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      <AlertDialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <AlertDialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
          <AlertDialogHeader className="flex-shrink-0">
            <AlertDialogTitle>
              {selectedCustomer?.customerName || "Customer Details"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Items owed and payment status
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="flex-1 overflow-y-auto pr-1">
            {selectedCustomer?.owedGroups &&
            selectedCustomer.owedGroups.length > 0 ? (
              <div className="mt-4 space-y-4">
                {selectedCustomer.owedGroups.map((group) => (
                  <div key={group._id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Group created:{" "}
                          {group.createdAt
                            ? new Date(group.createdAt).toLocaleString()
                            : "—"}
                        </p>
                        <p className="text-sm">
                          Items: {group.items.map((i) => i.itemName).join(", ")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          Outstanding: ₦{group.outstanding.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Paid: ₦{group.amountPaid.toLocaleString()} / Total: ₦
                          {group.total.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs divide-y divide-border">
                        <thead className="bg-muted">
                          <tr>
                            <th className="text-left px-2 py-2">Item</th>
                            <th className="text-right px-2 py-2">Qty</th>
                            <th className="text-right px-2 py-2">Unit Price</th>
                            <th className="text-right px-2 py-2">Line Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {group.items.map((item, idx) => (
                            <tr key={`${group._id}-${idx}`}>
                              <td className="px-2 py-2">{item.itemName}</td>
                              <td className="px-2 py-2 text-right">
                                {item.quantity}
                              </td>
                              <td className="px-2 py-2 text-right">
                                ₦{item.unitPrice.toLocaleString()}
                              </td>
                              <td className="px-2 py-2 text-right">
                                ₦
                                {(
                                  item.unitPrice * item.quantity
                                ).toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-3 flex flex-col sm:flex-row items-end gap-2">
                      {group.outstanding > 0 && (
                        <input
                          type="number"
                          min={0}
                          step="0.01"
                          className="border rounded-md px-3 py-2 w-full sm:w-48"
                          placeholder="Amount to pay"
                          value={paymentInputs[group._id] || ""}
                          onChange={(e) =>
                            setPaymentInputs((prev) => ({
                              ...prev,
                              [group._id]: e.target.value,
                            }))
                          }
                        />
                      )}
                      <button
                        onClick={() => handlePayGroup(group._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors w-full sm:w-auto"
                        disabled={group.outstanding <= 0}
                      >
                        {group.outstanding <= 0 ? "Paid" : "Record Payment"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : selectedCustomer?.itemsOwed &&
              selectedCustomer.itemsOwed.length > 0 ? (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm divide-y divide-border">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left px-3 py-2">Item</th>
                      <th className="text-right px-3 py-2">Qty</th>
                      <th className="text-right px-3 py-2">Unit Price</th>
                      <th className="text-right px-3 py-2">Paid</th>
                      <th className="text-right px-3 py-2">Outstanding</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {selectedCustomer.itemsOwed.map((item) => {
                      const owed = item.unitPrice * item.quantity;
                      const paid = item.amountPaid || 0;
                      const outstanding = Math.max(owed - paid, 0);
                      return (
                        <tr
                          key={item._id || `${item.itemName}-${item.unitPrice}`}
                        >
                          <td className="px-3 py-2">{item.itemName}</td>
                          <td className="px-3 py-2 text-right">
                            {item.quantity}
                          </td>
                          <td className="px-3 py-2 text-right">
                            ₦{item.unitPrice.toLocaleString()}
                          </td>
                          <td className="px-3 py-2 text-right">
                            ₦{paid.toLocaleString()}
                          </td>
                          <td className="px-3 py-2 text-right font-semibold">
                            ₦{outstanding.toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-4 text-sm text-muted-foreground">
                No items owed for this customer.
              </div>
            )}
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
