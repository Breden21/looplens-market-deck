import { createConfig, http } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { metaMask, coinbaseWallet } from 'wagmi/connectors';
import { PAYMASTER_URL } from './paymaster';

export const config = createConfig({
  chains: [baseSepolia],
  connectors: [
    metaMask(),
    coinbaseWallet({ 
      appName: 'LoopLens',
      preference: 'smartWalletOnly', // Enable Smart Wallet for gasless transactions
    }),
  ],
  transports: {
    [baseSepolia.id]: http(PAYMASTER_URL),
  },
});