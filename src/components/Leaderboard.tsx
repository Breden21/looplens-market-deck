import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal } from "lucide-react";
import { motion } from "framer-motion";
import { mockLeaderboard } from "@/lib/leaderboardData";

export const Leaderboard = () => {
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
    return null;
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-card-foreground">Top Traders</h3>
          <Badge variant="secondary" className="gap-1">
            <Trophy className="w-3 h-3" />
            Leaderboard
          </Badge>
        </div>

        <div className="space-y-3">
          {mockLeaderboard.map((entry, index) => (
            <motion.div
              key={entry.username}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-8 flex items-center justify-center">
                    {getRankIcon(entry.rank) || (
                      <span className="text-sm font-semibold text-muted-foreground">
                        #{entry.rank}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-card-foreground">{entry.username}</p>
                    <p className="text-sm text-muted-foreground">{entry.betsPlaced} bets</p>
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <p className="text-sm font-semibold text-success">
                    {entry.accuracy}% accuracy
                  </p>
                  <p className="text-xs text-muted-foreground">
                    +{entry.totalWinnings.toLocaleString()} USDC
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Card>
  );
};
