import { useAccount, useConnect, useDisconnect, useSwitchChain, useBalance } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { Button } from '@/components/ui/button';
import { Wallet, AlertCircle, CheckCircle, LogOut } from 'lucide-react';
import { CONTRACTS } from '@/config/contracts';
import { motion } from 'framer-motion';

export default function WalletConnect() {
  const { address, isConnected, chain, connector } = useAccount();
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

  // Check if using Smart Wallet
  const isSmartWallet = connector?.id === 'coinbaseWalletSDK';
  const isWrongNetwork = isConnected && chain?.id !== baseSepolia.id;

  const handleConnect = (selectedConnector) => {
    connect({ connector: selectedConnector, chainId: baseSepolia.id });
  };

  const handleSwitchNetwork = () => {
    switchChain({ chainId: baseSepolia.id });
  };

  const formatAddress = (addr) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // Not connected - Show dropdown with wallet options
  if (!isConnected) {
    return (
      <Button 
        onClick={handleConnect}
        disabled={isPending}
        className="gap-2"
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
    <div className="flex items-center gap-3">
      {/* Network Indicator */}
      <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20">
        <CheckCircle className="w-4 h-4 text-green-500" />
        <span className="text-sm font-medium text-green-500">Base Sepolia</span>
      </div>

      {/* Balances */}
      <div className="hidden lg:flex flex-col items-end gap-0.5">
        <div className="text-xs text-muted-foreground">
          {ethBalance ? `${parseFloat(ethBalance.formatted).toFixed(4)} ETH` : '0 ETH'}
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