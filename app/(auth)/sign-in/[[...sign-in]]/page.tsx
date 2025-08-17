"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignIn } from "@clerk/nextjs";
import type React from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff } from "lucide-react";

interface SignInFormProps extends React.ComponentProps<"div"> {
  signInWithEmail: ({
    emailAddress,
    password,
  }: {
    emailAddress: string;
    password: string;
  }) => Promise<void>;
  clerkError: string;
  isLoading: boolean;
}

function SignInForm({
  className,
  signInWithEmail,
  clerkError,
  isLoading,
  ...props
}: SignInFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;

    await signInWithEmail({ 
      emailAddress: formData.email, 
      password: formData.password 
    });
  };

  return (
    <div
      className={cn(
        "flex min-h-screen flex-col justify-center bg-gradient-to-b from-gray-50 to-gray-100 py-12 sm:px-6 lg:px-8",
        className
      )}
      {...props}
    >
      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <div className="text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              Enter your email and password to sign in to your account
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                required
                autoComplete="email"
                autoFocus
                value={formData.email}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            
            {/* CAPTCHA Widget */}
            <div id="clerk-captcha"></div>
            
            {clerkError && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-4">
                <p className="text-sm text-destructive text-center">
                  {clerkError}
                </p>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || !formData.email.trim() || !formData.password.trim()}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-center text-muted-foreground w-full">
            Don't have an account?{" "}
            <Link
              href="/sign-up"
              className="font-medium text-primary hover:underline"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

const SignIn = () => {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [clerkError, setClerkError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const signInWithEmail = async ({
    emailAddress,
    password,
  }: {
    emailAddress: string;
    password: string;
  }) => {
    if (!isLoaded || isLoading) {
      return;
    }

    setIsLoading(true);
    setClerkError("");

    try {
      const result = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/");
      } else {
        setClerkError("Sign in incomplete. Please try again.");
      }
    } catch (err: any) {
      setClerkError(
        err.errors?.[0]?.message || "An error occurred during sign in"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SignInForm 
      signInWithEmail={signInWithEmail} 
      clerkError={clerkError} 
      isLoading={isLoading}
    />
  );
};

export default SignIn;