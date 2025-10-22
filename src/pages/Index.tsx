import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/Header";
import { MarketCard } from "@/components/MarketCard";
import { BetModal } from "@/components/BetModal";
import { ActiveBets } from "@/components/ActiveBets";
import { SummaryStats } from "@/components/SummaryStats";
import { Leaderboard } from "@/components/Leaderboard";
import { AIPerformance } from "@/components/AIPerformance";
import { ResolvedMarkets } from "@/components/ResolvedMarkets";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp } from "lucide-react";
import { 
  Market, 
  ResolvedMarket, 
  generateInitialMarkets, 
  generateMarket, 
  resolveMarket 
} from "@/lib/marketGenerator";

interface Bet {
  marketId: string;
  marketTitle: string;
  amount: number;
  betWith: boolean;
  timestamp: Date;
  aiConfidence: number;
}

const Index = () => {
  const [activeView, setActiveView] = useState<"markets" | "results">("markets");
  const [markets, setMarkets] = useState<Market[]>(() => generateInitialMarkets(5));
  const [resolvedMarkets, setResolvedMarkets] = useState<ResolvedMarket[]>([]);
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [betWith, setBetWith] = useState(true);
  const [activeBets, setActiveBets] = useState<Bet[]>([]);

  // Auto-generate new markets every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const newMarket = generateMarket();
      setMarkets((prev) => [...prev, newMarket]);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Check for expired markets and resolve them
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setMarkets((prev) => {
        const active: Market[] = [];
        const expired: Market[] = [];

        prev.forEach((market) => {
          if (market.endsAt <= now) expired.push(market);
          else active.push(market);
        });

        if (expired.length > 0) {
          const newResolved = expired.map((market) => resolveMarket(market));
          setResolvedMarkets((prevResolved) => [...newResolved, ...prevResolved]);
        }

        return active;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleBet = (marketId: string, betWithAI: boolean) => {
    const market = markets.find((m) => m.id === marketId);
    if (market) {
      setSelectedMarket(market);
      setBetWith(betWithAI);
    }
  };

  const handleBetPlaced = (bet: { marketId: string; amount: number; betWith: boolean; timestamp: Date }) => {
    const market = markets.find((m) => m.id === bet.marketId);
    if (market) {
      setActiveBets((prev) => [
        {
          ...bet,
          marketTitle: market.title,
          aiConfidence: market.aiConfidence,
        },
        ...prev,
      ]);
    }
  };

  const totalVolume = resolvedMarkets.reduce((sum, m) => sum + m.totalVolume, 0);
  const aiWins = resolvedMarkets.filter((m) => m.aiWon).length;
  const aiWinRate = resolvedMarkets.length > 0 ? (aiWins / resolvedMarkets.length) * 100 : 73;
  const avgConfidence = markets.length > 0 
    ? markets.reduce((sum, m) => sum + m.aiConfidence, 0) / markets.length 
    : 65;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 space-y-8">
        <SummaryStats 
          aiWinRate={aiWinRate} 
          activeMarkets={markets.length} 
          totalVolume={totalVolume}
        />

        <div className="flex gap-3">
          <Button
            variant={activeView === "markets" ? "default" : "outline"}
            onClick={() => setActiveView("markets")}
            className="gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            Live Markets
          </Button>
          <Button
            variant={activeView === "results" ? "default" : "outline"}
            onClick={() => setActiveView("results")}
            className="gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            Results & Leaderboard
          </Button>
        </div>

        <AnimatePresence mode="wait">
          {activeView === "markets" ? (
            <motion.div
              key="markets"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <ActiveBets bets={activeBets} />

              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold text-foreground">Live Markets</h2>
                  <p className="text-muted-foreground">
                    AI-powered prediction markets on Base. Bet with or against the AI.
                  </p>
                </div>

                {markets.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>Waiting for new markets to generate...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {markets.map((market, index) => (
                      <motion.div
                        key={market.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <MarketCard
                          id={market.id}
                          title={market.title}
                          aiConfidence={market.aiConfidence}
                          endsAt={market.endsAt}
                          onBet={handleBet}
                        />
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <AIPerformance 
                winRate={aiWinRate}
                totalPredictions={resolvedMarkets.length}
                avgConfidence={avgConfidence}
              />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ResolvedMarkets markets={resolvedMarkets} />
                <Leaderboard />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {selectedMarket && (
        <BetModal
          isOpen={!!selectedMarket}
          onClose={() => setSelectedMarket(null)}
          marketId={selectedMarket.id}
          marketTitle={selectedMarket.title}
          betWith={betWith}
          aiConfidence={selectedMarket.aiConfidence}
          onBetPlaced={handleBetPlaced}
        />
      )}
    </div>
  );
};

export default Index;
