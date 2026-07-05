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
    <div className="w-full max-w-md px-4 sm:px-0">
      <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/80 p-6 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:shadow-blue-500/10 dark:bg-gray-900/80 sm:p-10">
        
        {/* Subtle decorative glow effect */}
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl"></div>
        <div className="absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-indigo-500/10 blur-3xl"></div>

        <div className="relative">
          <h1 className="mb-2 text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-white">
            Welcome Back
          </h1>
          <p className="mb-8 text-center text-xs text-gray-500 sm:text-sm dark:text-gray-400">
            Login to continue to your account
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider text-gray-600 sm:text-sm dark:text-gray-300"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={formData?.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50/50 p-3 text-sm text-gray-900 transition-all placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white dark:focus:border-blue-500 dark:focus:bg-gray-900"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold uppercase tracking-wider text-gray-600 sm:text-sm dark:text-gray-300"
                >
                  Password
                </label>
                <Link
                  href="#"
                  className="text-xs font-medium text-blue-600 hover:text-blue-500 hover:underline dark:text-blue-400"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                value={formData?.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50/50 p-3 text-sm text-gray-900 transition-all placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-800/50 dark:text-white dark:focus:border-blue-500 dark:focus:bg-gray-900"
                required
              />
            </div>

            {errorMsg && (
              <div className="rounded-lg bg-red-50 p-3 text-xs font-medium text-red-600 dark:bg-red-950/30 dark:text-red-400">
                ⚠️ {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={loginMutation?.isPending}
              className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 hover:shadow-blue-500/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loginMutation?.isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647s" />
                  </svg>
                  Logging in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-xs text-gray-500 sm:text-sm dark:text-gray-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/account/signup"
              className="font-semibold text-blue-600 transition-colors hover:text-blue-500 hover:underline dark:text-blue-400"
            >
              Sign up free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
