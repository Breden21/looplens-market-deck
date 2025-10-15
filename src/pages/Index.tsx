import { useState } from "react";
import { Header } from "@/components/Header";
import { MarketCard } from "@/components/MarketCard";
import { BetModal } from "@/components/BetModal";

interface Market {
  id: string;
  title: string;
  aiConfidence: number;
  endsAt: Date;
}

const mockMarkets: Market[] = [
  {
    id: "1",
    title: "Will ETH price go up in the next hour?",
    aiConfidence: 68,
    endsAt: new Date(Date.now() + 3600000),
  },
  {
    id: "2",
    title: "Will BTC drop 2% or more today?",
    aiConfidence: 42,
    endsAt: new Date(Date.now() + 14400000),
  },
  {
    id: "3",
    title: "Will Base network TVL exceed $2B this week?",
    aiConfidence: 73,
    endsAt: new Date(Date.now() + 86400000 * 3),
  },
  {
    id: "4",
    title: "Will SOL reach $200 in the next 24 hours?",
    aiConfidence: 55,
    endsAt: new Date(Date.now() + 86400000),
  },
  {
    id: "5",
    title: "Will gas fees on Ethereum drop below 10 gwei today?",
    aiConfidence: 38,
    endsAt: new Date(Date.now() + 28800000),
  },
];

const Index = () => {
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [betWith, setBetWith] = useState(true);

  const handleBet = (marketId: string, betWithAI: boolean) => {
    const market = mockMarkets.find((m) => m.id === marketId);
    if (market) {
      setSelectedMarket(market);
      setBetWith(betWithAI);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-foreground">Live Markets</h2>
            <p className="text-muted-foreground">
              AI-powered prediction markets on Base. Bet with or against the AI.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockMarkets.map((market) => (
              <MarketCard
                key={market.id}
                id={market.id}
                title={market.title}
                aiConfidence={market.aiConfidence}
                endsAt={market.endsAt}
                onBet={handleBet}
              />
            ))}
          </div>
        </div>
      </main>

      {selectedMarket && (
        <BetModal
          isOpen={!!selectedMarket}
          onClose={() => setSelectedMarket(null)}
          marketTitle={selectedMarket.title}
          betWith={betWith}
          aiConfidence={selectedMarket.aiConfidence}
        />
      )}
    </div>
  );
};

export default Index;
