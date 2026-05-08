"use client";

import Link from "next/link";
import { AuthLayout } from "@/components/auth/auth-layout";
import { SocialLogin } from "@/components/auth/social-login";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icons";
import { useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const firstName = formData.get("first_name") as string;
    const lastName = formData.get("last_name") as string;

    try {
      await api.post("/api/auth/register", { 
        email, 
        password,
        first_name: firstName,
        last_name: lastName
      });
      toast.success("Account created! Please verify your email.");
      // Store email for OTP verification
      localStorage.setItem("pending_verification_email", email);
      router.push("/otp");
    } catch (error: any) {
      toast.error(error.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  }


  return (
    <AuthLayout
      title="Create an account"
      description="Enter your details below to create your account"
    >
      <div className="grid gap-6">
        <form onSubmit={onSubmit}>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="first_name"
                  placeholder="John"
                  disabled={isLoading}
                  className="bg-[#1e1e1e] border-[#2e2e2e] focus:border-primary"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="last_name"
                  placeholder="Doe"
                  disabled={isLoading}
                  className="bg-[#1e1e1e] border-[#2e2e2e] focus:border-primary"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isLoading}
                className="bg-[#1e1e1e] border-[#2e2e2e] focus:border-primary"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoCapitalize="none"
                disabled={isLoading}
                className="bg-[#1e1e1e] border-[#2e2e2e] focus:border-primary"
              />
            </div>
            <Button disabled={isLoading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Account
            </Button>
          </div>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-[#2e2e2e]" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#111111] px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <SocialLogin />
        <p className="px-8 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline"
          >
            Sign in
          </Link>
        </p>
        <p className="px-8 text-center text-xs text-muted-foreground">
          By clicking continue, you agree to our{" "}
          <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </AuthLayout>
  );
}
