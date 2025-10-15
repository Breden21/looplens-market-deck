export interface Market {
  id: string;
  title: string;
  aiConfidence: number;
  endsAt: Date;
  createdAt: Date;
}

export interface ResolvedMarket extends Market {
  resolvedAt: Date;
  aiWon: boolean;
  totalVolume: number;
}

const marketTemplates = [
  "Will ETH price go up in the next {time}?",
  "Will BTC drop {percent}% or more {period}?",
  "Will Base network TVL exceed ${amount}B this {period}?",
  "Will SOL reach ${price} in the next {time}?",
  "Will gas fees on Ethereum drop below {gwei} gwei {period}?",
  "Will USDC maintain its peg within {percent}% {period}?",
  "Will total DeFi TVL increase by {percent}% this {period}?",
  "Will Uniswap daily volume exceed ${amount}M {period}?",
  "Will the number of Base transactions exceed {number}K {period}?",
  "Will NFT floor prices rise by {percent}% this {period}?",
];

const timeOptions = ["hour", "2 hours", "3 hours"];
const percentOptions = ["1", "2", "3", "5"];
const periodOptions = ["today", "this week", "in 24h"];
const amountOptions = ["1", "2", "3", "5"];
const priceOptions = ["150", "175", "200", "250"];
const gweiOptions = ["5", "10", "15", "20"];
const numberOptions = ["50", "100", "150", "200"];

function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateMarketTitle(): string {
  const template = randomChoice(marketTemplates);
  return template
    .replace("{time}", randomChoice(timeOptions))
    .replace("{percent}", randomChoice(percentOptions))
    .replace("{period}", randomChoice(periodOptions))
    .replace("{amount}", randomChoice(amountOptions))
    .replace("{price}", randomChoice(priceOptions))
    .replace("{gwei}", randomChoice(gweiOptions))
    .replace("{number}", randomChoice(numberOptions));
}

export function generateMarket(): Market {
  const durationMinutes = Math.floor(Math.random() * 8) + 2; // 2-10 minutes
  const now = new Date();
  const endsAt = new Date(now.getTime() + durationMinutes * 60 * 1000);

  return {
    id: `market_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    title: generateMarketTitle(),
    aiConfidence: Math.floor(Math.random() * 56) + 40, // 40-95%
    endsAt,
    createdAt: now,
  };
}

export function resolveMarket(market: Market): ResolvedMarket {
  // AI wins 73% of the time based on its confidence
  const aiWinProbability = market.aiConfidence / 100;
  const aiWon = Math.random() < aiWinProbability;
  
  // Generate random volume between 100-5000 USDC
  const totalVolume = Math.floor(Math.random() * 4900) + 100;

  return {
    ...market,
    resolvedAt: new Date(),
    aiWon,
    totalVolume,
  };
}

export function generateInitialMarkets(count: number = 5): Market[] {
  const markets: Market[] = [];
  for (let i = 0; i < count; i++) {
    markets.push(generateMarket());
  }
  return markets;
}
