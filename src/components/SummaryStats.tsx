import { Card } from "@/components/ui/card";
import { TrendingUp, Activity, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

interface SummaryStatsProps {
  aiWinRate: number;
  activeMarkets: number;
  totalVolume: number;
}

export const SummaryStats = ({ aiWinRate, activeMarkets, totalVolume }: SummaryStatsProps) => {
  const stats = [
    {
      label: "AI Win Rate",
      value: `${aiWinRate.toFixed(1)}%`,
      icon: TrendingUp,
      gradient: "from-primary to-success",
    },
    {
      label: "Active Markets",
      value: activeMarkets.toString(),
      icon: Activity,
      gradient: "from-primary to-accent",
    },
    {
      label: "Total Volume",
      value: `${totalVolume.toLocaleString()} USDC`,
      icon: DollarSign,
      gradient: "from-success to-primary",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="p-6 relative overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5`} />
            <div className="relative space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
              <p className="text-3xl font-bold text-card-foreground">{stat.value}</p>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};
