import { createConfig, http } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { coinbaseWallet, metaMask } from 'wagmi/connectors';

const PAYMASTER_URL = "https://api.developer.coinbase.com/rpc/v1/base-sepolia/3Dtd499W2VyNCGJuA9gozl3FpbgRhmxt";

export const config = createConfig({
  chains: [baseSepolia],
  connectors: [
    coinbaseWallet({
      appName: 'LoopLens',
      preference: 'smartWalletOnly', // ✅ Force Smart Wallet
      version: '4',
    }),
    metaMask(), // ✅ Fallback for users who want to use MetaMask
  ],
  transports: {
    [baseSepolia.id]: http(PAYMASTER_URL), // ✅ Use paymaster endpoint
  },
});