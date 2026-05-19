"use client";

import { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import type { StaffMember } from "@/lib/team-site-data";
import type { SupabaseClient, DashboardMode } from "../types";
import { createStaff, deleteStaff, getMutationErrorMessage } from "../dashboard-mutations";
import { CrudDialog, DashboardSectionHeader, DeleteIconButton } from "./dashboard-section-ui";

type Props = {
  staff: StaffMember[];
  canEdit: boolean;
  mode: DashboardMode;
  isSaving: boolean;
  setIsSaving: (v: boolean) => void;
  setStatusMessage: (m: string | null) => void;
  setStaff: (staff: StaffMember[]) => void;
  onRefresh: () => Promise<void>;
  supabaseRef: React.MutableRefObject<SupabaseClient | null>;
};

export function StaffSection({
  staff,
  canEdit: canCrud,
  mode,
  isSaving,
  setIsSaving,
  setStatusMessage,
  setStaff,
  onRefresh,
  supabaseRef,
}: Props) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [sName, setSName] = useState("");
  const [sRole, setSRole] = useState("");
  const [sDepartment, setSDepartment] = useState("");
  const [sBio, setSBio] = useState("");
  const [sImageUrl, setSImageUrl] = useState("");
  const [sEmail, setSEmail] = useState("");
  const [sPhone, setSPhone] = useState("");
  const [sNationality, setSNationality] = useState("");
  const [sJoinedDate, setSJoinedDate] = useState("");

  async function handleAdd() {
    if (!sName || !sRole) {
      setStatusMessage("Staff name and role are required.");
      return;
    }

    if (mode !== "live" || !supabaseRef.current) {
      const member: StaffMember = {
        id: createDemoId("staff"),
        name: sName,
        role: sRole,
        department: sDepartment || null,
        bio: sBio || null,
        imageUrl: sImageUrl || "https://picsum.photos/seed/staff-demo/400/500",
        email: sEmail || null,
        phone: sPhone || null,
        nationality: sNationality || null,
        languagesSpoken: [],
        joinedDate: sJoinedDate || null,
        isActive: true,
        userId: null,
      };
      setStaff([...staff, member]);
      setStatusMessage("Staff member added (demo mode).");
      closeDialog();
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await createStaff(supabaseRef.current, {
        name: sName,
        role: sRole,
        department: sDepartment || null,
        bio: sBio || null,
        imageUrl: sImageUrl,
        email: sEmail || null,
        phone: sPhone || null,
        nationality: sNationality || null,
        languagesSpoken: [],
        joinedDate: sJoinedDate || null,
      });

      if (error) {
        setStatusMessage(error.message);
        return;
      }

      closeDialog();
      await onRefresh();
    } catch (error) {
      setStatusMessage(getMutationErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (mode !== "live" || !supabaseRef.current) {
      setStaff(staff.filter((member) => member.id !== id));
      setStatusMessage("Staff member removed (demo mode).");
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await deleteStaff(supabaseRef.current, id);

      if (error) {
        setStatusMessage(error.message);
        return;
      }
      await onRefresh();
    } catch (error) {
      setStatusMessage(getMutationErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  }

  function closeDialog() {
    setIsAddOpen(false);
    setSName("");
    setSRole("");
    setSDepartment("");
    setSBio("");
    setSImageUrl("");
    setSEmail("");
    setSPhone("");
    setSNationality("");
    setSJoinedDate("");
  }

  return (
    <div className="space-y-8">
      <DashboardSectionHeader
        title="Staff"
        description={canCrud ? "Manage coaching and administrative roles." : "View coaching and administrative staff."}
        action={
          canCrud ? (
            <CrudDialog
              contentClassName="sm:max-w-[600px]"
              isSaving={isSaving}
              onOpenChange={setIsAddOpen}
              onSubmit={handleAdd}
              open={isAddOpen}
              submitLabel="Save Member"
              title="Add Staff Member"
              triggerLabel="Add Staff Member"
            >
              <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
                <div className="grid gap-2">
                  <Label>Name *</Label>
                  <Input onChange={(e) => setSName(e.target.value)} value={sName} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Role *</Label>
                    <Input onChange={(e) => setSRole(e.target.value)} placeholder="e.g. Head Coach" value={sRole} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Department</Label>
                    <Input onChange={(e) => setSDepartment(e.target.value)} placeholder="e.g. Coaching, Medical" value={sDepartment} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Email</Label>
                    <Input onChange={(e) => setSEmail(e.target.value)} type="email" value={sEmail} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Phone</Label>
                    <Input onChange={(e) => setSPhone(e.target.value)} value={sPhone} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Nationality</Label>
                    <Input onChange={(e) => setSNationality(e.target.value)} placeholder="e.g. Ghanaian" value={sNationality} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Joined Date</Label>
                    <Input onChange={(e) => setSJoinedDate(e.target.value)} type="date" value={sJoinedDate} />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Image URL</Label>
                  <Input onChange={(e) => setSImageUrl(e.target.value)} placeholder="https://..." value={sImageUrl} />
                </div>
                <div className="grid gap-2">
                  <Label>Bio</Label>
                  <Textarea onChange={(e) => setSBio(e.target.value)} value={sBio} />
                </div>
              </div>
            </CrudDialog>
          ) : null
        }
      />

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">Img</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="hidden md:table-cell">Department</TableHead>
                  <TableHead className="hidden lg:table-cell">Nationality</TableHead>
                  {canCrud && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {staff.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="relative h-10 w-10 overflow-hidden rounded-full border border-accent/20 bg-muted">
                        <Image
                          alt={member.name}
                          className="object-cover"
                          fill
                          sizes="40px"
                          src={member.imageUrl || "https://picsum.photos/seed/staff-fallback/400/500"}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-bold">{member.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs font-semibold uppercase tracking-wider text-accent sm:text-sm">
                        {member.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                      {member.department || "—"}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                      {member.nationality || "—"}
                    </TableCell>
                    {canCrud && (
                      <TableCell className="text-right">
                        <DeleteIconButton onClick={() => handleDelete(member.id)} />
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function createDemoId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}
