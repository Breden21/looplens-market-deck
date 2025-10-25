import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Clock } from "lucide-react";
import { motion } from "framer-motion";

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

  // Calculate circle progress
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const progress = (aiConfidence / 100) * circumference;

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Card className="group relative p-6 space-y-4 card-glow card-glow-hover transition-all duration-300 overflow-hidden">
        {/* Shimmer effect */}
        <div className="shimmer absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
        
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-foreground line-clamp-2">
            {title}
          </h3>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className="font-medium">{timeLeft}</span>
          </div>
        </div>

        {/* Animated Circular Progress Bar */}
        <div className="flex items-center justify-center py-6">
          <div className="relative w-32 h-32">
            <svg className="transform -rotate-90 w-32 h-32">
              {/* Background circle */}
              <circle
                cx="64"
                cy="64"
                r={radius}
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-muted/20"
              />
              {/* Progress circle with gradient */}
              <defs>
                <linearGradient id={`gradient-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(270 100% 65%)" />
                  <stop offset="100%" stopColor="hsl(180 100% 60%)" />
                </linearGradient>
              </defs>
              <motion.circle
                cx="64"
                cy="64"
                r={radius}
                stroke={`url(#gradient-${id})`}
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                initial={{ strokeDasharray: `0 ${circumference}` }}
                animate={{ strokeDasharray: `${progress} ${circumference}` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold gradient-text">{aiConfidence}%</span>
              <span className="text-xs text-muted-foreground">AI Confidence</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm py-3">
          <div className="space-y-1 text-center">
            <p className="text-muted-foreground">Payout (Yes)</p>
            <p className="font-semibold text-success text-lg">{payoutOddsFor}x</p>
          </div>
          <div className="space-y-1 text-center">
            <p className="text-muted-foreground">Payout (No)</p>
            <p className="font-semibold text-destructive text-lg">{payoutOddsAgainst}x</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button
            onClick={() => onBet(id, true)}
            className="w-full gap-2 bg-success hover:bg-success/90 text-white button-glow-green transition-all duration-300"
          >
            <TrendingUp className="w-4 h-4" />
            Bet With AI
          </Button>
          <Button
            onClick={() => onBet(id, false)}
            className="w-full gap-2 bg-destructive hover:bg-destructive/90 text-white button-glow-red transition-all duration-300"
          >
            <TrendingDown className="w-4 h-4" />
            Bet Against
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};
