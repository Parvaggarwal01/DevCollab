"use client";

import { AuthLayout } from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { Icons } from "@/components/icons";
import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function OTPPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    const storedEmail = localStorage.getItem("pending_verification_email");
    if (!storedEmail) {
      router.push("/register");
      return;
    }
    setEmail(storedEmail);
  }, [router]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    try {
      await api.post("/api/auth/verifyotp", { email, otp: value });
      toast.success("Email verified successfully!");
      localStorage.removeItem("pending_verification_email");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.message || "Verification failed");
    } finally {
      setIsLoading(false);
    }
  }


  return (
    <AuthLayout
      title="Verify your email"
      description="We've sent a 6-digit code to your email. Please enter it below."
    >
      <div className="grid gap-6">
        <form onSubmit={onSubmit} className="flex flex-col items-center gap-6">
          <InputOTP
            maxLength={6}
            value={value}
            onChange={(value) => setValue(value)}
            disabled={isLoading}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} className="w-12 h-14 text-xl border-[#2e2e2e] bg-[#1e1e1e]" />
              <InputOTPSlot index={1} className="w-12 h-14 text-xl border-[#2e2e2e] bg-[#1e1e1e]" />
              <InputOTPSlot index={2} className="w-12 h-14 text-xl border-[#2e2e2e] bg-[#1e1e1e]" />
            </InputOTPGroup>
            <InputOTPSeparator className="text-[#2e2e2e]" />
            <InputOTPGroup>
              <InputOTPSlot index={3} className="w-12 h-14 text-xl border-[#2e2e2e] bg-[#1e1e1e]" />
              <InputOTPSlot index={4} className="w-12 h-14 text-xl border-[#2e2e2e] bg-[#1e1e1e]" />
              <InputOTPSlot index={5} className="w-12 h-14 text-xl border-[#2e2e2e] bg-[#1e1e1e]" />
            </InputOTPGroup>
          </InputOTP>

          <Button disabled={isLoading || value.length !== 6} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Verify OTP
          </Button>
        </form>

        <div className="text-center text-sm text-muted-foreground">
          Didn't receive the code?{" "}
          <button className="font-medium text-primary hover:underline">
            Resend code
          </button>
        </div>

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
