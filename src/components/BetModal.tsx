import { useState } from "react";
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
import { TrendingUp, TrendingDown } from "lucide-react";

interface BetModalProps {
  isOpen: boolean;
  onClose: () => void;
  marketTitle: string;
  betWith: boolean;
  aiConfidence: number;
}

export const BetModal = ({ isOpen, onClose, marketTitle, betWith, aiConfidence }: BetModalProps) => {
  const [amount, setAmount] = useState("");

  const payoutMultiplier = betWith
    ? (100 / aiConfidence).toFixed(2)
    : (100 / (100 - aiConfidence)).toFixed(2);

  const potentialPayout = amount ? (parseFloat(amount) * parseFloat(payoutMultiplier)).toFixed(2) : "0.00";

  const handlePlaceBet = () => {
    // Mock bet placement - in real app would call smart contract
    console.log("Placing bet:", { marketTitle, betWith, amount });
    onClose();
    setAmount("");
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
            <Label htmlFor="amount">Bet Amount (ETH)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-lg"
            />
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
              <span className="font-bold text-lg text-primary">{potentialPayout} ETH</span>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handlePlaceBet}
              disabled={!amount || parseFloat(amount) <= 0}
              className="flex-1"
            >
              Place Bet
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
