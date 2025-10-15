import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Clock } from "lucide-react";

interface Bet {
  marketId: string;
  marketTitle: string;
  amount: number;
  betWith: boolean;
  timestamp: Date;
  aiConfidence: number;
}

interface ActiveBetsProps {
  bets: Bet[];
}

export const ActiveBets = ({ bets }: ActiveBetsProps) => {
  if (bets.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-foreground">Your Active Bets</h3>
        <Badge variant="secondary" className="text-sm">
          {bets.length} {bets.length === 1 ? "bet" : "bets"}
        </Badge>
      </div>

      <div className="grid gap-3">
        {bets.map((bet, index) => {
          const payoutMultiplier = bet.betWith
            ? (100 / bet.aiConfidence).toFixed(2)
            : (100 / (100 - bet.aiConfidence)).toFixed(2);
          const potentialWin = (bet.amount * parseFloat(payoutMultiplier)).toFixed(2);

          return (
            <Card key={index} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    {bet.betWith ? (
                      <TrendingUp className="w-4 h-4 text-success" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-destructive" />
                    )}
                    <span className="text-sm font-medium text-muted-foreground">
                      {bet.betWith ? "Betting WITH AI" : "Betting AGAINST AI"}
                    </span>
                  </div>
                  
                  <p className="text-sm text-card-foreground line-clamp-2">
                    {bet.marketTitle}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {bet.timestamp.toLocaleTimeString()}
                    </div>
                    <div>AI: {bet.aiConfidence}%</div>
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <div className="text-sm font-semibold text-card-foreground">
                    {bet.amount.toFixed(2)} USDC
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Win: <span className="text-success font-medium">{potentialWin}</span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
