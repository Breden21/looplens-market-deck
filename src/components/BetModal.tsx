import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrendingUp, TrendingDown, Loader2, Zap } from "lucide-react";
import { useBetting } from "@/hooks/useBetting";
import { useAccount } from "wagmi";

interface BetModalProps {
  isOpen: boolean;
  onClose: () => void;
  marketId: string;
  marketTitle: string;
  betWith: boolean;
  aiConfidence: number;
  onBetPlaced: (bet: { marketId: string; amount: number; betWith: boolean; timestamp: Date }) => void;
}

export function BetModal({
  isOpen,
  onClose,
  marketId,
  marketTitle,
  betWith,
  aiConfidence,
  onBetPlaced,
}: BetModalProps) {
  const [amount, setAmount] = useState("");
  const [step, setStep] = useState<"input" | "approve" | "bet" | "success">("input");
  const { approveUSDC, placeBet, isPending, isSmartWallet } = useBetting();
  const { address } = useAccount();

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    if (!address) {
      alert("Please connect your wallet");
      return;
    }

    try {
      // Step 1: Approve USDC
      setStep("approve");
      await approveUSDC(amount);

      // Step 2: Place bet
      setStep("bet");
      await placeBet(parseInt(marketId), betWith, amount);

      // Success
      setStep("success");
      onBetPlaced({
        marketId,
        amount: parseFloat(amount),
        betWith,
        timestamp: new Date(),
      });

      setTimeout(() => {
        onClose();
        setStep("input");
        setAmount("");
      }, 2000);
    } catch (error: any) {
      console.error("Error placing bet:", error);
      alert(error.message || "Failed to place bet. Please try again.");
      setStep("input");
    }
  };

  const getStepMessage = () => {
    switch (step) {
      case "approve":
        return "Approving USDC... Check your wallet";
      case "bet":
        return "Placing bet... Confirm in wallet";
      case "success":
        return "Bet placed successfully!";
      default:
        return "";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Place Your Bet</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Market Info */}
          <div className="p-4 rounded-lg bg-muted/50 border">
            <p className="text-sm font-medium mb-2">{marketTitle}</p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">AI Confidence</span>
              <span className="font-semibold">{aiConfidence}%</span>
            </div>
          </div>

          {/* Gasless Transaction Badge */}
          {isSmartWallet && (
            <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <Zap className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-green-500">
                ⚡ Gasless Transaction - No ETH needed!
              </span>
            </div>
          )}

          {/* Betting Option */}
          <div className="flex items-center justify-center gap-2 p-4 rounded-lg border-2 border-primary/20 bg-primary/5">
            {betWith ? (
              <>
                <TrendingUp className="w-5 h-5 text-green-500" />
                <span className="font-semibold text-green-500">Betting WITH AI</span>
              </>
            ) : (
              <>
                <TrendingDown className="w-5 h-5 text-red-500" />
                <span className="font-semibold text-red-500">Betting AGAINST AI</span>
              </>
            )}
          </div>

          {/* Amount Input */}
          {step === "input" && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Amount (USDC)</label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-lg"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount("10")}
                  className="flex-1"
                >
                  10 USDC
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount("50")}
                  className="flex-1"
                >
                  50 USDC
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount("100")}
                  className="flex-1"
                >
                  100 USDC
                </Button>
              </div>
            </>
          )}

          {/* Loading State */}
          {(step === "approve" || step === "bet") && (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
              <p className="text-center text-sm text-muted-foreground">
                {getStepMessage()}
              </p>
            </div>
          )}

          {/* Success State */}
          {step === "success" && (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
              <p className="text-center font-semibold text-green-500">
                {getStepMessage()}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          {step === "input" && (
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isPending || !amount || parseFloat(amount) <= 0}
                className="flex-1"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Place Bet"
                )}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}