import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useState, ChangeEvent } from "react";
import { formatUnits, parseUnits } from "ethers";
import {
  useReadContract,
  useBalance,
  useSimulateContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { erc20Abi, Address } from "viem";
import {
  MONAD_TOKENS,
  MONAD_TOKENS_BY_SYMBOL,
  MAX_ALLOWANCE_MONAD,
  AFFILIATE_FEE_MONAD,
  FEE_RECIPIENT_MONAD,
} from "../../../src/constants";
import { permit2Abi } from "../../../src/utils/permit2abi";
import Image from "next/image";
import qs from "qs";

export const DEFAULT_BUY_TOKEN = (chainId: number) => {
  if (chainId === 1337) { // Monad Testnet
    return MONAD_TOKENS.USDC;
  }
  return MONAD_TOKENS.USDC; // Default to USDC
};

export const DEFAULT_SELL_TOKEN = (chainId: number) => {
  if (chainId === 1337) { // Monad Testnet
    return MONAD_TOKENS.MONAD;
  }
  return MONAD_TOKENS.MONAD; // Default to MONAD
};

export default function PriceView({
  price,
  taker,
  setPrice,
  setFinalize,
  chainId,
}: {
  price: any;
  taker: Address | undefined;
  setPrice: (price: any) => void;
  setFinalize: (finalize: boolean) => void;
  chainId: number;
}) {
  const [sellAmount, setSellAmount] = useState<string>("");
  const [buyAmount, setBuyAmount] = useState<string>("");
  const [selectedSellToken, setSelectedSellToken] = useState(
    DEFAULT_SELL_TOKEN(chainId)
  );
  const [selectedBuyToken, setSelectedBuyToken] = useState(
    DEFAULT_BUY_TOKEN(chainId)
  );

  // Fonction pour obtenir le prix (à implémenter avec le DEX Monad)
  const fetchPrice = async () => {
    if (!taker || !sellAmount || !selectedSellToken || !selectedBuyToken) {
      return;
    }

    try {
      // TODO: Remplacer par l'appel au DEX Monad
      const response = await fetch("/api/monad/price", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sellToken: selectedSellToken.address,
          buyToken: selectedBuyToken.address,
          sellAmount: parseUnits(sellAmount, selectedSellToken.decimals).toString(),
          takerAddress: taker,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch price");
      }

      const priceData = await response.json();
      setPrice(priceData);
    } catch (error) {
      console.error("Error fetching price:", error);
      setPrice(null);
    }
  };

  // Effet pour mettre à jour le prix lorsque les entrées changent
  useEffect(() => {
    if (sellAmount && !isNaN(Number(sellAmount))) {
      fetchPrice();
    } else {
      setPrice(null);
    }
  }, [sellAmount, selectedSellToken, selectedBuyToken, taker]);

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6">
      <div className="space-y-4">
        {/* Sélection du token à vendre */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            You Pay
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="text"
              value={sellAmount}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setSellAmount(e.target.value);
              }}
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-4 pr-12 sm:text-sm border-gray-300 rounded-md"
              placeholder="0.0"
            />
            <div className="absolute inset-y-0 right-0 flex items-center">
              <select
                value={selectedSellToken.symbol}
                onChange={(e) => {
                  setSelectedSellToken(MONAD_TOKENS_BY_SYMBOL[e.target.value]);
                }}
                className="focus:ring-indigo-500 focus:border-indigo-500 h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md"
              >
                {Object.values(MONAD_TOKENS).map((token) => (
                  <option key={token.symbol} value={token.symbol}>
                    {token.symbol}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Sélection du token à acheter */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            You Receive
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="text"
              value={buyAmount}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setBuyAmount(e.target.value);
              }}
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-4 pr-12 sm:text-sm border-gray-300 rounded-md"
              placeholder="0.0"
              readOnly
            />
            <div className="absolute inset-y-0 right-0 flex items-center">
              <select
                value={selectedBuyToken.symbol}
                onChange={(e) => {
                  setSelectedBuyToken(MONAD_TOKENS_BY_SYMBOL[e.target.value]);
                }}
                className="focus:ring-indigo-500 focus:border-indigo-500 h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md"
              >
                {Object.values(MONAD_TOKENS).map((token) => (
                  <option key={token.symbol} value={token.symbol}>
                    {token.symbol}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Bouton de swap */}
        <button
          onClick={() => setFinalize(true)}
          disabled={!price || !taker}
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            !price || !taker
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {!taker
            ? "Connect Wallet"
            : !price
            ? "Enter an amount"
            : "Review Order"}
        </button>
      </div>
    </div>
  );
}