import { useState, useEffect } from 'react';
import { useReadContract, useAccount, usePublicClient } from 'wagmi';
import { CONTRACTS, PREDICTION_MARKET_ABI } from '@/config/contracts';

export interface BlockchainMarket {
  id: number;
  title: string;
  createdAt: Date;
  endsAt: Date;
  aiConfidence: number;
  resolved: boolean;
  aiWon: boolean;
  totalWithAI: bigint;
  totalAgainstAI: bigint;
}

export function useBlockchainMarkets() {
  const { isConnected } = useAccount();
  const [markets, setMarkets] = useState<BlockchainMarket[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const publicClient = usePublicClient();

  // Get total market count
  const { data: marketCount, refetch } = useReadContract({
    address: CONTRACTS.predictionMarket as `0x${string}`,
    abi: PREDICTION_MARKET_ABI,
    functionName: 'marketCount',
  });

  console.log('🔍 Market Count:', marketCount?.toString());

  // Fetch all markets when count changes
  useEffect(() => {
    const fetchMarkets = async () => {
      if (!marketCount || !isConnected || !publicClient) {
        console.log('❌ Cannot fetch - Count:', marketCount, 'Connected:', isConnected);
        return;
      }

      const count = Number(marketCount);
      console.log(`✅ Fetching ${count} markets...`);
      
      if (count === 0) {
        setMarkets([]);
        return;
      }

      setIsLoading(true);

      try {
        const marketPromises = [];
        
        // Fetch each market using Wagmi's contract read
        for (let i = 0; i < count; i++) {
          marketPromises.push(
            publicClient.readContract({
              address: CONTRACTS.predictionMarket as `0x${string}`,
              abi: PREDICTION_MARKET_ABI,
              functionName: 'getMarket',
              args: [BigInt(i)],
            })
          );
        }

        const results = await Promise.all(marketPromises);
        
        const parsedMarkets: BlockchainMarket[] = results.map((result: any, index: number) => {
          console.log(`Market ${index} raw data:`, result);
          
          return {
            id: index,
            title: result[0] as string,
            createdAt: new Date(Number(result[1]) * 1000),
            endsAt: new Date(Number(result[2]) * 1000),
            aiConfidence: Number(result[3]),
            resolved: result[4] as boolean,
            aiWon: result[5] as boolean,
            totalWithAI: result[6] as bigint,
            totalAgainstAI: result[7] as bigint,
          };
        });

        console.log('✅ Parsed markets:', parsedMarkets);
        setMarkets(parsedMarkets);
      } catch (err) {
        console.error('❌ Error fetching markets:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarkets();
  }, [marketCount, isConnected, publicClient]);

  return { markets, refetch, isLoading };
}