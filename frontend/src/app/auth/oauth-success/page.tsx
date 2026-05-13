"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function OAuthSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get("access_token");
    const refreshToken = searchParams.get("refresh_token");

    if (accessToken && refreshToken) {
      // Save tokens
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);
      
      toast.success("Login successful!");
      router.push("/dashboard");
    } else {
      toast.error("OAuth login failed. Missing tokens.");
      router.push("/login");
    }
  }, [router, searchParams]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-[#0a0a0a] text-white">
      <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
      <p className="text-muted-foreground animate-pulse">Completing login...</p>
    </div>
  );
}
