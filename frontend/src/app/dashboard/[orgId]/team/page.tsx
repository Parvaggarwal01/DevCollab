"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/layout";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Member {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  joined_at: string;
}

export default function TeamPage() {
  const { orgId } = useParams();
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInviting, setIsInviting] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, [orgId]);

  async function fetchMembers() {
    try {
      const data = await api.get<{ members: Member[] }>(`/api/orgs/${orgId}/members`);
      
      // Sort members: Owner -> Admin -> Member
      const roleOrder: Record<string, number> = { owner: 1, admin: 2, member: 3 };
      const sortedMembers = (data.members || []).sort((a, b) => {
        return (roleOrder[a.role.toLowerCase()] || 4) - (roleOrder[b.role.toLowerCase()] || 4);
      });

      setMembers(sortedMembers);
    } catch (error: any) {
      console.error("Failed to fetch members:", error);
    } finally {
      setIsLoading(false);
    }
  }


  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    setIsInviting(true);
    try {
      await api.post(`/api/orgs/${orgId}/invite`, {
        email: inviteEmail,
        role: inviteRole,
      });
      toast.success(`Invitation sent to ${inviteEmail}`);
      setInviteEmail("");
      setIsDialogOpen(false);
      fetchMembers();
    } catch (error: any) {
      toast.error(error.message || "Failed to send invitation");
    } finally {
      setIsInviting(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mt-4">
          <div>
            <h1 className="text-3xl font-semibold text-white tracking-tight">Team Members</h1>
            <p className="text-muted-foreground mt-1">Manage who has access to this organization.</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-white hover:bg-primary/90 font-semibold gap-2">
                <Icons.plus className="h-4 w-4" />
                Invite Member
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#1e1e1e] border-[#2e2e2e] text-white">
              <DialogHeader>
                <DialogTitle className="text-xl">Invite to Team</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Send an invitation to a new team member.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleInvite}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="teammate@example.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      disabled={isInviting}
                      className="bg-[#111111] border-[#2e2e2e] focus:border-primary"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="role" className="text-sm font-medium">Role</Label>
                    <Select value={inviteRole} onValueChange={setInviteRole} disabled={isInviting}>
                      <SelectTrigger className="bg-[#111111] border-[#2e2e2e]">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1e1e1e] border-[#2e2e2e] text-white">
                        <SelectItem value="member">Member</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
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
                    disabled={isInviting || !inviteEmail.trim()}
                    className="bg-primary text-white hover:bg-primary/90 font-semibold min-w-[120px]"
                  >
                    {isInviting ? <Icons.spinner className="h-4 w-4 animate-spin" /> : "Send Invite"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-xl border border-[#2e2e2e] bg-[#111111] overflow-hidden">
          <Table>
            <TableHeader className="bg-[#1e1e1e]/50">
              <TableRow className="border-[#2e2e2e] hover:bg-transparent">
                <TableHead className="text-muted-foreground">Member</TableHead>
                <TableHead className="text-muted-foreground">Role</TableHead>
                <TableHead className="text-muted-foreground">Joined At</TableHead>
                <TableHead className="text-right text-muted-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i} className="border-[#2e2e2e]">
                    <TableCell><Skeleton className="h-10 w-40 bg-[#2e2e2e]" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 bg-[#2e2e2e]" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24 bg-[#2e2e2e]" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto bg-[#2e2e2e]" /></TableCell>
                  </TableRow>
                ))
              ) : members.length > 0 ? (
                members.map((member) => (
                  <TableRow key={member.user_id} className="border-[#2e2e2e] hover:bg-[#1e1e1e]/30">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 border border-[#2e2e2e]">
                          <AvatarFallback className="bg-[#2e2e2e] text-[10px] text-white">
                            {member.first_name?.[0]}{member.last_name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-white">{member.first_name} {member.last_name}</span>
                          <span className="text-xs text-muted-foreground">{member.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground bg-[#2e2e2e] px-2 py-0.5 rounded-full font-bold">
                        {member.role}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(member.joined_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white">
                        <Icons.menu className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                    No members found. Invite someone to your team!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
}
