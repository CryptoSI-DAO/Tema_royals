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
import type { Player } from "@/lib/team-site-data";
import type { SupabaseClient, DashboardMode } from "../types";
import { createPlayer, deletePlayer, getMutationErrorMessage } from "../dashboard-mutations";
import { CrudDialog, DashboardSectionHeader, DeleteIconButton } from "./dashboard-section-ui";

type Props = {
  players: Player[];
  canEdit: boolean;
  mode: DashboardMode;
  isSaving: boolean;
  setIsSaving: (v: boolean) => void;
  setStatusMessage: (m: string | null) => void;
  setPlayers: (players: Player[]) => void;
  onRefresh: () => Promise<void>;
  supabaseRef: React.MutableRefObject<SupabaseClient | null>;
};

export function PlayersSection({
  players,
  canEdit: canCrud,
  mode,
  isSaving,
  setIsSaving,
  setStatusMessage,
  setPlayers,
  onRefresh,
  supabaseRef,
}: Props) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [pName, setPName] = useState("");
  const [pPos, setPPos] = useState("");
  const [pSecondPos, setPSecondPos] = useState("");
  const [pSquadNumber, setPSquadNumber] = useState("");
  const [pHeightCm, setPHeightCm] = useState("");
  const [pWeightKg, setPWeightKg] = useState("");
  const [pDateOfBirth, setPDateOfBirth] = useState("");
  const [pNationality, setPNationality] = useState("");
  const [pFoot, setPFoot] = useState<string>("");
  const [pImageUrl, setPImageUrl] = useState("");
  const [pJoinedDate, setPJoinedDate] = useState("");
  const [pPreviousClub, setPPreviousClub] = useState("");
  const [pBio, setPBio] = useState("");
  const [pFavouriteSong, setPFavouriteSong] = useState("");
  const [pInstagramUrl, setPInstagramUrl] = useState("");
  const [pFacebookUrl, setPFacebookUrl] = useState("");

  async function handleAdd() {
    if (!pName || !pPos) {
      setStatusMessage("Player name and primary position are required.");
      return;
    }

    if (mode !== "live" || !supabaseRef.current) {
      const player: Player = {
        id: createDemoId("player"),
        name: pName,
        pos: pPos,
        secondPos: pSecondPos,
        squadNumber: pSquadNumber ? parseInt(pSquadNumber) : null,
        heightCm: pHeightCm ? parseInt(pHeightCm) : null,
        weightKg: pWeightKg ? parseInt(pWeightKg) : null,
        dateOfBirth: pDateOfBirth || null,
        nationality: pNationality || null,
        languagesSpoken: [],
        foot: (pFoot as "Left" | "Right" | "Both") || null,
        imageUrl: pImageUrl || "https://picsum.photos/seed/player-demo/400/500",
        joinedDate: pJoinedDate || null,
        previousClub: pPreviousClub || null,
        bio: pBio || null,
        favouriteSong: pFavouriteSong || null,
        instagramUrl: pInstagramUrl || null,
        facebookUrl: pFacebookUrl || null,
        isActive: true,
        userId: null,
      };
      setPlayers([...players, player]);
      setStatusMessage("Player added (demo mode).");
      closeDialog();
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await createPlayer(supabaseRef.current, {
        name: pName,
        pos: pPos,
        secondPos: pSecondPos,
        squadNumber: pSquadNumber ? parseInt(pSquadNumber) : null,
        heightCm: pHeightCm ? parseInt(pHeightCm) : null,
        weightKg: pWeightKg ? parseInt(pWeightKg) : null,
        dateOfBirth: pDateOfBirth || null,
        nationality: pNationality || null,
        languagesSpoken: [],
        foot: (pFoot as "Left" | "Right" | "Both") || null,
        imageUrl: pImageUrl,
        joinedDate: pJoinedDate || null,
        previousClub: pPreviousClub || null,
        bio: pBio || null,
        favouriteSong: pFavouriteSong || null,
        instagramUrl: pInstagramUrl || null,
        facebookUrl: pFacebookUrl || null,
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
      setPlayers(players.filter((player) => player.id !== id));
      setStatusMessage("Player removed (demo mode).");
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await deletePlayer(supabaseRef.current, id);

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
    setPName("");
    setPPos("");
    setPSecondPos("");
    setPSquadNumber("");
    setPHeightCm("");
    setPWeightKg("");
    setPDateOfBirth("");
    setPNationality("");
    setPFoot("");
    setPImageUrl("");
    setPJoinedDate("");
    setPPreviousClub("");
    setPBio("");
    setPFavouriteSong("");
    setPInstagramUrl("");
    setPFacebookUrl("");
  }

  return (
    <div className="space-y-8">
      <DashboardSectionHeader
        title="Roster"
        description={canCrud ? "Maintain the official player roster." : "View the official player roster."}
        action={
          canCrud ? (
            <CrudDialog
              contentClassName="sm:max-w-[700px]"
              isSaving={isSaving}
              onOpenChange={setIsAddOpen}
              onSubmit={handleAdd}
              open={isAddOpen}
              submitLabel="Save Player"
              title="Add New Player"
              triggerLabel="Add Player"
            >
              <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto">
                <div className="grid gap-2">
                  <Label>Name *</Label>
                  <Input onChange={(e) => setPName(e.target.value)} value={pName} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label>Position *</Label>
                    <Input onChange={(e) => setPPos(e.target.value)} placeholder="e.g. Center Back" value={pPos} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Second Position</Label>
                    <Input onChange={(e) => setPSecondPos(e.target.value)} value={pSecondPos} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Squad Number</Label>
                    <Input onChange={(e) => setPSquadNumber(e.target.value)} type="number" value={pSquadNumber} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="grid gap-2">
                    <Label>Height (cm)</Label>
                    <Input onChange={(e) => setPHeightCm(e.target.value)} type="number" placeholder="182" value={pHeightCm} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Weight (kg)</Label>
                    <Input onChange={(e) => setPWeightKg(e.target.value)} type="number" placeholder="76" value={pWeightKg} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Date of Birth</Label>
                    <Input onChange={(e) => setPDateOfBirth(e.target.value)} type="date" value={pDateOfBirth} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Preferred Foot</Label>
                    <Select value={pFoot} onValueChange={setPFoot}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Left">Left</SelectItem>
                        <SelectItem value="Right">Right</SelectItem>
                        <SelectItem value="Both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Nationality</Label>
                    <Input onChange={(e) => setPNationality(e.target.value)} placeholder="e.g. Ghanaian" value={pNationality} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Previous Club</Label>
                    <Input onChange={(e) => setPPreviousClub(e.target.value)} value={pPreviousClub} />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Image URL</Label>
                  <Input onChange={(e) => setPImageUrl(e.target.value)} placeholder="https://..." value={pImageUrl} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Joined Date</Label>
                    <Input onChange={(e) => setPJoinedDate(e.target.value)} type="date" value={pJoinedDate} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Favourite Song</Label>
                    <Input onChange={(e) => setPFavouriteSong(e.target.value)} placeholder="Walkout song" value={pFavouriteSong} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Instagram</Label>
                    <Input onChange={(e) => setPInstagramUrl(e.target.value)} placeholder="https://instagram.com/..." value={pInstagramUrl} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Facebook</Label>
                    <Input onChange={(e) => setPFacebookUrl(e.target.value)} placeholder="https://facebook.com/..." value={pFacebookUrl} />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Bio</Label>
                  <Textarea onChange={(e) => setPBio(e.target.value)} value={pBio} />
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
                  <TableHead className="hidden sm:table-cell">Position</TableHead>
                  <TableHead className="hidden md:table-cell">#</TableHead>
                  <TableHead className="hidden lg:table-cell">Height</TableHead>
                  <TableHead className="hidden lg:table-cell">Nationality</TableHead>
                  {canCrud && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {players.map((player) => (
                  <TableRow key={player.id}>
                    <TableCell>
                      <div className="relative h-10 w-10 overflow-hidden rounded-full border border-accent/20 bg-muted">
                        <Image
                          alt={player.name}
                          className="object-cover"
                          fill
                          sizes="40px"
                          src={player.imageUrl || "https://picsum.photos/seed/player-fallback/400/500"}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-bold">{player.name}</div>
                      <div className="sm:hidden">
                        <Badge className="px-1.5 py-0" variant="outline">{player.pos}</Badge>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant="outline">{player.pos}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                      {player.squadNumber ?? "—"}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                      {player.heightCm ? `${player.heightCm}cm` : "—"}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                      {player.nationality || "—"}
                    </TableCell>
                    {canCrud && (
                      <TableCell className="text-right">
                        <DeleteIconButton onClick={() => handleDelete(player.id)} />
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
