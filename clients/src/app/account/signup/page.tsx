"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Mail, User, Lock, Chrome, Globe, FileText } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch"; // optional switch toggle
import {useQuery,useMutation} from "@tanstack/react-query"
import {userQuery} from "@/app/api/userQuery"
import {addSignup} from "@/store/reducer"
import {useDispatch} from "react-redux"
import toast from "react-hot-toast"

export interface formData{
  email: string,
    username: string,
    password: string,
    bio: string,
    website: string,
    profileImage: string,
    isPrivate: boolean,
}

export default function Signin() {
  const router = useRouter();
  const dispatch = useDispatch()
  const [formData, setFormData] = useState<formData>({
    email: "",
    username: "",
    password: "",
    bio: "",
    website: "",
    profileImage: "",
    isPrivate: false,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  // 🧠 Validation
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.username) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🖊️ Handle input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };


  const signupMutation = useMutation({
    mutationFn:async(data:formData)=>{
      return await userQuery.signup(data);
    },
    onSuccess:(res)=>{
      console.log("signup is success" , res)
       toast.success(res.data.msg)
      dispatch(addSignup(res.data));
      
      router.push("/account/login")

    },
    onError:(err)=>{
      console.log("signup error",err)
      //  toast.error(err.msg)
      alert("Registration failed — please check console for details.");
    }
  })

  // 📤 Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    signupMutation.mutate(formData)
    
      setIsLoading(false);
    
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <Card className="border-0 shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle>Create an account</CardTitle>
            <CardDescription>
              Enter your details below to create your account
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* --- Google Button (optional) --- */}
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={isLoading}
            >
              <Chrome className="mr-2 h-4 w-4" />
              Continue with Google
            </Button>

            {/* --- Divider --- */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with email
                </span>
              </div>
            </div>

            {/* --- FORM --- */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Choose a username"
                    className="pl-10"
                    value={formData.username}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                </div>
                {errors.username && (
                  <p className="text-sm text-destructive">{errors.username}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Create a password"
                    className="pl-10"
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <textarea
                  id="bio"
                  name="bio"
                  placeholder="Tell us a bit about yourself..."
                  className="w-full border rounded-md p-2 text-sm"
                  rows={3}
                  value={formData.bio}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </div>

              {/* Website */}
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="website"
                    name="website"
                    type="url"
                    placeholder="https://yourwebsite.com"
                    className="pl-10"
                    value={formData.website}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Profile Image URL */}
              <div className="space-y-2">
                <Label htmlFor="profileImage">Profile Image URL</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="profileImage"
                    name="profileImage"
                    type="url"
                    placeholder="Paste image link or upload later"
                    className="pl-10"
                    value={formData.profileImage}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Private Profile Toggle */}
              <div className="flex items-center justify-between">
                <Label htmlFor="isPrivate">Private Account</Label>
                <Switch
                  id="isPrivate"
                  checked={formData.isPrivate}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, isPrivate: checked }))
                  }
                  disabled={isLoading}
                />
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </form>

            {/* Footer */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <button
                  type="button"
                  className="underline underline-offset-4 hover:text-primary"
                  onClick={() => router.push("/account/login")}
                >
                  Sign in
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
