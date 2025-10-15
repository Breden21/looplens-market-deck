import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, Target } from "lucide-react";
import { motion } from "framer-motion";

interface AIPerformanceProps {
  winRate: number;
  totalPredictions: number;
  avgConfidence: number;
}

export const AIPerformance = ({ winRate, totalPredictions, avgConfidence }: AIPerformanceProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-success opacity-5" />
        
        <div className="relative space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-card-foreground">AI Performance</h3>
                <p className="text-sm text-muted-foreground">Recent market accuracy</p>
              </div>
            </div>
            <Badge variant="default" className="gap-1">
              <Target className="w-3 h-3" />
              Live
            </Badge>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2 text-center p-4 rounded-lg bg-muted/50">
              <div className="flex items-center justify-center gap-1 text-success">
                <TrendingUp className="w-4 h-4" />
                <p className="text-2xl font-bold">{winRate.toFixed(1)}%</p>
              </div>
              <p className="text-xs text-muted-foreground">Win Rate</p>
            </div>

            <div className="space-y-2 text-center p-4 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold text-primary">{totalPredictions}</p>
              <p className="text-xs text-muted-foreground">Predictions</p>
            </div>

            <div className="space-y-2 text-center p-4 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold text-accent-foreground">{avgConfidence.toFixed(0)}%</p>
              <p className="text-xs text-muted-foreground">Avg Confidence</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Accuracy Trend</span>
              <span className="text-success font-medium">↑ 2.3% this week</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-success"
                initial={{ width: 0 }}
                animate={{ width: `${winRate}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
