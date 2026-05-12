import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0a] font-sans text-white antialiased">
      <header className="flex h-20 items-center justify-between px-4 md:px-8 lg:px-24 border-b border-[#1e1e1e]">

        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="DevCollab Logo"
            width={40}
            height={40}
          />
          <span className="text-xl font-bold tracking-tight">DevCollab</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-muted-foreground hover:text-white hover:bg-[#1e1e1e]">
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button className="bg-primary text-white hover:bg-primary/90 font-semibold px-6">
              Get Started
            </Button>
          </Link>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center px-8 text-center pt-20 pb-32">
        <div className="max-w-4xl space-y-8">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary">
            New: Organization Workspace v2.0 is out!
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
            Collaborative Workspace <br /> for Modern Developers
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Manage your teams, projects, and organizations in one unified platform. 
            Built for speed, efficiency, and seamless collaboration.
          </p>
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="bg-primary text-white hover:bg-primary/90 font-bold h-14 px-10 text-lg shadow-lg shadow-primary/20">
                Create Free Account
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-[#2e2e2e] bg-transparent text-white hover:bg-[#1e1e1e] h-14 px-10 text-lg">
              View Demo
            </Button>
          </div>
        </div>
        
        <div className="mt-24 relative w-full max-w-5xl">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-2xl blur opacity-20" />
          <div className="relative bg-[#111111] border border-[#2e2e2e] rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex h-10 items-center gap-1.5 px-4 bg-[#1e1e1e]/50 border-b border-[#2e2e2e]">
              <div className="h-3 w-3 rounded-full bg-red-500/50" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/50" />
              <div className="h-3 w-3 rounded-full bg-green-500/50" />
            </div>
            <div className="p-4 lg:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-40 rounded-xl border border-[#2e2e2e] bg-[#161616] p-4 flex flex-col justify-between">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {String.fromCharCode(65 + i)}
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 w-1/2 bg-[#2e2e2e] rounded" />
                      <div className="h-3 w-1/3 bg-[#2e2e2e]/50 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="border-t border-[#1e1e1e] py-12 px-8 lg:px-24">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="Logo" width={24} height={24} />
            <span className="font-semibold text-white">DevCollab</span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; 2026 DevCollab. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-sm text-muted-foreground hover:text-white transition-colors">GitHub</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-white transition-colors">Discord</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-white transition-colors">Twitter</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

