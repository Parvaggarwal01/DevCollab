"use client";

import { AuthLayout } from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icons";
import { useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Email, 2: OTP + New Password
  const [email, setEmail] = useState("");
  const router = useRouter();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);

    try {
      if (step === 1) {
        const emailValue = formData.get("email") as string;
        setEmail(emailValue);
        await api.post("/api/auth/forgot-password", { email: emailValue });
        toast.success("Reset code sent to your email!");
        setStep(2);
      } else {
        const otp = formData.get("otp") as string;
        const newPassword = formData.get("new_password") as string;
        await api.post("/api/auth/reset-password", {
          email,
          otp,
          new_password: newPassword,
        });
        toast.success("Password reset successfully! Please login.");
        router.push("/login");
      }
    } catch (error: any) {
      toast.error(error.message || "Operation failed");
    } finally {
      setIsLoading(false);
    }
  }


  return (
    <AuthLayout
      title={step === 1 ? "Forgot password?" : "Set new password"}
      description={
        step === 1
          ? "Enter your email address and we'll send you a link to reset your password."
          : "Your new password must be different from previous passwords."
      }
    >
      <div className="grid gap-6">
        <form onSubmit={onSubmit}>
          <div className="grid gap-4">
            {step === 1 ? (
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="name@example.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  disabled={isLoading}
                  className="bg-[#1e1e1e] border-[#2e2e2e] focus:border-primary"
                />
              </div>
            ) : (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="otp">Verification Code</Label>
                  <Input
                    id="otp"
                    name="otp"
                    placeholder="6-digit code"
                    disabled={isLoading}
                    className="bg-[#1e1e1e] border-[#2e2e2e] focus:border-primary text-center tracking-widest"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    name="new_password"
                    type="password"
                    disabled={isLoading}
                    className="bg-[#1e1e1e] border-[#2e2e2e] focus:border-primary"
                  />
                </div>
              </>
            )}

            <Button disabled={isLoading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              {step === 1 ? "Send Reset Link" : "Reset Password"}
            </Button>
          </div>
        </form>

        <Link
          href="/login"
          className="flex items-center justify-center text-sm text-muted-foreground hover:text-white"
        >
          <Icons.chevronLeft className="mr-2 h-4 w-4" />
          Back to login
        </Link>
      </div>
    </AuthLayout>
  );
}
