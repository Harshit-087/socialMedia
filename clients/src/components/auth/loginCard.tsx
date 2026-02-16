"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { userQuery, Data } from "@/app/api/userQuery";
import { addLogin } from "@/store/reducer";
import toast from "react-hot-toast";
import { AxiosResponse } from "axios";
import Link from "next/link";

interface LoginResponse {
  msg: string;
  token: string;
  user: {
    _id: string;
    username: string;
    email: string;
    profileImage?: string;
  };
}

export interface ApiError {
  response?: {
    data?: {
      msg?: string;
    };
  };
  message?: string;
}

export default function LoginCard() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [formData, setFormData] = useState<Data>({
    email: "",
    password: "",
  });

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loginMutation = useMutation<
    AxiosResponse<LoginResponse>,
    ApiError,
    Data
  >({
    mutationFn: (data) => userQuery.login(data),

    onSuccess: (res) => {
      toast.success(res.data.msg);
      dispatch(addLogin(res.data));
      router.push("/account/dashboard");
    },

    onError: (err) => {
      const message =
        err?.response?.data?.msg ||
        err?.message ||
        "Login failed";

      toast.error(message);
      setErrorMsg(message);
    },

    retry: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.email || !formData.password) {
      setErrorMsg("Email and password are required");
      return;
    }

    loginMutation.mutate(formData);
  };

  return (
    <div className="flex w-full min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="w-full max-w-md rounded-2xl bg-white p-10 shadow-xl">
        <h1 className="mb-2 text-center text-3xl font-bold text-gray-900">
          Welcome Back
        </h1>
        <p className="mb-6 text-center text-sm text-gray-500">
          Login to continue to your account
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="mt-1 w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="mt-1 w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {errorMsg && (
            <p className="text-sm text-red-600">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loginMutation.isPending ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link
            href="#"
            className="text-sm text-blue-600 hover:underline"
          >
            Forgot your password?
          </Link>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link
            href="/account/signup"
            className="font-medium text-blue-600 hover:underline"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
