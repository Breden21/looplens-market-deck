// src/config/contracts.ts

// Your deployed contract addresses
export const CONTRACTS = {
  usdc: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
  predictionMarket: "0xb69477DBeB7C0CD962D88D25024F1e4f6FCD3a99",
} as const;

// USDC ABI (minimal functions needed)
export const USDC_ABI = [
  {
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" }
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" }
    ],
    name: "allowance",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

// Prediction Market ABI
export const PREDICTION_MARKET_ABI = [
  {
    inputs: [
      { name: "_title", type: "string" },
      { name: "_duration", type: "uint256" },
      { name: "_aiConfidence", type: "uint8" }
    ],
    name: "createMarket",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "_marketId", type: "uint256" },
      { name: "_withAI", type: "bool" },
      { name: "_amount", type: "uint256" }
    ],
    name: "placeBet",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "_marketId", type: "uint256" },
      { name: "_aiWon", type: "bool" }
    ],
    name: "resolveMarket",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "_marketId", type: "uint256" }],
    name: "claim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "_marketId", type: "uint256" }],
    name: "getMarket",
    outputs: [
      { name: "title", type: "string" },
      { name: "createdAt", type: "uint256" },
      { name: "endsAt", type: "uint256" },
      { name: "aiConfidence", type: "uint8" },
      { name: "resolved", type: "bool" },
      { name: "aiWon", type: "bool" },
      { name: "totalWithAI", type: "uint256" },
      { name: "totalAgainstAI", type: "uint256" }
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "_marketId", type: "uint256" },
      { name: "_user", type: "address" }
    ],
    name: "getUserBets",
    outputs: [
      { name: "withAI", type: "uint256" },
      { name: "againstAI", type: "uint256" }
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "marketCount",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

// Helper to convert USDC amount (6 decimals)
export const parseUSDC = (amount: string): bigint => {
  const [whole, decimal = ""] = amount.split(".");
  const paddedDecimal = decimal.padEnd(6, "0").slice(0, 6);
  return BigInt(whole + paddedDecimal);
};

// Helper to format USDC display
export const formatUSDC = (amount: bigint): string => {
  const str = amount.toString().padStart(7, "0");
  const whole = str.slice(0, -6) || "0";
  const decimal = str.slice(-6);
  return `${whole}.${decimal}`.replace(/\.?0+$/, "");
};