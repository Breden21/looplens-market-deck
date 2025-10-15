export interface LeaderboardEntry {
  rank: number;
  username: string;
  accuracy: number;
  totalWinnings: number;
  betsPlaced: number;
}

export const mockLeaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    username: "CryptoWhale",
    accuracy: 84.5,
    totalWinnings: 12450,
    betsPlaced: 127,
  },
  {
    rank: 2,
    username: "DegenTrader",
    accuracy: 78.2,
    totalWinnings: 9320,
    betsPlaced: 156,
  },
  {
    rank: 3,
    username: "BasedBetter",
    accuracy: 76.8,
    totalWinnings: 7890,
    betsPlaced: 98,
  },
  {
    rank: 4,
    username: "0xPredictor",
    accuracy: 74.1,
    totalWinnings: 6543,
    betsPlaced: 143,
  },
  {
    rank: 5,
    username: "AIFollower",
    accuracy: 71.9,
    totalWinnings: 5234,
    betsPlaced: 89,
  },
];
