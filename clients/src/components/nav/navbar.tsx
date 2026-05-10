"use client";

import { useState ,useEffect,useRef} from "react";
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
import { AxiosResponse } from "axios";
import { motion } from "framer-motion";
import { MoveLeft } from "lucide-react";
import {useQueryClient} from "@tanstack/react-query"
import {useRouter } from "next/navigation"



export interface userInfo{ 
    _id:string,
    username:string,
    role:string,
    email:string,
    isPrivate:boolean,
    profileImage:string,
    website:string,
    bio:string,
   
    
}


export interface FollowResponse {
  
  msg: string;                        // "followed"
  data: {
    _id: string;
    followingId: string;
    followerId: string;
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


export interface FollowVariables {
  userId: string;
  accountId: string;
  token:string
}




export default function Navbar() {
  const [searchUser, setSearchUser] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
   const [pop,setPop] = useState<boolean>(false)
  const { username,token, userId, profileImage } = useUser();
  const dispatch = useDispatch();

  const inputRef = useRef<HTMLInputElement>(null);

  const queryclient=  useQueryClient();
  const router = useRouter()

  const { data: searchedUsers } = useQuery({
    queryKey: ["searchUser", searchUser,token],
    queryFn: async ({ queryKey }) => {
      const [, searchuser,token] = queryKey as [string, string | undefined,string];
      if (!searchuser || !token) return null;
      const res = await userQuery.searchUser(searchuser,token);
      return res.data.data;
    },
    enabled: searchUser.length > 0,
  });

    const{data,isLoading:followLoading,error:followError}=useQuery({
      queryKey:["follow",searchedUsers?.[0]?._id,userId,token],
      queryFn:async({queryKey})=>{
         const [,id,userId,token]=queryKey as [string, string|undefined ,string|undefined,string];
         if(!id || !userId || !token) return ;
         const res= await followQuery.following(id,userId,token)
        //  toast.success(res.data.msg)
         return res.data.data;
      },
      enabled:!!searchedUsers && !!userId
    })
  

 

  const handleAccount = () => setLoading(!loading);

  const followMutation = useMutation<AxiosResponse<FollowResponse>, ApiError, FollowVariables>({
    mutationFn: async ({ userId, accountId ,token}: FollowVariables) => {
      if (userId === accountId) {
        throw new Error("Cannot follow yourself");
      }
      return await followQuery.follow(userId, accountId,token);
    },
    onSuccess: (res: AxiosResponse<FollowResponse>) => {
      toast.success(res.data?.msg);
      queryclient.invalidateQueries({queryKey:["follow",userId,token]})
     
    },
    onError: (err: ApiError) => {
      console.log("error in following", err);
    },
  });

  const handlePopUp=()=>{
    setPop(true);
} 

 useEffect(()=>{
  if(pop) {
   inputRef.current?.focus()
  }
 },[pop])

useEffect (()=>{
  if(!Array.isArray(searchedUsers)) return ; 

  if( searchedUsers.length===1  &&    searchedUsers[0]._id === userId){
   router.push(`/account/${searchedUsers[0].username}?id=${searchedUsers[0]._id}`)
  }
},[searchedUsers,router])

  return (
    <>
      <div className="max-w-[1200px] h-16 flex items-center justify-between bg-gray-800 shadow-md max-md:relative px-2 md:px-6  md:h-16  mx-auto">
        {/* Logo */}
        <div className="flex w-64  items-center  gap-3 relative md:gap-10 lg:flex-[0.85] lg:gap-36">
         
          <Image
            src="/images/brand.jpg"
            alt="Bezal"
           width={56}
          height={16}
            className="object-contain rounded-lg lg:ml-10"
          />
          
 
          {/* Search Box */}
          <div>
            <input
              
              onClick={handlePopUp}
              placeholder="Search here..."
              className="w-48 md:w-96 text-white bg-gray-700 h-10 px-3 rounded-lg border-none lg:w-[550px]  shadow-md  focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm placeholder-gray-300"
            />

            {pop && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex flex-col items-center justify-start bg-black/70 backdrop-blur-md p-6"
  >
    {/* Header Bar */}
    <div className="flex items-center w-full max-w-xl mt-10 bg-gray-800/80 rounded-full px-4 py-2 shadow-lg ring-1 ring-gray-700">
      {/* Back / Close Button */}
      <button
        onClick={() => {
          setPop(false);
          setSearchUser("");
        }}
        className="p-2 rounded-full hover:bg-gray-700 transition">
        <MoveLeft className="text-gray-300 w-5 h-5" />
      </button>

      {/* Search Input */}
      <input
      ref={inputRef}
        type="text"
        value={searchUser}
        onChange={(e) => {
          const { value } = e.target;
          setSearchUser(value);
          setOpen(value.length > 0);
        }}
        placeholder="Search users..."
        className="flex-1 bg-transparent text-gray-200 placeholder-gray-400 px-3 text-lg focus:outline-none"
      />
    </div>

    {/* User List */}
    {searchedUsers && (
      <div className="w-full flex flex-col items-center gap-4 p-4">
        {searchedUsers.map((user: userInfo, idx: number) => (
          <Link key={idx} href ={`/account/${user.username}?id=${user._id}`} >
          <div
            key={idx}
            className="w-full max-w-md bg-gradient-to-br from-gray-800 to-gray-700 text-white rounded-2xl shadow-lg flex items-center p-4 transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl ">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              <div className="relative w-24 aspect-square rounded-full overflow-hidden ring-2 ring-blue-500">
                <Image
                  src={user.profileImage}
                  alt={user.username || "user"}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* User Info */}
            {user._id !=userId ? (
              <div className="flex flex-col justify-center px-4 w-full">
              <h2 className="text-lg font-semibold capitalize">{user.username}</h2>
              <p className="text-sm text-gray-300">Suggested for you</p>


             { (!data?.isFollowing)  ?
             ( <button
                onClick={(e) => {
                  e.preventDefault();
                  if (userId === user._id) return;
                  followMutation.mutate({ 
                    userId,
                    accountId: user._id,
                    token
                  });
                }}
                className="mt-2 w-24 bg-blue-600 text-white py-1.5 text-sm rounded-full shadow-md hover:bg-blue-500 active:scale-95 transition-all duration-200"
              >
                Follow
              </button>)
              : <button className="mt-2 w-24 bg-gray-600 text-white py-1.5 text-sm rounded-full shadow-md cursor-not-allowed">
                Following
              </button>
              }

             
             
            </div>
            ) :null }
            
            
          </div>
          </Link>
        ))}
      </div>
    )}
  </motion.div>
)}


            {/* Search Result Dropdown
            {open && data && data.length > 0 && (
              <div className="absolute top-full left-0 w-56 bg-white shadow-xl rounded-2xl border border-gray-200 mt-2 p-3 flex items-center gap-3 z-20 transition-all duration-200 ease-out hover:shadow-2xl">
                <Link
                  href={`/account/${data[0]?.username}?id=${data[0]?._id}`}
                  className="flex items-center gap-3 w-full"
                  onClick={() => setOpen(false)}
                >
                  <div className="max-md:relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-blue-100 hover:ring-blue-300 transition-all duration-300">
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
            )} */}
          </div>
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center gap-1 md:gap-6 lg:ml-16 lg:flex-[0.15]">
          <Bell
            size={24}
            className="text-white hover:text-blue-400 cursor-pointer transition-colors"
          />

          {username ? (
            <div className="max-md:relative">
              <button
                onClick={handleAccount}
                className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <p className="text-white text-sm font-medium truncate hidden md:block">
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
                className={`absolute max-sm:right-0 mt-2 w-36 z-50 max-md:right-5 lg:top-24 lg:-translate-9 bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 ${
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
  }}
  className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
>
  Logout
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
