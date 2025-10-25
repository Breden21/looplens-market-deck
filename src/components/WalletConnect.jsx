import { useAccount, useConnect, useDisconnect, useSwitchChain, useBalance } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { Button } from '@/components/ui/button';
import { Wallet, AlertCircle, CheckCircle, LogOut } from 'lucide-react';
import { CONTRACTS } from '@/config/contracts';
import { motion } from 'framer-motion';

export default function WalletConnect() {
  const { address, isConnected, chain } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();

  // Get ETH balance
  const { data: ethBalance } = useBalance({
    address: address,
  });

  // Get USDC balance
  const { data: usdcBalance } = useBalance({
    address: address,
    token: CONTRACTS.usdc,
  });

  // Check if on wrong network
  const isWrongNetwork = isConnected && chain?.id !== baseSepolia.id;

  const handleConnect = () => {
    const connector = connectors[0];
    if (connector) {
      connect({ connector, chainId: baseSepolia.id });
    }
  };

  const handleSwitchNetwork = () => {
    switchChain({ chainId: baseSepolia.id });
  };

  const formatAddress = (addr) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // Not connected
  if (!isConnected) {
    return (
      <Button 
        onClick={handleConnect}
        disabled={isPending}
        className="gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-semibold px-6 shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:shadow-[0_0_40px_rgba(168,85,247,0.6)] transition-all"
      >
        <Wallet className="w-4 h-4" />
        {isPending ? 'Connecting...' : 'Connect Wallet'}
      </Button>
    );
  }

  // Wrong network
  if (isWrongNetwork) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 text-yellow-500 text-sm">
          <AlertCircle className="w-4 h-4" />
          Wrong Network
        </div>
        <Button 
          onClick={handleSwitchNetwork}
          variant="outline"
          size="sm"
        >
          Switch to Base Sepolia
        </Button>
      </div>
    );
  }

  // Connected to Base Sepolia
  return (
    <motion.div 
      className="flex items-center gap-2"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200 }}
    >
      {/* Connected Wallet Card */}
      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 shadow-[0_0_30px_rgba(168,85,247,0.3)] backdrop-blur-xl">
        {/* Network Indicator */}
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.6)]" />
          <span className="text-xs font-medium text-success hidden md:inline">Base Sepolia</span>
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-border/50 hidden md:block" />

        {/* Balances */}
        <div className="hidden lg:flex items-center gap-3 text-xs">
          <span className="text-muted-foreground">
            {ethBalance ? `${parseFloat(ethBalance.formatted).toFixed(3)} ETH` : '0 ETH'}
          </span>
          <span className="font-semibold gradient-text">
            {usdcBalance ? `${parseFloat(usdcBalance.formatted).toFixed(2)} USDC` : '0 USDC'}
          </span>
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-border/50" />

        {/* Wallet Address */}
        <div className="flex items-center gap-2">
          <Wallet className="w-3.5 h-3.5 text-primary" />
          <span className="text-sm font-medium gradient-text">
            {formatAddress(address)}
          </span>
        </div>
      </div>

      {/* Disconnect Button */}
      <Button
        onClick={() => disconnect()}
        variant="ghost"
        size="icon"
        className="h-9 w-9 hover:bg-destructive/20 hover:text-destructive transition-all"
      >
        <LogOut className="w-4 h-4" />
      </Button>
    </motion.div>
  );
}