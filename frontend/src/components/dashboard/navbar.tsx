"use client";

import { Icons } from "@/components/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

const navItems = [
  {
    title: "Organizations",
    href: "/dashboard",
    icon: Icons.search,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Icons.settings,
  },
];

import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export function DashboardNavbar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [user, setUser] = useState<UserProfile | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await api.get<UserProfile>("/api/me");
        setUser(data);
      } catch (error) {
        console.error("Failed to fetch user Profile", error)
      }
    }
    fetchUser();
  },[])

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-16 z-30 flex h-16 items-center justify-between border-b border-[#2e2e2e] bg-[#111111]/80 px-4 md:px-8 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden text-muted-foreground hover:text-white">
              <Icons.menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-[#111111] border-[#2e2e2e] text-white w-64 p-0">
            <SheetHeader className="p-6 border-b border-[#2e2e2e]">
              <SheetTitle className="text-white flex items-center gap-2">
                <Icons.spinner className="h-5 w-5 text-primary" />
                DevCollab
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-2 p-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors",
                    pathname === item.href
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-[#2e2e2e] hover:text-white"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.title}
                </Link>
              ))}
              <div className="mt-8 border-t border-[#2e2e2e] pt-4">
                <button 
                  onClick={logout}
                  className="flex items-center gap-3 px-4 py-2 w-full text-left rounded-lg text-muted-foreground hover:bg-[#2e2e2e] hover:text-white transition-colors"
                >
                  <Icons.logout className="h-5 w-5" />
                  Logout
                </button>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
        
        <div className="hidden sm:flex items-center gap-4">
          <h2 className="text-sm font-medium text-muted-foreground">Dashboard</h2>
          <Icons.chevronRight className="h-4 w-4 text-muted-foreground/50" />
          <span className="text-sm font-medium text-white">Organizations</span>
        </div>
        <div className="flex sm:hidden items-center">
          <span className="text-sm font-medium text-white">Organizations</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white">
          <Icons.bell className="h-5 w-5" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8 border border-[#2e2e2e]">
                <AvatarImage src="" alt="User" />
                <AvatarFallback className="bg-[#2e2e2e] text-xs text-white">{user ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase(): ".."}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-[#1e1e1e] border-[#2e2e2e] text-white" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user ? `${user.first_name}${user.last_name}` : "Loading..."}</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.email || "..."}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#2e2e2e]" />
            <DropdownMenuItem className="hover:bg-[#2e2e2e] focus:bg-[#2e2e2e] cursor-pointer">
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-[#2e2e2e] focus:bg-[#2e2e2e] cursor-pointer">
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#2e2e2e]" />
            <DropdownMenuItem 
              onClick={logout}
              className="text-red-400 hover:bg-red-400/10 focus:bg-red-400/10 cursor-pointer"
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
