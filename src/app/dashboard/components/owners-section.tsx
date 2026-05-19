"use client";

import { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import type { Owner } from "@/lib/team-site-data";
import type { SupabaseClient, DashboardMode } from "../types";
import { createOwner, deleteOwner, getMutationErrorMessage } from "../dashboard-mutations";
import { CrudDialog, DashboardSectionHeader, DeleteIconButton } from "./dashboard-section-ui";

type Props = {
  owners: Owner[];
  canEdit: boolean;
  mode: DashboardMode;
  isSaving: boolean;
  setIsSaving: (v: boolean) => void;
  setStatusMessage: (m: string | null) => void;
  setOwners: (owners: Owner[]) => void;
  onRefresh: () => Promise<void>;
  supabaseRef: React.MutableRefObject<SupabaseClient | null>;
};

export function OwnersSection({
  owners,
  canEdit: canCrud,
  mode,
  isSaving,
  setIsSaving,
  setStatusMessage,
  setOwners,
  onRefresh,
  supabaseRef,
}: Props) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [oName, setOName] = useState("");
  const [oTitle, setOTitle] = useState("");
  const [oBio, setOBio] = useState("");
  const [oImageUrl, setOImageUrl] = useState("");
  const [oEmail, setOEmail] = useState("");
  const [oPhone, setOPhone] = useState("");
  const [oStake, setOStake] = useState("");
  const [oJoinedDate, setOJoinedDate] = useState("");
  const [oWebsiteUrl, setOWebsiteUrl] = useState("");
  const [oLinkedinUrl, setOLinkedinUrl] = useState("");
  const [oInstagramUrl, setOInstagramUrl] = useState("");

  async function handleAdd() {
    if (!oName || !oTitle) {
      setStatusMessage("Owner name and title are required.");
      return;
    }

    if (mode !== "live" || !supabaseRef.current) {
      const owner: Owner = {
        id: createDemoId("owner"),
        name: oName,
        title: oTitle,
        bio: oBio || null,
        imageUrl: oImageUrl || "https://picsum.photos/seed/owner-demo/400/500",
        email: oEmail || null,
        phone: oPhone || null,
        ownershipStake: oStake || null,
        joinedDate: oJoinedDate || null,
        websiteUrl: oWebsiteUrl || null,
        linkedinUrl: oLinkedinUrl || null,
        instagramUrl: oInstagramUrl || null,
        isActive: true,
        userId: null,
      };
      setOwners([...owners, owner]);
      setStatusMessage("Owner added (demo mode).");
      closeDialog();
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await createOwner(supabaseRef.current, {
        name: oName,
        title: oTitle,
        bio: oBio || null,
        imageUrl: oImageUrl,
        email: oEmail || null,
        phone: oPhone || null,
        ownershipStake: oStake || null,
        joinedDate: oJoinedDate || null,
        websiteUrl: oWebsiteUrl || null,
        linkedinUrl: oLinkedinUrl || null,
        instagramUrl: oInstagramUrl || null,
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
      setOwners(owners.filter((owner) => owner.id !== id));
      setStatusMessage("Owner removed (demo mode).");
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await deleteOwner(supabaseRef.current, id);

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
    setOName("");
    setOTitle("");
    setOBio("");
    setOImageUrl("");
    setOEmail("");
    setOPhone("");
    setOStake("");
    setOJoinedDate("");
    setOWebsiteUrl("");
    setOLinkedinUrl("");
    setOInstagramUrl("");
  }

  return (
    <div className="space-y-8">
      <DashboardSectionHeader
        title="Owners & Board"
        description={canCrud ? "Manage club ownership and board members." : "View club ownership and board members."}
        action={
          canCrud ? (
            <CrudDialog
              contentClassName="sm:max-w-[600px]"
              isSaving={isSaving}
              onOpenChange={setIsAddOpen}
              onSubmit={handleAdd}
              open={isAddOpen}
              submitLabel="Save Owner"
              title="Add Owner / Board Member"
              triggerLabel="Add Owner"
            >
              <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
                <div className="grid gap-2">
                  <Label>Name *</Label>
                  <Input onChange={(e) => setOName(e.target.value)} value={oName} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Title *</Label>
                    <Input onChange={(e) => setOTitle(e.target.value)} placeholder="e.g. Chairman, CEO" value={oTitle} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Ownership Stake</Label>
                    <Input onChange={(e) => setOStake(e.target.value)} placeholder="e.g. 51%" value={oStake} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Email</Label>
                    <Input onChange={(e) => setOEmail(e.target.value)} type="email" value={oEmail} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Phone</Label>
                    <Input onChange={(e) => setOPhone(e.target.value)} value={oPhone} />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Image URL</Label>
                  <Input onChange={(e) => setOImageUrl(e.target.value)} placeholder="https://..." value={oImageUrl} />
                </div>
                <div className="grid gap-2">
                  <Label>Joined Date</Label>
                  <Input onChange={(e) => setOJoinedDate(e.target.value)} type="date" value={oJoinedDate} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label>Website</Label>
                    <Input onChange={(e) => setOWebsiteUrl(e.target.value)} placeholder="https://..." value={oWebsiteUrl} />
                  </div>
                  <div className="grid gap-2">
                    <Label>LinkedIn</Label>
                    <Input onChange={(e) => setOLinkedinUrl(e.target.value)} placeholder="https://linkedin.com/..." value={oLinkedinUrl} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Instagram</Label>
                    <Input onChange={(e) => setOInstagramUrl(e.target.value)} placeholder="https://instagram.com/..." value={oInstagramUrl} />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Bio</Label>
                  <Textarea onChange={(e) => setOBio(e.target.value)} value={oBio} />
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
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden md:table-cell">Stake</TableHead>
                  <TableHead className="hidden lg:table-cell">Email</TableHead>
                  {canCrud && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {owners.map((owner) => (
                  <TableRow key={owner.id}>
                    <TableCell>
                      <div className="relative h-10 w-10 overflow-hidden rounded-full border border-accent/20 bg-muted">
                        <Image
                          alt={owner.name}
                          className="object-cover"
                          fill
                          sizes="40px"
                          src={owner.imageUrl || "https://picsum.photos/seed/owner-fallback/400/500"}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-bold">{owner.name}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs font-semibold uppercase tracking-wider text-accent">
                        {owner.title}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                      {owner.ownershipStake || "—"}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                      {owner.email || "—"}
                    </TableCell>
                    {canCrud && (
                      <TableCell className="text-right">
                        <DeleteIconButton onClick={() => handleDelete(owner.id)} />
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
