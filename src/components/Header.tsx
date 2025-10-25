import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import WalletConnect from "@/components/WalletConnect";
import { Badge } from "@/components/ui/badge";
import { Zap } from "lucide-react";
import { useAccount } from "wagmi";

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  const { address, isConnected } = useAccount();
  
  // Transform values for shrink animation
  const headerHeight = useTransform(scrollY, [0, 100], [64, 56]);
  const logoScale = useTransform(scrollY, [0, 100], [1, 0.9]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check if smart wallet (simplified check - could be enhanced)
  const isSmartWallet = isConnected && address;

  return (
    <motion.header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'mt-4' : 'mt-0'
      }`}
      style={{ height: headerHeight }}
    >
      <div className={`container mx-auto px-4 h-full transition-all duration-300 ${
        isScrolled ? 'max-w-7xl' : ''
      }`}>
        <motion.div 
          className={`glass-card border-primary/20 h-full rounded-2xl flex items-center justify-between px-6 transition-all duration-300 ${
            isScrolled ? 'shadow-[0_0_40px_rgba(168,85,247,0.2)]' : ''
          }`}
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
          <motion.div 
            className="flex items-center gap-4"
            style={{ scale: logoScale }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center animate-pulse-glow">
              <span className="text-xl font-bold text-primary-foreground">LL</span>
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">LoopLens</h1>
              <p className="text-xs text-muted-foreground">AI-Powered Predictions</p>
            </div>
            
            {isSmartWallet && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
              >
                <Badge 
                  variant="secondary" 
                  className="ml-2 animate-pulse bg-success/20 text-success border-success/30 gap-1"
                >
                  <Zap className="w-3 h-3" />
                  Gasless
                </Badge>
              </motion.div>
            )}
          </motion.div>

          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          >
            <WalletConnect />
          </motion.div>
        </motion.div>
      </div>
    </motion.header>
  );
};