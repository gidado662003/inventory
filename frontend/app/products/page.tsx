"use client";
import React, { useEffect, useState } from "react";
import { MdEdit } from "react-icons/md";
import { FaRegTrashAlt } from "react-icons/fa";
import { CustomAlertDialog } from "@/components/CustomAlertDialog";
import { CustomToast } from "@/components/CustomToast";
import { ClipLoader } from "react-spinners";
import {
  createProduct,
  getProducts,
  deleteProduct,
  updateProduct,
} from "@/app/api";

interface Product {
  _id: string;
  name: string;
  quantity: number;
  salePrice: number;
}

function Products() {
  const [data, setData] = useState<Product[]>([]);
  const [filteredData, setFilteredData] = useState<Product[]>([]);
  const [searchEntry, setSearchEntry] = useState("");
  const [toggleEdit, setToggleEdit] = useState<boolean>(false);
  const [refresh, setRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  useEffect(() => {
    const filteredSearch = data.filter((item) =>
      item.name.toLowerCase().includes(searchEntry.toLowerCase())
    );
    setFilteredData(filteredSearch);
  }, [searchEntry, data]);

  const render = searchEntry ? filteredData : data;

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

  return (
    <div className="mx-auto p-6">
      <div className="flex items-center gap-4 mb-4">
        <p
          onClick={() => setRefresh(!refresh)}
          className="cursor-pointer hover:text-red-600"
        >
          Refresh
        </p>
        {isLoading && <ClipLoader size={20} color="#dc2626" />}
      </div>

      <input
        type="text"
        placeholder="Search Here"
        value={searchEntry}
        onChange={(e) => setSearchEntry(e.target.value)}
        className="w-full bg-white md:w-[330px] p-3 rounded-xl mb-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
      />

      <div className="flex justify-between items-center mb-4">
        <p className="text-xl font-semibold text-gray-800">Products List</p>

        <CustomAlertDialog
          trigger={
            <button
              onClick={() => setToggleEdit(false)}
              className="cursor-pointer bg-red-600 hover:bg-red-700 text-white rounded-full px-5 py-2 text-sm font-medium transition-colors"
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
      </div>

      <hr className="mb-4 border-gray-200" />

      <div className="relative min-h-[330px] max-h-[350px] overflow-auto rounded-xl shadow-sm border border-gray-200">
        {isLoading ? (
          <div className="flex justify-center items-center h-[330px]">
            <ClipLoader size={40} color="#dc2626" />
          </div>
        ) : (
          <table className="w-full table-auto text-sm">
            <thead className="sticky top-0 bg-gray-100 text-gray-700 z-10">
              <tr>
                <th className="px-4 py-3 text-left font-medium">S/N</th>
                <th className="px-4 py-3 text-left font-medium">Name</th>
                <th className="px-4 py-3 text-left font-medium">Stock</th>
                <th className="px-4 py-3 text-left font-medium">Sale Price</th>
                <th className="px-4 py-3 text-center font-medium"></th>
                <th className="px-4 py-3 text-center font-medium"></th>
              </tr>
            </thead>

            {render.length > 0 ? (
              <tbody>
                {render.map((item, index) => (
                  <tr
                    key={index}
                    className="odd:bg-white even:bg-gray-50 hover:bg-red-50 transition-colors"
                  >
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3 capitalize">{item.name}</td>
                    <td className="px-4 py-3 capitalize">
                      {item.quantity?.toLocaleString() ?? "0"}
                    </td>
                    <td className="px-4 py-3">
                      ₦{item.salePrice?.toLocaleString() ?? "0"}
                    </td>
                    <td
                      onClick={() => setToggleEdit(true)}
                      className="py-3 text-center text-red-500 hover:text-red-700 cursor-pointer"
                    >
                      {isUpdating === item._id ? (
                        <ClipLoader size={16} color="#dc2626" />
                      ) : (
                        <CustomAlertDialog
                          trigger={<MdEdit size={18} />}
                          title="Edit entry"
                          description="Fill all items."
                          cancelText="Cancel"
                          confirmText="Submit"
                          onConfirm={(data) => handleUpdate(data, item._id)}
                          initialData={item}
                          stockToggle={toggleEdit}
                        />
                      )}
                    </td>
                    <td className="py-3 text-center text-gray-600 hover:text-red-600 cursor-pointer">
                      {isDeleting === item._id ? (
                        <ClipLoader size={16} color="#dc2626" />
                      ) : (
                        <FaRegTrashAlt
                          size={16}
                          onClick={() => {
                            handleDelete(item._id);
                          }}
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500">
                    No item found
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        )}
      </div>
    </div>
  );
}

export default Products;
