import type { Database } from "@/types/database";

export type Goal = {
  id: string;
  player: string;
  minute: number;
  team: "Mariners" | "Opponent";
};

export type Fixture = {
  id: string;
  opponent: string;
  date: string;
  time: string;
  venue: string;
  status: "upcoming" | "completed";
  result?: {
    marinersScore: number;
    opponentScore: number;
    goals: Goal[];
  };
};

export type Player = {
  id: string;
  name: string;
  pos: string;
  secondPos: string;
  squadNumber: number | null;
  heightCm: number | null;
  weightKg: number | null;
  dateOfBirth: string | null;
  nationality: string | null;
  languagesSpoken: string[];
  foot: "Left" | "Right" | "Both" | null;
  imageUrl: string;
  joinedDate: string | null;
  previousClub: string | null;
  bio: string | null;
  favouriteSong: string | null;
  instagramUrl: string | null;
  facebookUrl: string | null;
  isActive: boolean;
  userId: string | null;
};

export type StaffMember = {
  id: string;
  name: string;
  role: string;
  department: string | null;
  bio: string | null;
  imageUrl: string;
  email: string | null;
  phone: string | null;
  nationality: string | null;
  languagesSpoken: string[];
  joinedDate: string | null;
  isActive: boolean;
  userId: string | null;
};

export type Owner = {
  id: string;
  name: string;
  title: string;
  bio: string | null;
  imageUrl: string;
  email: string | null;
  phone: string | null;
  ownershipStake: string | null;
  joinedDate: string | null;
  websiteUrl: string | null;
  linkedinUrl: string | null;
  instagramUrl: string | null;
  isActive: boolean;
  userId: string | null;
};

export const INITIAL_FIXTURES: Fixture[] = [
  {
    id: "1",
    opponent: "Accra Lions B",
    date: "2024-10-14",
    time: "15:00",
    venue: "Tema Sports Stadium",
    status: "completed",
    result: {
      marinersScore: 3,
      opponentScore: 1,
      goals: [
        { id: "g1", player: "Kofi Mensah", minute: 12, team: "Mariners" },
        { id: "g2", player: "Opponent", minute: 44, team: "Opponent" },
        { id: "g3", player: "Kwame Boateng", minute: 67, team: "Mariners" },
        { id: "g4", player: "Kwame Boateng", minute: 82, team: "Mariners" },
      ],
    },
  },
  {
    id: "2",
    opponent: "Ashaiman City",
    date: "2024-10-21",
    time: "18:00",
    venue: "Ashaiman Community Park",
    status: "upcoming",
  },
];

export const INITIAL_PLAYERS: Player[] = [
  {
    id: "p1",
    name: "Kofi Mensah",
    pos: "Center Back",
    secondPos: "Right Back",
    squadNumber: 4,
    heightCm: 188,
    weightKg: 82,
    dateOfBirth: "1996-03-15",
    nationality: "Ghanaian",
    languagesSpoken: ["English", "Twi"],
    foot: "Right",
    imageUrl: "https://picsum.photos/seed/player1/400/500",
    joinedDate: "2023-08-01",
    previousClub: "Hearts of Oak",
    bio: "A commanding centre-back known for aerial dominance and leadership at the back.",
    favouriteSong: null,
    instagramUrl: null,
    facebookUrl: null,
    isActive: true,
    userId: null,
  },
  {
    id: "p2",
    name: "Kwame Boateng",
    pos: "Striker",
    secondPos: "Left Winger",
    squadNumber: 9,
    heightCm: 182,
    weightKg: 76,
    dateOfBirth: "1998-07-22",
    nationality: "Ghanaian",
    languagesSpoken: ["English", "Ga"],
    foot: "Left",
    imageUrl: "https://picsum.photos/seed/player2/400/500",
    joinedDate: "2024-01-15",
    previousClub: "Great Olympics",
    bio: "A prolific striker with electrifying pace and a deadly left foot.",
    favouriteSong: null,
    instagramUrl: null,
    facebookUrl: null,
    isActive: true,
    userId: null,
  },
];

