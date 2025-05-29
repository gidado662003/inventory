"use client";
import React, { useEffect, useState } from "react";
import { MdEdit } from "react-icons/md";
import { FaRegTrashAlt } from "react-icons/fa";
import { CustomAlertDialog } from "@/components/CustomAlertDialog";

interface Product {
  name: string;
  quantity: number;
  salePrice: number;
}

function Products() {
  const [dummy, setDummy] = useState<Product[]>([]);
  const [filteredDummy, setFilteredDummy] = useState<Product[]>([]);
  const [searchEntry, setSearchEntry] = useState("");

  useEffect(() => {
    const filteredSearch = dummy.filter((item) =>
      item.name.toLowerCase().includes(searchEntry.toLowerCase())
    );
    setFilteredDummy(filteredSearch);
  }, [searchEntry, dummy]);

  const render = searchEntry ? filteredDummy : dummy;

  const removeItem = (id: number) => {
    const updateList = dummy.filter((_, index) => index !== id);
    setDummy(updateList);
  };

  const handleEdit = (data: Product, id: number) => {
    const nameExists = dummy.some(
      (item, index) =>
        index !== id && item.name.toLowerCase() === data.name.toLowerCase()
    );

    if (nameExists) {
      alert(`${data.name} already exists. Please choose a different name.`);
      return;
    }

    const updated = dummy.map((item, index) => (index === id ? data : item));
    setDummy(updated);
  };

  const handlesubmit = (data: Product) => {
    const nameExists = dummy.some(
      (item) => item.name.toLowerCase() === data.name.toLowerCase()
    );

    if (nameExists) {
      alert(`${data.name} already exists. Please edit the item instead.`);
      return;
    }

    setDummy([...dummy, data]);
  };

  return (
    <div className="mx-auto p-6">
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
            <button className="cursor-pointer bg-red-600 hover:bg-red-700 text-white rounded-full px-5 py-2 text-sm font-medium transition-colors">
              Add New
            </button>
          }
          title="Add new entry"
          description="Fill all items."
          cancelText="Cancel"
          confirmText="Submit"
          onConfirm={handlesubmit}
        />
      </div>

      <hr className="mb-4 border-gray-200" />

      <div className="relative min-h-[330px] max-h-[350px] overflow-auto rounded-xl shadow-sm border border-gray-200">
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
                    {item.quantity.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    ₦{item.salePrice.toLocaleString()}
                  </td>
                  <td className="py-3 text-center text-red-500 hover:text-red-700 cursor-pointer">
                    <CustomAlertDialog
                      trigger={<MdEdit size={18} />}
                      title="Edit entry"
                      description="Fill all items."
                      cancelText="Cancel"
                      confirmText="Submit"
                      onConfirm={(data) => handleEdit(data, index)}
                      initialData={item}
                    />
                  </td>
                  <td className="py-3 text-center text-gray-600 hover:text-red-600 cursor-pointer">
                    <FaRegTrashAlt
                      size={16}
                      onClick={() => removeItem(index)}
                    />
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
      </div>
    </div>
  );
}

export default Products;
