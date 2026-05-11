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
  height: string;
  imageUrl: string;
};

export type StaffMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
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
    height: "188cm",
    imageUrl: "https://picsum.photos/seed/player1/400/500",
  },
  {
    id: "p2",
    name: "Kwame Boateng",
    pos: "Striker",
    secondPos: "Left Winger",
    height: "182cm",
    imageUrl: "https://picsum.photos/seed/player2/400/500",
  },
];

export const INITIAL_STAFF: StaffMember[] = [
  {
    id: "s1",
    name: "Isaac Osei",
    role: "Head Coach",
    bio: "A disciplined tactician focused on compact defending and fast attacking transitions.",
    imageUrl: "https://picsum.photos/seed/staff1/400/500",
  },
  {
    id: "s2",
    name: "Ama Quartey",
    role: "Sporting Director",
    bio: "Leading the club's long-term football strategy, recruitment, and academy pathway.",
    imageUrl: "https://picsum.photos/seed/staff2/400/500",
  },
];

type FixtureRow = Database["public"]["Tables"]["fixtures"]["Row"];
type GoalRow = Database["public"]["Tables"]["goals"]["Row"];
type PlayerRow = Database["public"]["Tables"]["players"]["Row"];
type StaffRow = Database["public"]["Tables"]["staff"]["Row"];

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
    height: player.height ?? "",
    imageUrl: player.image_url ?? "",
  };
}

export function mapStaffRecord(staff: StaffRow): StaffMember {
  return {
    id: staff.id,
    name: staff.name,
    role: staff.role,
    bio: staff.bio ?? "",
    imageUrl: staff.image_url ?? "",
  };
}
