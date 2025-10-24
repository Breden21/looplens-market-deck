import { useState } from "react";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
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
import { TrendingUp, TrendingDown, Loader2, Zap, Sparkles } from "lucide-react";
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
  const [showSuccess, setShowSuccess] = useState(false);

  const quickSelectAmounts = [10, 50, 100, 500];

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
    setIsProcessing(false);

    // Show success animation
    setShowSuccess(true);

    toast({
      title: "Bet placed successfully! 🎉",
      description: `${amount} USDC bet ${betWith ? "with" : "against"} AI`,
      duration: 4000,
    });

    // Reset and close after celebration
    setTimeout(() => {
      setShowSuccess(false);
      setAmount("");
      setError("");
      onClose();
    }, 2000);
  };

  const handleQuickSelect = (value: number) => {
    validateAmount(value.toString());
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg glass-card border-primary/30 backdrop-blur-2xl overflow-hidden">
        <AnimatePresence mode="wait">
          {!showSuccess ? (
            <motion.div
              key="betting"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-2xl">
                  {betWith ? (
                    <div className="p-2 rounded-lg bg-success/20">
                      <TrendingUp className="w-6 h-6 text-success" />
                    </div>
                  ) : (
                    <div className="p-2 rounded-lg bg-destructive/20">
                      <TrendingDown className="w-6 h-6 text-destructive" />
                    </div>
                  )}
                  {betWith ? "Bet With AI" : "Bet Against AI"}
                </DialogTitle>
                <DialogDescription className="text-left pt-2 text-base">
                  {marketTitle}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-6">
                {/* Animated Confidence Meter */}
                <div className="relative">
                  <div className="glass-card p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-muted-foreground">AI Confidence</span>
                      <motion.div 
                        className="flex items-center gap-2"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Zap className="w-4 h-4 text-primary" />
                        <span className="text-2xl font-bold gradient-text">{aiConfidence}%</span>
                      </motion.div>
                    </div>
                    <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary to-secondary"
                        initial={{ width: 0 }}
                        animate={{ width: `${aiConfidence}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                      <div className="absolute inset-0 animate-pulse-ring rounded-full border-2 border-primary/50" />
                    </div>
                  </div>
                </div>

                {/* Large Bold Amount Input */}
                <div className="space-y-3">
                  <Label htmlFor="amount" className="text-base font-semibold">Bet Amount</Label>
                  <div className="relative">
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0"
                      max="10000"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => validateAmount(e.target.value)}
                      className={`text-4xl font-bold h-20 text-center input-glow transition-all duration-300 ${
                        error ? "border-destructive" : ""
                      }`}
                      disabled={isProcessing}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl font-semibold text-muted-foreground">
                      USDC
                    </span>
                  </div>
                  {error && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-destructive font-medium"
                    >
                      {error}
                    </motion.p>
                  )}
                </div>

                {/* Quick Select Buttons */}
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Quick Select</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {quickSelectAmounts.map((value) => (
                      <Button
                        key={value}
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickSelect(value)}
                        disabled={isProcessing}
                        className="quick-select-btn hover:border-primary hover:bg-primary/10 font-semibold"
                      >
                        {value}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Live Odds Display */}
                <motion.div 
                  className="glass-card rounded-xl p-4 space-y-3 border border-primary/30"
                  animate={{ 
                    borderColor: ["rgba(168,85,247,0.3)", "rgba(168,85,247,0.6)", "rgba(168,85,247,0.3)"] 
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-secondary" />
                      Live Odds
                    </span>
                    <span className="font-bold text-lg gradient-text">{payoutMultiplier}x</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-border/30">
                    <span className="font-semibold text-foreground">Potential Win</span>
                    <motion.span 
                      className="font-bold text-2xl gradient-text"
                      key={potentialPayout}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                    >
                      {potentialPayout} USDC
                    </motion.span>
                  </div>
                </motion.div>

                {/* Action Buttons */}
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
                    variant="glow"
                    className="flex-1 gap-2 text-lg h-12"
                  >
                    {isProcessing && <Loader2 className="w-5 h-5 animate-spin" />}
                    {isProcessing ? "Processing..." : "Place Bet"}
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="py-12 text-center space-y-6"
            >
              {/* Confetti Effect */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-3 h-3 rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: -20,
                      backgroundColor: i % 2 === 0 ? "hsl(270 100% 65%)" : "hsl(180 100% 60%)",
                    }}
                    animate={{
                      y: ["0vh", "100vh"],
                      rotate: [0, 720],
                      opacity: [1, 0],
                    }}
                    transition={{
                      duration: 2 + Math.random(),
                      delay: Math.random() * 0.5,
                      ease: "easeOut",
                    }}
                  />
                ))}
              </div>

              <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
                transition={{ duration: 0.6 }}
                className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center animate-pulse-glow"
              >
                <Sparkles className="w-12 h-12 text-white" />
              </motion.div>

              <div className="space-y-2">
                <h3 className="text-3xl font-bold gradient-text">Bet Placed!</h3>
                <p className="text-muted-foreground text-lg">
                  Your bet of {amount} USDC is now active
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};
