import { useState } from "react";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const betAmountSchema = z.object({
  amount: z
    .string()
    .trim()
    .refine((val) => val !== "", { message: "Bet amount is required" })
    .refine((val) => !isNaN(parseFloat(val)), { message: "Must be a valid number" })
    .refine((val) => parseFloat(val) > 0, { message: "Amount must be greater than 0" })
    .refine((val) => parseFloat(val) <= 10000, { message: "Amount must be less than 10,000 USDC" }),
});

interface BetModalProps {
  isOpen: boolean;
  onClose: () => void;
  marketId: string;
  marketTitle: string;
  betWith: boolean;
  aiConfidence: number;
  onBetPlaced: (bet: { marketId: string; amount: number; betWith: boolean; timestamp: Date }) => void;
}

export const BetModal = ({ 
  isOpen, 
  onClose, 
  marketId,
  marketTitle, 
  betWith, 
  aiConfidence,
  onBetPlaced 
}: BetModalProps) => {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const payoutMultiplier = betWith
    ? (100 / aiConfidence).toFixed(2)
    : (100 / (100 - aiConfidence)).toFixed(2);

  const potentialPayout = amount && !error 
    ? (parseFloat(amount) * parseFloat(payoutMultiplier)).toFixed(2) 
    : "0.00";

  const validateAmount = (value: string) => {
    setAmount(value);
    setError("");

    if (!value.trim()) {
      return;
    }

    const validation = betAmountSchema.safeParse({ amount: value });
    if (!validation.success) {
      setError(validation.error.errors[0].message);
    }
  };

  const handlePlaceBet = async () => {
    const validation = betAmountSchema.safeParse({ amount });
    
    if (!validation.success) {
      setError(validation.error.errors[0].message);
      return;
    }

    setIsProcessing(true);

    // Simulate blockchain transaction delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const bet = {
      marketId,
      amount: parseFloat(amount),
      betWith,
      timestamp: new Date(),
    };

    onBetPlaced(bet);

    toast({
      title: "Bet placed successfully! 🎉",
      description: `${amount} USDC bet ${betWith ? "with" : "against"} AI`,
      duration: 4000,
    });

    setIsProcessing(false);
    setAmount("");
    setError("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {betWith ? (
              <TrendingUp className="w-5 h-5 text-success" />
            ) : (
              <TrendingDown className="w-5 h-5 text-destructive" />
            )}
            {betWith ? "Bet With AI" : "Bet Against AI"}
          </DialogTitle>
          <DialogDescription className="text-left pt-2">
            {marketTitle}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Bet Amount (USDC)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              max="10000"
              placeholder="0.00"
              value={amount}
              onChange={(e) => validateAmount(e.target.value)}
              className={`text-lg ${error ? "border-destructive" : ""}`}
              disabled={isProcessing}
            />
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>

          <div className="bg-muted rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">AI Confidence</span>
              <span className="font-semibold text-primary">{aiConfidence}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Payout Multiplier</span>
              <span className="font-semibold">{payoutMultiplier}x</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-border">
              <span className="font-semibold">Potential Payout</span>
              <span className="font-bold text-lg text-primary">{potentialPayout} USDC</span>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button 
              variant="outline" 
              onClick={onClose} 
              className="flex-1"
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePlaceBet}
              disabled={!amount || !!error || isProcessing}
              className="flex-1 gap-2"
            >
              {isProcessing && <Loader2 className="w-4 h-4 animate-spin" />}
              {isProcessing ? "Processing..." : "Confirm Bet"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
