"use client";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

export function SocialLogin() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Button variant="outline" className="w-full bg-[#1e1e1e] border-[#2e2e2e] hover:bg-[#2e2e2e] hover:text-white">
        <Icons.gitHub className="mr-2 h-4 w-4" />
        GitHub
      </Button>
      <Button variant="outline" className="w-full bg-[#1e1e1e] border-[#2e2e2e] hover:bg-[#2e2e2e] hover:text-white">
        <Icons.google className="mr-2 h-4 w-4" />
        Google
      </Button>
    </div>
  );
}
