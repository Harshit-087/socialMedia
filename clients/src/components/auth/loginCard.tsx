"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { userQuery, Data } from "@/app/api/userQuery";
import { addLogin } from "@/store/reducer";
import toast from "react-hot-toast"

export interface LoginResult {
  msg: string;
  token: string;
  email: string;
  name: string;
}

export default function CardDemo() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [formData, setFormData] = useState<Data>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Mutation for login
  const loginMutation = useMutation({
    mutationFn: async (data: Data) => await userQuery.login(data),
    onSuccess: (res) => {
        setLoading(false);
       toast.success(res.data.msg)
      dispatch(addLogin(res.data));
      router.push("/account/dashboard");
    },
    onError: (err: any) => {
       toast.error(err.data.msg)
      setErrorMsg(err?.response?.data?.msg || "Login failed");
      setLoading(false);
    },
    retry:false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    loginMutation.mutate(formData);
  };

  return (
   <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
  <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-10">
    <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Login</h2>
    <p className="text-gray-500 text-sm mb-6 text-center">
      Enter your credentials to access your account
    </p>

    <form className="flex flex-col gap-5" onSubmit={handleLogin}>
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="you@example.com"
          className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          id="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Enter password"
          className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-200"
      >
        Login
      </button>
    </form>

    <div className="mt-4 text-center">
      <a href="#" className="text-sm text-blue-600 hover:underline">
        Forgot your password?
      </a>
    </div>

    <div className="mt-6 flex justify-center gap-4">
      <button className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100 transition">
        Login with Google
      </button>
    </div>

    <div className="mt-6 text-center text-sm text-gray-500">
      Don&apos;t have an account?{" "}
      <a href="/account/signup" className="text-blue-600 hover:underline">
        Sign Up
      </a>
    </div>
  </div>
</div>

  );
}
