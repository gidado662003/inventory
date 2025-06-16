"use client";
import React, { useEffect, useState } from "react";
import { approveUser, getUsers, deleteUser } from "../api";
import { ClipLoader } from "react-spinners";
import { id } from "date-fns/locale";
import { TopBar } from "@/components/TopBar";
import { useAuth } from "../context";
import { CustomToast } from "@/components/CustomToast";

interface User {
  _id: string;
  username: string;
  role: "admin" | "moderator" | "user";
  approved: boolean;
}

export default function Users() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [reload, setReload] = useState(false);
  const [isLoading, setIsLoading] = useState<string | null>(null);


  useEffect(() => {
    console.log("Current user:", currentUser);
  }, [currentUser]);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading("global");
      try {
        const response = await getUsers();
        console.log(response.users);
        setUsers(response.users || []);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setIsLoading(null);
      }
    };
    fetchUsers();
  }, [reload]);

  const handleApprove = async (id: string) => {
    setIsLoading(id);
    try {
      await approveUser(id, true);
      setReload((prev) => !prev);
    } catch (error) {
      console.error("Approval failed:", error);
    } finally {
      setIsLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    setIsLoading(id);
    try {
     const response = await deleteUser(id);
     if(response.success){
      CustomToast({
        message: "User deleted successfully",
        type: "success",
      });
      }else{
        CustomToast({
          message: "User deletion failed",
          type: "error",
        });
     }
     console.log(response);
      setReload((prev) => !prev);
    } catch (error) {
      console.error("Deletion failed:", error);
    } finally {
      setIsLoading(null);
    }
  };

  // Check if current user is admin
  const isAdmin = currentUser?.role === "admin";


  return (
    <>
      <TopBar />
      <div className="p-6">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Users Management
            </h1>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {user.username}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 capitalize">
                        {user.role}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.approved
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {user.approved ? "Approved" : "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                      {user.approved === false &&(<>
                        <button
                          onClick={() => handleApprove(user._id)}
                          disabled={isLoading === user._id || !isAdmin}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoading === user._id ? (
                            <ClipLoader size={16} color="#fff" />
                          ) : (
                            "Approve"
                          )}
                        </button>
                      </>)}
                        <button
                          onClick={() => handleDelete(user._id)}
                          disabled={isLoading === user._id || !isAdmin}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoading === user._id ? (
                            <ClipLoader size={16} color="#fff" />
                          ) : (
                            "Delete"
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
