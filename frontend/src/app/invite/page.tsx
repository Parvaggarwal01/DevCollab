"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Loader2, CheckCircle2, AlertTriangle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";

interface UserProfile {
  email: string;
}

function InviteContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const router = useRouter();
  const { logout } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState<"loading" | "mismatch" | "success" | "error">("loading");
  const [invitedEmail, setInvitedEmail] = useState("");
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);

  useEffect(() => {
    if (token) {
      checkInvitation();
    } else {
      setStatus("error");
      setIsLoading(false);
      toast.error("Invitation token is missing.");
    }
  }, [token]);

  async function checkInvitation() {
    setIsLoading(true);
    try {
      // 1. Get current user if logged in
      const accessToken = localStorage.getItem("access_token");
      
      if (!accessToken) {
        // Not logged in - store token and redirect
        localStorage.setItem("pending_invite_token", token as string);
        router.push(`/login?returnUrl=/invite?token=${token}`);
        return;
      }

      // 2. Fetch current user profile to verify email
      const user = await api.get<UserProfile>("/api/me");
      setCurrentUserEmail(user.email);

      // 3. Attempt to join directly
      await api.post("/api/orgs/join", { token });
      
      setStatus("success");
      setIsSuccessDialogOpen(true);
    } catch (error: any) {
      console.error("Invite error:", error);
      if (error.message?.toLowerCase().includes("email") || error.message?.toLowerCase().includes("mismatch")) {
        setStatus("mismatch");
      } else {
        setStatus("error");
        toast.error(error.message || "Failed to process invitation");
      }
    } finally {
      setIsLoading(false);
    }
  }

  const handleGoToDashboard = () => {
    setIsSuccessDialogOpen(false);
    router.push("/dashboard");
  };

  if (status === "loading") {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-[#0a0a0a] text-white">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground animate-pulse">Verifying invitation...</p>
      </div>
    );
  }

  if (status === "mismatch") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-4">
        <Card className="w-full max-w-md border-[#2e2e2e] bg-[#111111] text-white">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/10">
              <AlertTriangle className="h-6 w-6 text-yellow-500" />
            </div>
            <CardTitle className="text-2xl font-bold">Email Mismatch</CardTitle>
            <CardDescription className="text-muted-foreground">
              This invitation was sent to a different email address.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-sm text-muted-foreground">
              You are currently logged in as <span className="text-white font-medium">{currentUserEmail}</span>.
              Please log out and sign in with the email address that received the invitation.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button onClick={logout} className="w-full bg-primary hover:bg-primary/90 text-white font-semibold">
              <LogOut className="mr-2 h-4 w-4" />
              Logout and Switch Account
            </Button>
            <Button variant="ghost" onClick={() => router.push("/dashboard")} className="w-full text-muted-foreground hover:text-white">
              Go to Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="flex h-screen w-full items-center justify-center bg-[#0a0a0a]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>

      <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
        <DialogContent className="bg-[#1e1e1e] border-[#2e2e2e] text-white sm:max-w-md">
          <DialogHeader className="flex flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            </div>
            <DialogTitle className="text-2xl font-bold">Successfully Joined!</DialogTitle>
            <DialogDescription className="text-muted-foreground pt-2">
              You have been successfully added to the organization. Welcome to the team!
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center pt-6">
            <Button onClick={handleGoToDashboard} className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-6 text-lg">
              Go to Dashboard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function InvitePage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen w-full items-center justify-center bg-[#0a0a0a]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    }>
      <InviteContent />
    </Suspense>
  );
}

