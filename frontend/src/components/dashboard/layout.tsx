import { DashboardSidebar } from "./sidebar";
import { DashboardNavbar } from "./navbar";
import { AuthGuard } from "@/components/auth/auth-guard";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-[#0a0a0a]">
        <DashboardSidebar />
        <div className="flex flex-1 flex-col lg:pl-16">
          <DashboardNavbar />
          <main className="flex-1 pt-16 px-4 md:px-8 py-8">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
