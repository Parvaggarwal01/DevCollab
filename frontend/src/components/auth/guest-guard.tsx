"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export function GuestGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isGuest, setIsGuest] = useState<boolean | null>(null);

  useEffect(() => {
    const checkGuest = () => {
      const token = localStorage.getItem("access_token");
      
      if (token) {
        setIsGuest(false);
        router.push("/dashboard");
      } else {
        setIsGuest(true);
      }
    };

    checkGuest();
  }, [router]);

  if (isGuest === null) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#111111]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isGuest) {
    return null;
  }

  return <>{children}</>;
}
