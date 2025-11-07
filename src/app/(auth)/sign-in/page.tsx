"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { login } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Eye, EyeOff, Loader2, ShoppingBag } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long." }),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const auth = useSelector((state: RootState) => state.auth);
  const dark = useSelector((state: RootState) => state.theme.dark);

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (auth.token) {
      router.push("/");
    }
  }, [auth.token, router]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormInputs) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      const fakeToken = "fake-jwt-token-for-" + data.email;
      dispatch(
        login({
          token: fakeToken,
          user: { name: "John Doe", email: data.email },
        })
      );

      toast.success("Login successful!", {
        description: "Welcome back! Redirecting you to the homepage.",
      });

      router.push("/");
    } catch (error) {
      toast.error("Login Failed!", {
        description: "Invalid email or password. Please try again.",
      });
      console.error(error);
    }
  };

  return (
    <div className={`${dark ? "bg-black text-white" : "bg-white text-gray-900"} min-h-screen flex flex-col justify-center items-center px-4`}>
      {/* Logo & Intro */}
      <div className="text-center mb-8">
        <Link href="/" className="flex items-center justify-center gap-2 mb-2">
          <div className={`${dark ? "bg-neutral-800" : "bg-gray-200"} p-2.5 rounded-xl`}>
            <ShoppingBag className={`${dark ? "text-white" : "text-gray-900"} w-6 h-6`} />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">{/* dark handled via parent */}
            ShopEase
          </h1>
        </Link>
        <p className={`${dark ? "text-neutral-400" : "text-gray-500"}`}>
          Welcome back! Please sign in to your account.
        </p>
      </div>

      {/* Card */}
      <Card className={`${dark ? "bg-neutral-900 text-white" : "bg-white text-gray-900"} w-full max-w-md shadow-lg`}>
        <CardHeader>
          <CardTitle className="text-2xl">Sign In</CardTitle>
          <CardDescription>
            Enter your credentials to access your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${dark ? "text-neutral-400" : "text-gray-400"}`} />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className={`pl-10 ${dark ? "bg-neutral-800 text-white border-neutral-700 placeholder-neutral-500" : "bg-gray-100 text-gray-900"}`}
                  {...register("email")}
                  disabled={isSubmitting}
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${dark ? "text-neutral-400" : "text-gray-400"}`} />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`pl-10 pr-10 ${dark ? "bg-neutral-800 text-white border-neutral-700 placeholder-neutral-500" : "bg-gray-100 text-gray-900"}`}
                  {...register("password")}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${dark ? "text-neutral-400 hover:text-white" : "text-gray-400 hover:text-gray-600"}`}
                  disabled={isSubmitting}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className={`w-full pt-6 pb-6 text-base cursor-pointer ${dark ? "bg-neutral-700 text-white hover:bg-neutral-600" : "bg-blue-600 text-white hover:bg-blue-700"}`}
            >
              {isSubmitting ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Signing in...</> : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
