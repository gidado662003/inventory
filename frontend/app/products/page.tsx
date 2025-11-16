"use client";
import React, { useEffect, useState } from "react";
import { MdEdit, MdAdd, MdRefresh } from "react-icons/md";
import { FaRegTrashAlt, FaSearch } from "react-icons/fa";
import { CustomAlertDialog } from "@/components/CustomAlertDialog";
import { CustomToast } from "@/components/CustomToast";
import { ClipLoader } from "react-spinners";
import { TopBar } from "@/components/TopBar";
import {
  createProduct,
  getProducts,
  deleteProduct,
  updateProduct,
} from "@/app/api";
import { useAuth } from "@/app/context";

interface Product {
  _id: string;
  name: string;
  quantity: number;
  salePrice: number;
}

function Products() {
  const { user } = useAuth();
  const [data, setData] = useState<Product[]>([]);
  const [filteredData, setFilteredData] = useState<Product[]>([]);
  const [searchEntry, setSearchEntry] = useState("");
  const [toggleEdit, setToggleEdit] = useState<boolean>(false);
  const [refresh, setRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Product;
    direction: "ascending" | "descending";
  } | null>(null);

  // Sorting functionality
  const requestSort = (key: keyof Product) => {
    let direction: "ascending" | "descending" = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortedData = () => {
    if (!sortConfig) return render;

    return [...render].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  };

  // Search functionality
  useEffect(() => {
    const filteredSearch = data.filter((item) =>
      item.name.toLowerCase().includes(searchEntry.toLowerCase())
    );
    setFilteredData(filteredSearch);
  }, [searchEntry, data]);

  const render = searchEntry ? filteredData : data;
  const sortedData = getSortedData();

  // CRUD operations
  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(id);
      await deleteProduct(id);
      const updateList = data.filter((item) => item._id !== id);
      setData(updateList);
      setFilteredData(updateList);
      CustomToast({
        message: "Success",
        type: "success",
        description: "Product deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      CustomToast({
        message: "Error",
        type: "error",
        description: "Failed to delete product",
      });
    } finally {
      setIsDeleting(null);
    }
  };

  const handleUpdate = async (updatedProduct: Product, id: string) => {
    try {
      setIsUpdating(id);
      const updated = await updateProduct(id, updatedProduct);
      setData(data.map((item) => (item._id === id ? updated : item)));
      CustomToast({
        message: "Success",
        type: "success",
        description: "Product updated successfully",
      });
    } catch (error) {
      console.error("Error updating product:", error);
      CustomToast({
        message: "Error",
        type: "error",
        description: "Failed to update product",
      });
    } finally {
      setIsUpdating(null);
    }
  };

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const products = await getProducts();
        setData(products);
      } catch (error) {
        console.error("Error fetching products:", error);
        CustomToast({
          message: "Error",
          type: "error",
          description: "Failed to fetch products",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [refresh]);

  const handleCreateProduct = async (product: Product) => {
    try {
      setIsLoading(true);
      const newProduct = await createProduct(product);
      setData([...data, newProduct]);
      CustomToast({
        message: "Success",
        type: "success",
        description: "Product created successfully",
      });
    } catch (error) {
      console.error("Error creating product:", error);
      CustomToast({
        message: "Error",
        type: "error",
        description: "Failed to create product",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get sort indicator
  const getSortIndicator = (key: keyof Product) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === "ascending" ? "↑" : "↓";
  };

  return (
    <>
      <TopBar />
      <div className="mx-auto p-4 md:p-6 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Stock Management
            </h1>
            {/* <p className="text-muted-foreground">Manage your inventory products</p> */}
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-muted-foreground" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                value={searchEntry}
                onChange={(e) => setSearchEntry(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
              />
            </div>

            {user?.role === "admin" && (
              <CustomAlertDialog
                trigger={
                  <button
                    onClick={() => setToggleEdit(false)}
                    className="cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-5 py-2 text-sm font-medium transition-colors"
                  >
                    Add New
                  </button>
                }
                title="Add new entry"
                description="Fill all items."
                cancelText="Cancel"
                confirmText="Submit"
                onConfirm={handleCreateProduct}
                stockToggle={toggleEdit}
              />
            )}
          </div>
        </div>

        <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
          {isLoading && data.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <ClipLoader size={40} color="hsl(var(--primary))" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto text-sm">
                <thead className="bg-muted text-foreground">
                  <tr>
                    <th
                      className="px-6 py-3 text-left font-medium cursor-pointer"
                      onClick={() => requestSort("name")}
                    >
                      <div className="flex items-center gap-1">
                        Product Name
                        <span className="text-xs">
                          {getSortIndicator("name")}
                        </span>
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left font-medium cursor-pointer"
                      onClick={() => requestSort("quantity")}
                    >
                      <div className="flex items-center gap-1">
                        Stock
                        <span className="text-xs">
                          {getSortIndicator("quantity")}
                        </span>
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left font-medium cursor-pointer"
                      onClick={() => requestSort("salePrice")}
                    >
                      <div className="flex items-center gap-1">
                        Price
                        <span className="text-xs">
                          {getSortIndicator("salePrice")}
                        </span>
                      </div>
                    </th>
                    {user?.role && (
                      <th className="px-6 py-3 text-right font-medium">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>

                <tbody className="divide-y divide-border">
                  {sortedData.length > 0 ? (
                    sortedData.map((item, index) => (
                      <tr
                        key={item._id}
                        className="hover:bg-muted/50 transition-colors"
                      >
                        <td className="px-6 py-4 font-medium text-card-foreground capitalize">
                          {item.name}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex text-[14px] items-center px-2.5 py-0.5 rounded-full text-xs  ${
                              item.quantity < 10
                                ? " font-bold text-destructive"
                                : item.quantity < 50
                                ? "font-bold text-yellow-600"
                                : "font-bold text-green-600"
                            }`}
                          >
                            {item.quantity?.toLocaleString() ?? "0"}{" "}
                            <span className="hidden lg:block ml-[2px]">
                              {" "}
                              in stock
                            </span>
                          </span>
                        </td>
                        <td className="px-6 py-4 font-medium text-card-foreground">
                          ₦{item.salePrice?.toLocaleString() ?? "0"}
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          {user?.role === "admin" && (
                            <>
                              {isUpdating === item._id ? (
                                <ClipLoader
                                  size={16}
                                  color="hsl(var(--primary))"
                                />
                              ) : (
                                <CustomAlertDialog
                                  trigger={
                                    <button
                                      className="text-muted-foreground hover:text-primary p-1 rounded-md hover:bg-primary/10 transition-colors"
                                      title="Edit product"
                                      onClick={() => setToggleEdit(true)}
                                    >
                                      <MdEdit size={18} />
                                    </button>
                                  }
                                  title={`Edit ${item.name}`}
                                  description="Update the product details below."
                                  cancelText="Cancel"
                                  confirmText="Update"
                                  onConfirm={(data) =>
                                    handleUpdate(data, item._id)
                                  }
                                  initialData={item}
                                  stockToggle={toggleEdit}
                                />
                              )}
                              {isDeleting === item._id ? (
                                <ClipLoader
                                  size={16}
                                  color="hsl(var(--destructive))"
                                />
                              ) : (
                                <button
                                  onClick={() => handleDelete(item._id)}
                                  className="text-muted-foreground hover:text-destructive p-1 rounded-md hover:bg-destructive/10 transition-colors"
                                  title="Delete product"
                                >
                                  <FaRegTrashAlt size={16} />
                                </button>
                              )}
                            </>
                          )}
                          {user?.role !== "admin" && (
                            <button
                              disabled
                              className="text-muted-foreground/50 p-1 rounded-md cursor-not-allowed"
                              title="Moderators cannot edit"
                            >
                              <MdEdit size={18} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          <svg
                            className="w-16 h-16 mb-4 text-muted-foreground/30"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1}
                              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                            />
                          </svg>
                          <p className="text-lg font-medium">
                            No products found
                          </p>
                          <p className="max-w-md mt-1">
                            {searchEntry
                              ? "Try adjusting your search query"
                              : "Add your first product to get started"}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {sortedData.length > 0 && (
          <div className="mt-4 text-sm text-muted-foreground">
            Showing {sortedData.length} of {data.length} products
          </div>
        )}
      </div>
    </>
  );
}

export default Products;
