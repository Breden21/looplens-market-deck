import { useAccount, useConnect, useDisconnect, useSwitchChain, useBalance } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Wallet, AlertCircle, CheckCircle, Zap, ChevronDown } from 'lucide-react';
import { CONTRACTS } from '@/config/contracts';

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
      <div className="flex flex-col items-end gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              disabled={isPending}
              className="gap-2"
            >
              <Wallet className="w-4 h-4" />
              {isPending ? 'Connecting...' : 'Connect Wallet'}
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            {connectors.map((connectorOption) => (
              <DropdownMenuItem
                key={connectorOption.id}
                onClick={() => handleConnect(connectorOption)}
                className="flex items-center gap-2 cursor-pointer py-3"
              >
                <Wallet className="w-4 h-4" />
                <div className="flex-1">
                  <div className="font-medium">{connectorOption.name}</div>
                  {connectorOption.id === 'coinbaseWalletSDK' && (
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <Zap className="w-3 h-3" />
                      Gasless transactions enabled
                    </div>
                  )}
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
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

      {/* Smart Wallet Badge */}
      {isSmartWallet && (
        <div className="hidden lg:flex items-center gap-1 px-2 py-1 rounded-md bg-blue-500/10 border border-blue-500/20">
          <Zap className="w-3 h-3 text-blue-500" />
          <span className="text-xs font-medium text-blue-500">Gasless</span>
        </div>
      )}

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