"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";

const navItems = [
  {
    title: "Organizations",
    href: "/dashboard",
    icon: Icons.search, // Replace with appropriate icon later
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Icons.settings,
  },
];

import { useAuth } from "@/hooks/use-auth";

export function DashboardSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (

    <aside className="fixed left-0 top-0 z-40 h-screen w-16 flex-col items-center border-r border-[#2e2e2e] bg-[#111111] py-4 hidden lg:flex">

      <Link href="/dashboard" className="mb-6">
        <Image
          src="/logo.png"
          alt="Logo"
          width={32}
          height={32}
          className="rounded-md"
        />
      </Link>
      <nav className="flex flex-col items-center gap-4 w-full px-2">
        {navItems.map((item) => (
          <Tooltip key={item.href} delayDuration={0}>
            <TooltipTrigger asChild>
              <Link
                href={item.href}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
                  pathname === item.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-[#2e2e2e] hover:text-white"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="sr-only">{item.title}</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-[#1e1e1e] border-[#2e2e2e] text-white">
              {item.title}
            </TooltipContent>
          </Tooltip>
        ))}
      </nav>
      <div className="mt-auto flex flex-col items-center gap-4 w-full px-2">
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <button 
              onClick={logout}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-[#2e2e2e] hover:text-white"
            >
              <Icons.logout className="h-5 w-5" />
            </button>
          </TooltipTrigger>

          <TooltipContent side="right" className="bg-[#1e1e1e] border-[#2e2e2e] text-white">
            Logout
          </TooltipContent>
        </Tooltip>
      </div>
    </aside>
  );
}