export const INITIAL_STAFF: StaffMember[] = [
  {
    id: "s1",
    name: "Isaac Osei",
    role: "Head Coach",
    department: "Coaching",
    bio: "A disciplined tactician focused on compact defending and fast attacking transitions.",
    imageUrl: "https://picsum.photos/seed/staff1/400/500",
    email: null,
    phone: null,
    nationality: "Ghanaian",
    languagesSpoken: ["English", "Twi"],
    joinedDate: "2023-06-01",
    isActive: true,
    userId: null,
  },
  {
    id: "s2",
    name: "Ama Quartey",
    role: "Sporting Director",
    department: "Administrative",
    bio: "Leading the club's long-term football strategy, recruitment, and academy pathway.",
    imageUrl: "https://picsum.photos/seed/staff2/400/500",
    email: null,
    phone: null,
    nationality: "Ghanaian",
    languagesSpoken: ["English", "Ga"],
    joinedDate: "2022-09-01",
    isActive: true,
    userId: null,
  },
];

export const INITIAL_OWNERS: Owner[] = [
  {
    id: "o1",
    name: "Nana Akufo Mensah",
    title: "Chairman",
    bio: "Visionary leader driving the growth of football in Tema through strategic investment and community engagement.",
    imageUrl: "https://picsum.photos/seed/owner1/400/500",
    email: null,
    phone: null,
    ownershipStake: "Majority",
    joinedDate: "2020-01-01",
    websiteUrl: null,
    linkedinUrl: null,
    instagramUrl: null,
    isActive: true,
    userId: null,
  },
];

type FixtureRow = Database["public"]["Tables"]["fixtures"]["Row"];
type GoalRow = Database["public"]["Tables"]["goals"]["Row"];
type PlayerRow = Database["public"]["Tables"]["players"]["Row"];
type StaffRow = Database["public"]["Tables"]["staff"]["Row"];
type OwnerRow = Database["public"]["Tables"]["owners"]["Row"];

export function mapFixtureRecord(
  fixture: FixtureRow,
  goals: GoalRow[] = []
): Fixture {
  const mappedGoals = goals.map((goal) => ({
    id: goal.id,
    player: goal.player_name,
    minute: goal.minute,
    team: goal.team,
  }));

  return {
    id: fixture.id,
    opponent: fixture.opponent,
    date: fixture.fixture_date,
    time: fixture.fixture_time,
    venue: fixture.venue,
    status: fixture.status,
    result:
      fixture.status === "completed"
        ? {
            marinersScore: fixture.mariners_score ?? 0,
            opponentScore: fixture.opponent_score ?? 0,
            goals: mappedGoals,
          }
        : undefined,
  };
}

export function mapPlayerRecord(player: PlayerRow): Player {
  return {
    id: player.id,
    name: player.name,
    pos: player.pos,
    secondPos: player.second_pos ?? "",
    squadNumber: player.squad_number,
    heightCm: player.height_cm,
    weightKg: player.weight_kg,
    dateOfBirth: player.date_of_birth,
    nationality: player.nationality,
    languagesSpoken: player.languages_spoken ?? [],
    foot: player.foot,
    imageUrl: player.image_url ?? "",
    joinedDate: player.joined_date,
    previousClub: player.previous_club,
    bio: player.bio,
    favouriteSong: player.favourite_song,
    instagramUrl: player.instagram_url,
    facebookUrl: player.facebook_url,
    isActive: player.is_active,
    userId: player.user_id,
  };
}

export function mapStaffRecord(staff: StaffRow): StaffMember {
  return {
    id: staff.id,
    name: staff.name,
    role: staff.role,
    department: staff.department,
    bio: staff.bio,
    imageUrl: staff.image_url ?? "",
    email: staff.email,
    phone: staff.phone,
    nationality: staff.nationality,
    languagesSpoken: staff.languages_spoken ?? [],
    joinedDate: staff.joined_date,
    isActive: staff.is_active,
    userId: staff.user_id,
  };
}

export function mapOwnerRecord(owner: OwnerRow): Owner {
  return {
    id: owner.id,
    name: owner.name,
    title: owner.title,
    bio: owner.bio,
    imageUrl: owner.image_url ?? "",
    email: owner.email,
    phone: owner.phone,
    ownershipStake: owner.ownership_stake,
    joinedDate: owner.joined_date,
    websiteUrl: owner.website_url,
    linkedinUrl: owner.linkedin_url,
    instagramUrl: owner.instagram_url,
    isActive: owner.is_active,
    userId: owner.user_id,
  };
}
