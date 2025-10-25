import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { parseUnits } from 'viem';
import { CONTRACTS, PREDICTION_MARKET_ABI, USDC_ABI } from '@/config/contracts';

export function useBetting() {
  const { writeContractAsync, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });
  const { address, connector } = useAccount();

  // Check if using Coinbase Smart Wallet
  const isSmartWallet = connector?.id === 'coinbaseWalletSDK';

  // Approve USDC spending
  const approveUSDC = async (amount: string) => {
    const amountInWei = parseUnits(amount, 6); // USDC has 6 decimals
    
    console.log('Approving USDC...', {
      amount,
      amountInWei: amountInWei.toString(),
      isSmartWallet,
    });

    return await writeContractAsync({
      address: CONTRACTS.usdc as `0x${string}`,
      abi: USDC_ABI,
      functionName: 'approve',
      args: [CONTRACTS.predictionMarket, amountInWei],
      // Smart Wallet automatically uses paymaster
    });
  };

  // Place a bet
  const placeBet = async (marketId: number, withAI: boolean, amount: string) => {
    const amountInWei = parseUnits(amount, 6);
    
    console.log('Placing bet...', {
      marketId,
      withAI,
      amount,
      amountInWei: amountInWei.toString(),
      isSmartWallet,
    });

    return await writeContractAsync({
      address: CONTRACTS.predictionMarket as `0x${string}`,
      abi: PREDICTION_MARKET_ABI,
      functionName: 'placeBet',
      args: [BigInt(marketId), withAI, amountInWei],
      // Smart Wallet automatically uses paymaster
    });
  };

  // Claim winnings
  const claimWinnings = async (marketId: number) => {
    console.log('Claiming winnings...', {
      marketId,
      isSmartWallet,
    });

    return await writeContractAsync({
      address: CONTRACTS.predictionMarket as `0x${string}`,
      abi: PREDICTION_MARKET_ABI,
      functionName: 'claim',
      args: [BigInt(marketId)],
      // Smart Wallet automatically uses paymaster
    });
  };

  return {
    approveUSDC,
    placeBet,
    claimWinnings,
    isPending: isPending || isConfirming,
    isSmartWallet,
  };
}