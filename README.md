# LoopLens - Frontend

AI-powered prediction markets on Base where users bet with or against AI predictions.

## 🌐 Live Demo

**Production:** [https://looplens-market-deck.vercel.app](https://looplens-market-deck.vercel.app)

## 🎯 Features

- ✅ Real-time blockchain market data
- ✅ Coinbase Smart Wallet (gasless transactions)
- ✅ MetaMask support (traditional wallet)
- ✅ Dynamic AI confidence indicators (55-88%)
- ✅ Responsive design
- ✅ Market countdown timers

## 🛠 Tech Stack

- React 18 + TypeScript
- Vite
- Wagmi v2 (Web3 integration)
- TailwindCSS + Shadcn/ui
- Framer Motion (animations)

## 🚀 Local Development
```bash
npm install
npm run dev
```

Visit http://localhost:5173

## 📦 Build
```bash
npm run build
```

## 🔗 Related Repos

- Smart Contracts: [looplens-contracts](https://github.com/Breden21/looplens-contracts)
- AI Agent: [looplens-ai-agent](https://github.com/Breden21/looplens-ai-agent)

## 📝 Contract Addresses (Base Sepolia)

- PredictionMarket: `0xb69477DBeB7C0CD962D88D25024F1e4f6FCD3a99`
- USDC: `0x036CbD53842c5426634e7929541eC2318f3dCF7e`

## 🌟 Key Components

- `useBlockchainMarkets` - Fetches markets from blockchain
- `useBetting` - Handles USDC approval and betting
- `WalletConnect` - Multi-wallet connection
- `BetModal` - Betting interface

## 📄 License

MIT
Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
