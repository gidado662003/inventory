"use client";

import { TopBar } from "@/components/TopBar";
import { Customer } from "@/types/customer";
import { CustomerCard } from "@/components/CustomerCard";
import { CustomerForm } from "@/components/CustomerForm";
import { getCustomers, createCustomer, deleteCustomer } from "../api";

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
    CustomToast({
      message: "Coming Soon",
      description: "Customer details feature is coming soon",
      type: "info",
    });
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
          <div className="flex justify-center items-center h-64">
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
    </>
  );
}
