"use client";

import Link from "next/link";
import { AuthLayout } from "@/components/auth/auth-layout";
import { SocialLogin } from "@/components/auth/social-login";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Icons } from "@/components/icons";
import { useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const data: any = await api.post("/api/auth/login", { email, password });
      toast.success("Welcome back!");
      
      // Store tokens
      localStorage.setItem("access_token", data.token);
      localStorage.setItem("refresh_token", data.refresh_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  }


  return (
    <AuthLayout
      title="Welcome back"
      description="Enter your credentials to access your account"
    >
      <div className="grid gap-6">
        <form onSubmit={onSubmit}>
          <div className="grid gap-4">
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/reset-password"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                autoCapitalize="none"
                autoComplete="current-password"
                disabled={isLoading}
                className="bg-[#1e1e1e] border-[#2e2e2e] focus:border-primary"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" className="border-[#2e2e2e]" />
              <label
                htmlFor="remember"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground"
              >
                Remember me for 30 days
              </label>
            </div>
            <Button disabled={isLoading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Sign In
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
          Don't have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-primary hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
