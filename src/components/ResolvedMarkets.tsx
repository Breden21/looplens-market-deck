import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, TrendingUp, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import { ResolvedMarket } from "@/lib/marketGenerator";

interface ResolvedMarketsProps {
  markets: ResolvedMarket[];
}

export const ResolvedMarkets = ({ markets }: ResolvedMarketsProps) => {
  if (markets.length === 0) {
    return (
      <Card className="p-12 text-center">
        <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No resolved markets yet</p>
        <p className="text-sm text-muted-foreground mt-2">
          Markets will appear here once they're settled
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-foreground">Resolved Markets</h3>
        <Badge variant="secondary">{markets.length} settled</Badge>
      </div>

      <div className="space-y-3">
        {markets.map((market, index) => (
          <motion.div
            key={market.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      {market.aiWon ? (
                        <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                      )}
                      <Badge variant={market.aiWon ? "default" : "destructive"} className="text-xs">
                        {market.aiWon ? "AI Won" : "AI Lost"}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-card-foreground line-clamp-2">
                      {market.title}
                    </p>
                  </div>

                  <div className="text-right space-y-1 flex-shrink-0">
                    <div className="text-sm font-semibold text-primary">
                      {market.aiConfidence}% confidence
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      {market.totalVolume.toLocaleString()} USDC
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
                  <span>Settled {market.resolvedAt.toLocaleTimeString()}</span>
                  <span className={market.aiWon ? "text-success" : "text-destructive"}>
                    Payout: {market.aiWon ? (100 / market.aiConfidence).toFixed(2) : (100 / (100 - market.aiConfidence)).toFixed(2)}x
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
