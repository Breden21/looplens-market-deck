import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

export const Header = () => {
  return (
    <header className="border-b border-border bg-card sticky top-0 z-50 backdrop-blur-sm bg-card/95">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
            <span className="text-xl font-bold text-primary-foreground">LL</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-card-foreground">LoopLens</h1>
            <p className="text-xs text-muted-foreground">AI-Powered Predictions</p>
          </div>
        </div>

        <Button variant="default" className="gap-2">
          <Wallet className="w-4 h-4" />
          Connect Wallet
        </Button>
      </div>
    </header>
  );
};
