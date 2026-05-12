"use client";

import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { toast } from "sonner";

export function useAuth() {
  const router = useRouter();

  const logout = async () => {
    try {
      // Call backend logout
      await api.post("/api/auth/logout", {});
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      // Always clear local state even if API fails
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
      router.push("/login");
    }
  };

  return { logout };
}
