import { useEffect } from "react";
import { formatUnits } from "ethers";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { Address } from "viem";
import { MONAD_TOKENS_BY_ADDRESS } from "../../../src/constants";
import type { PriceResponse, QuoteResponse } from "../../../src/utils/types";

export default function QuoteView({
  taker,
  price,
  quote,
  setQuote,
  chainId,
}: {
  taker: Address | undefined;
  price: PriceResponse;
  quote: QuoteResponse | undefined;
  setQuote: (quote: QuoteResponse | undefined) => void;
  chainId: number;
}) {
  // Fonction pour obtenir le devis (à implémenter avec le DEX Monad)
  const fetchQuote = async () => {
    try {
      // TODO: Remplacer par l'appel au DEX Monad
      const response = await fetch("/api/monad/quote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...price,
          takerAddress: taker,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch quote");
      }

      const quoteData = await response.json();
      setQuote(quoteData);
    } catch (error) {
      console.error("Error fetching quote:", error);
      setQuote(undefined);
    }
  };

  useEffect(() => {
    if (price && taker) {
      fetchQuote();
    }
  }, [price, taker]);

  const buyToken = MONAD_TOKENS_BY_ADDRESS[price.buyTokenAddress];
  const sellToken = MONAD_TOKENS_BY_ADDRESS[price.sellTokenAddress];

  const { writeContractAsync: swap } = useWriteContract();

  const handleSwap = async () => {
    if (!quote) return;

    try {
      const tx = await swap({
        address: quote.to,
        abi: [], // TODO: Ajouter l'ABI du DEX Monad
        functionName: "swap",
        args: [], // TODO: Ajouter les arguments du swap
        value: BigInt(quote.value),
      });

      console.log("Transaction sent:", tx);
    } catch (error) {
      console.error("Error executing swap:", error);
    }
  };

  if (!quote) {
    return (
      <div className="w-full max-w-md mx-auto p-4">
        <p className="text-center text-gray-600">Loading quote...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-center mb-4">Review Order</h2>
        
        <div className="space-y-2">
          <p className="text-gray-600">
            Selling:{" "}
            <span className="font-bold">
              {formatUnits(price.sellAmount, sellToken.decimals)} {sellToken.symbol}
            </span>
          </p>
          <p className="text-gray-600">
            Receiving:{" "}
            <span className="font-bold">
              {formatUnits(price.buyAmount, buyToken.decimals)} {buyToken.symbol}
            </span>
          </p>
          <p className="text-gray-600">
            Price Impact:{" "}
            <span className="font-bold">
              {parseFloat(price.estimatedPriceImpact).toFixed(2)}%
            </span>
          </p>
        </div>

        <button
          onClick={handleSwap}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Confirm Swap
        </button>
      </div>
    </div>
  );
}