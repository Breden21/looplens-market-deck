import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Clock } from "lucide-react";

interface MarketCardProps {
  id: string;
  title: string;
  aiConfidence: number;
  endsAt: Date;
  onBet: (marketId: string, betWith: boolean) => void;
}

export const MarketCard = ({ id, title, aiConfidence, endsAt, onBet }: MarketCardProps) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const end = endsAt.getTime();
      const distance = end - now;

      if (distance < 0) {
        setTimeLeft("ENDED");
        return;
      }

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [endsAt]);

  const payoutOddsFor = (100 / aiConfidence).toFixed(2);
  const payoutOddsAgainst = (100 / (100 - aiConfidence)).toFixed(2);

  return (
    <Card className="p-6 space-y-4 hover:shadow-lg transition-all duration-300 border-border">
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-card-foreground line-clamp-2">
          {title}
        </h3>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span className="font-medium">{timeLeft}</span>
        </div>
      </div>

      <div className="space-y-3 py-4 border-y border-border">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">AI Confidence</span>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${aiConfidence >= 60 ? 'bg-success' : aiConfidence >= 40 ? 'bg-primary' : 'bg-destructive'}`} />
            <span className="text-lg font-bold text-primary">{aiConfidence}%</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="space-y-1">
            <p className="text-muted-foreground">Payout (Yes)</p>
            <p className="font-semibold text-success">{payoutOddsFor}x</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground">Payout (No)</p>
            <p className="font-semibold text-destructive">{payoutOddsAgainst}x</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2">
        <Button
          onClick={() => onBet(id, true)}
          variant="default"
          className="w-full gap-2"
        >
          <TrendingUp className="w-4 h-4" />
          Bet With AI
        </Button>
        <Button
          onClick={() => onBet(id, false)}
          variant="outline"
          className="w-full gap-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
        >
          <TrendingDown className="w-4 h-4" />
          Bet Against
        </Button>
      </div>
    </Card>
  );
};
