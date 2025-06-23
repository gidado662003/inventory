"use client";
import Link from "next/link";
import React, { useState } from "react";
import { login } from "../api";
import { useRouter } from "next/navigation";
import { CustomToast } from "@/components/CustomToast";
import { ClipLoader } from "react-spinners";
import { useAuth } from "../context";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useAuth();
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await login(username, password);
      if (response.success) {
        setUser({
          id: response.user.id,
          username: response.user.username,
          role: response.user.role,
        });
        router.push("/sales");
        CustomToast({
          message: "Success",
          description: "Login successful",
          type: "success",
        });
      }
    } catch (error: any) {
      setLoading(false);
      console.log(error);
      if (error.response.status === 403) {
        return router.push("/pending");
      }
      CustomToast({
        message: "Error",
        description: error.response.data.message,
        type: "error",
      });
    }
  };
  return (
    <div className=" bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {loading ? <ClipLoader color="#fff" size={20} /> : "Sign in"}
              </button>
            </div>
            <div className="text-center text-sm text-gray-500">
              Don't have an account? <Link href="/signUp">Sign up</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
