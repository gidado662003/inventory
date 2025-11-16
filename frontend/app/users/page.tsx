"use client";
import React, { useEffect, useState } from "react";
import { approveUser, getUsers, deleteUser, logUserout } from "../api";
import { ClipLoader } from "react-spinners";
import { TopBar } from "@/components/TopBar";
import { useAuth } from "../context";
import { CustomToast } from "@/components/CustomToast";
import { useRouter } from "next/navigation";
import { FiTrash2, FiCheck } from "react-icons/fi";

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
  const router = useRouter();
  const isAdmin = currentUser?.role === "admin";

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading("global");
      try {
        const response = await getUsers();
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
      if ((error as any).auth === false) {
        logUserout();
        router.push("/login");
      }
      CustomToast({ message: "Approval failed", type: "error" });
    } finally {
      setIsLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    setIsLoading(id);
    try {
      const response = await deleteUser(id);
      if (response.success) {
        CustomToast({ message: "User deleted successfully", type: "success" });
      } else {
        CustomToast({ message: "User deletion failed", type: "error" });
      }
      setReload((prev) => !prev);
    } catch (error) {
      console.error("Deletion failed:", error);
      CustomToast({ message: "Deletion failed", type: "error" });
    } finally {
      setIsLoading(null);
    }
  };

  if (isLoading === "global") {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader size={40} color="#ef4444" />
      </div>
    );
  }

  return (
    <>
      <TopBar />
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6">
          Users Management
        </h1>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => (
            <div
              key={user._id}
              className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200 p-6 transition-transform hover:scale-[1.02]"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-gray-500 to-gray-700 text-white flex items-center justify-center text-lg font-bold shadow-md">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {user.username}
                  </h2>
                  <p className="text-sm text-gray-500 capitalize">
                    {user.role}
                  </p>
                </div>
              </div>

              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${
                  user.approved
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {user.approved ? "Approved" : "Pending Approval"}
              </span>

              <div className="flex gap-3">
                {!user.approved && (
                  <button
                    onClick={() => handleApprove(user._id)}
                    disabled={isLoading === user._id || !isAdmin}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 transition-all"
                  >
                    {isLoading === user._id ? (
                      <ClipLoader size={16} color="#fff" />
                    ) : (
                      <>
                        <FiCheck size={16} /> Approve
                      </>
                    )}
                  </button>
                )}
                <button
                  onClick={() => handleDelete(user._id)}
                  disabled={isLoading === user._id || !isAdmin}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition-all"
                >
                  {isLoading === user._id ? (
                    <ClipLoader size={16} color="#fff" />
                  ) : (
                    <>
                      <FiTrash2 size={16} /> Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
