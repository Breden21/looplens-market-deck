import { useAccount, useConnect, useDisconnect, useSwitchChain, useBalance } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { Button } from '@/components/ui/button';
import { Wallet, AlertCircle, CheckCircle } from 'lucide-react';
import { CONTRACTS } from '@/config/contracts';

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
        <div className="text-xs font-medium">
          {usdcBalance ? `${parseFloat(usdcBalance.formatted).toFixed(2)} USDC` : '0 USDC'}
        </div>
      </div>

      {/* Wallet Address & Disconnect */}
      <div className="flex items-center gap-2">
        <div className="px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
          <span className="text-sm font-medium text-primary">
            {formatAddress(address)}
          </span>
        </div>
        <Button
          onClick={() => disconnect()}
          variant="ghost"
          size="sm"
        >
          Disconnect
        </Button>
      </div>
    </div>
  );
}