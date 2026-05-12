"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface Organization {
  organization: {
    id: string;
    name: string;
    created_at: string;
  };
  role: string;
}

export default function DashboardPage() {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newOrgName, setNewOrgName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchOrgs();
  }, []);

  async function fetchOrgs() {
    try {
      const data = await api.get<{ organizations: Organization[] }>("/api/orgs");
      setOrgs(data.organizations || []);
    } catch (error: any) {

      toast.error(error.message || "Failed to fetch organizations");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCreateOrg(e: React.FormEvent) {
    e.preventDefault();
    if (!newOrgName.trim()) return;

    setIsCreating(true);
    try {
      await api.post("/api/orgs", { name: newOrgName });
      toast.success("Organization created successfully!");
      setNewOrgName("");
      setIsDialogOpen(false);
      fetchOrgs();
    } catch (error: any) {
      toast.error(error.message || "Failed to create organization");
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mt-10">
          <div>
            <h1 className="text-3xl font-semibold text-white tracking-tight">Organizations</h1>
            <p className="text-muted-foreground mt-1">Manage your team workspaces and projects.</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-white hover:bg-primary/90 font-semibold gap-2">
                <Icons.plus className="h-4 w-4" />
                New Organization
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#1e1e1e] border-[#2e2e2e] text-white">
              <DialogHeader>
                <DialogTitle className="text-xl">Create Organization</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Create a new workspace for your team. You can invite members later.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateOrg}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name" className="text-sm font-medium">Organization Name</Label>
                    <Input
                      id="name"
                      placeholder="Acme Corp"
                      value={newOrgName}
                      onChange={(e) => setNewOrgName(e.target.value)}
                      disabled={isCreating}
                      className="bg-[#111111] border-[#2e2e2e] focus:border-primary"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsDialogOpen(false)}
                    className="text-muted-foreground hover:text-white"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isCreating || !newOrgName.trim()}
                    className="bg-primary text-white hover:bg-primary/90 font-semibold min-w-[100px]"
                  >
                    {isCreating ? <Icons.spinner className="h-4 w-4 animate-spin" /> : "Create"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-48 rounded-xl border border-[#2e2e2e] bg-[#111111] p-6 space-y-4">
                <Skeleton className="h-6 w-1/2 bg-[#2e2e2e]" />
                <Skeleton className="h-4 w-1/3 bg-[#2e2e2e]" />
                <div className="pt-4 flex gap-2">
                  <Skeleton className="h-8 w-20 bg-[#2e2e2e]" />
                  <Skeleton className="h-8 w-20 bg-[#2e2e2e]" />
                </div>
              </div>
            ))
          ) : orgs.length > 0 ? (
            orgs.map((item) => (
              <div
                key={item.organization.id}
                className="group relative h-48 rounded-xl border border-[#2e2e2e] bg-[#111111] p-6 transition-all hover:border-primary/50 hover:bg-[#161616]"
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-start justify-between">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                      {item.organization.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground bg-[#2e2e2e] px-2 py-0.5 rounded-full font-bold">
                      {item.role}
                    </span>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-white group-hover:text-primary transition-colors">
                      {item.organization.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Created {new Date(item.organization.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-white px-0 h-auto">
                      Settings
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs border-[#2e2e2e] hover:bg-primary hover:text-white hover:border-primary">
                      Go to Org
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full h-64 flex flex-col items-center justify-center rounded-xl border border-dashed border-[#2e2e2e] bg-[#111111]/50 text-center px-4">
              <div className="h-12 w-12 rounded-full bg-[#1e1e1e] flex items-center justify-center mb-4">
                <Icons.search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-white">No organizations found</h3>
              <p className="text-muted-foreground mt-1 max-w-sm">
                You haven't joined or created any organizations yet. Start by creating one!
              </p>
              <Button
                onClick={() => setIsDialogOpen(true)}
                variant="outline"
                className="mt-6 border-[#2e2e2e] hover:bg-[#1e1e1e] text-white"
              >
                Create your first org
              </Button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
