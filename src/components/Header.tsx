import WalletConnect from "@/components/WalletConnect";

export const Header = () => {
  return (
    <header className="border-b border-border/30 glass-card sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center animate-pulse-glow">
            <span className="text-xl font-bold text-primary-foreground">LL</span>
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">LoopLens</h1>
            <p className="text-xs text-muted-foreground">AI-Powered Predictions</p>
          </div>
        </div>

        <WalletConnect />
      </div>
    </header>
  );
};