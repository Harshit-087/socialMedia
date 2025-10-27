"use client";

import { useState } from "react";
import Image from "next/image";
import { Bell } from "lucide-react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { useUser } from "@/hooks/userhook";
import { addLogout } from "@/store/reducer";
import { userQuery } from "@/app/api/userQuery";
import { followQuery } from "@/app/api/followQuery";
import { useQuery, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {AxiosResponse} from "axios"


export interface FollowResponse {
  
  msg: string;                        // "followed"
  data: {
    _id: string;
    followId: string;
    userId: string;
    createdAt?: string;
    updatedAt?: string;
  };
}
  

export interface ApiError {
  response?: {
    data?: {
      msg?: string;
      error?: string;
    };
    status?: number;
  };
  message?: string;
}


interface FollowVariables {
  userId: string;
  accountId: string;
}

export default function Navbar() {
  const [searchUser, setSearchUser] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const { username, userId, profileImage } = useUser();
  const dispatch = useDispatch();

  const { data } = useQuery({
    queryKey: ["searchUser", searchUser],
    queryFn: async ({ queryKey }) => {
      const [, searchuser] = queryKey as [string, string | undefined];
      if (!searchuser) return null;
      const res = await userQuery.searchUser(searchuser);
      return res.data.data;
    },
    enabled: searchUser.length > 0,
  });

  const handleAccount = () => setLoading(!loading);

  const followMutation = useMutation<AxiosResponse<FollowResponse>, ApiError, FollowVariables>({
    mutationFn: async ({ userId, accountId }: FollowVariables) => {
      if (userId === accountId) {
        throw new Error("Cannot follow yourself");
      }
      return await followQuery.follow(userId, accountId);
    },
    onSuccess: (res: AxiosResponse<FollowResponse>) => {
      toast.success(res.data?.msg);
      console.log("followed successfully", res);
    },
    onError: (err: ApiError) => {
      console.log("error in following", err);
    },
  });

  return (
    <>
      <div className="w-full h-16 flex items-center justify-between px-4 bg-gray-800 shadow-md relative">
        {/* Logo */}
        <div className="flex items-center gap-3 relative">
          <Image
            src="/images/brand.jpg"
            alt="Bezal"
            width={40}
            height={40}
            className="object-contain rounded-lg bg-blue-200"
          />

          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              value={searchUser}
              onChange={(e) => {
                const { value } = e.target;
                setSearchUser(value);
                setOpen(value.length > 0);
              }}
              placeholder="Search here..."
              className="w-48 md:w-80 text-white bg-gray-700 h-10 px-3 rounded-lg border-none shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm placeholder-gray-300"
            />

            {/* Search Result Dropdown */}
            {open && data && data.length > 0 && (
              <div className="absolute top-full left-0 w-56 bg-white shadow-xl rounded-2xl border border-gray-200 mt-2 p-3 flex items-center gap-3 z-20 transition-all duration-200 ease-out hover:shadow-2xl">
                <Link
                  href={`/account/${data[0]?.username}?id=${data[0]?._id}`}
                  className="flex items-center gap-3 w-full"
                  onClick={() => setOpen(false)}
                >
                  <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-blue-100 hover:ring-blue-300 transition-all duration-300">
                    {data[0]?.profileImage ? (
                      <Image
                        src={data[0]?.profileImage}
                        alt={data[0]?.username || "user"}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 text-lg font-semibold">
                        {data[0]?.username?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col flex-1">
                    <span className="text-gray-900 font-semibold text-base truncate">
                      {data[0]?.username}
                    </span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        if(userId===(data[0]._id))return;
                        followMutation.mutate({
                          userId,
                          accountId: data[0]._id,
                        });
                      }}
                      className="mt-1 w-20 bg-blue-600 text-white py-1.5 text-sm rounded-full shadow-md hover:bg-blue-500 active:scale-95 transition-all duration-200"
                    >
                      Follow
                    </button>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center gap-2">
          <Bell
            size={24}
            className="text-white hover:text-blue-400 cursor-pointer transition-colors"
          />

          {username ? (
            <div className="relative">
              <button
                onClick={handleAccount}
                className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <p className="text-white text-sm font-medium truncate">
                  {username}
                </p>
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white">
                  <Image
                    src={profileImage}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                  />
                </div>
              </button>

              {/* Dropdown Menu */}
              <div
                className={`absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 ${
                  loading ? "max-h-60" : "max-h-0 overflow-hidden"
                }`}
              >
                <ul className="flex flex-col">
                  <Link href={`/account/${username}?id=${userId}`}>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      Profile
                    </li>
                  </Link>
                  <button
                    onClick={() => {
                      dispatch(addLogout());
                      window.location.reload();
                    }}
                  >
                    <li className="px-2 py-2 hover:bg-gray-100 cursor-pointer">
                      Logout
                    </li>
                  </button>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    Help
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <Link href="/account/login">
              <p className="text-white text-sm hover:text-blue-400 transition-colors cursor-pointer">
                Login
              </p>
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
