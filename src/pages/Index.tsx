import { useState } from "react";
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
import { useBlockchainMarkets } from "@/hooks/useBlockchainMarkets";

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
  const { markets, refetch } = useBlockchainMarkets(); // Use real blockchain markets
  const [selectedMarket, setSelectedMarket] = useState<any | null>(null);
  const [betWith, setBetWith] = useState(true);
  const [activeBets, setActiveBets] = useState<Bet[]>([]);
  const [resolvedMarkets, setResolvedMarkets] = useState<any[]>([]);

  const handleBet = (marketId: string, betWithAI: boolean) => {
    const market = markets.find((m) => m.id.toString() === marketId);
    if (market) {
      setSelectedMarket(market);
      setBetWith(betWithAI);
    }
  };

  const handleBetPlaced = (bet: { marketId: string; amount: number; betWith: boolean; timestamp: Date }) => {
    const market = markets.find((m) => m.id.toString() === bet.marketId);
    if (market) {
      setActiveBets((prev) => [
        {
          ...bet,
          marketTitle: market.title,
          aiConfidence: market.aiConfidence,
        },
        ...prev,
      ]);
      // Refetch markets to update totals
      refetch();
    }
  };

  const totalVolume = resolvedMarkets.reduce((sum, m) => sum + (m.totalVolume || 0), 0);
  const aiWins = resolvedMarkets.filter((m) => m.aiWon).length;
  const aiWinRate = resolvedMarkets.length > 0 ? (aiWins / resolvedMarkets.length) * 100 : 73;
  const avgConfidence = markets.length > 0 
    ? markets.reduce((sum, m) => sum + m.aiConfidence, 0) / markets.length 
    : 65;

  return (
    <div className="min-h-screen bg-[#0A0A0F] bg-gradient-to-b from-[#0A0A0F] to-[#1A1A2E] relative overflow-hidden">
      {/* Floating abstract shapes */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-float" />
      <div className="absolute top-40 right-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center relative z-10">
        <motion.h1 
          className="text-6xl md:text-8xl font-black gradient-text mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          LoopLens
        </motion.h1>
        <motion.p 
          className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          AI-powered prediction markets on Base. Bet with or against the AI.
        </motion.p>
      </section>

      <main className="container mx-auto px-4 py-8 space-y-8 relative z-10">
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
                    AI-powered prediction markets on Base Sepolia. Bet with or against the AI.
                  </p>
                </div>

                {markets.length === 0 ? (
                  <div className="text-center py-12 space-y-4">
                    <p className="text-muted-foreground">
                      No active markets yet. Check back soon!
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Connected to Base Sepolia - Real blockchain markets will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {markets.map((market, index) => (
                      <motion.div
                        key={market.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ 
                          delay: index * 0.1,
                          duration: 0.4,
                          ease: "easeOut"
                        }}
                      >
                        <MarketCard
                          id={market.id.toString()}
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
          marketId={selectedMarket.id.toString()}
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