import { NextResponse } from "next/server";
import { formatUnits, parseUnits } from "ethers";
import { MONAD_TOKENS_BY_ADDRESS } from "../../../../constants";

// Cette fonction sera remplacée par l'intégration réelle avec le DEX Monad
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sellToken, buyToken, sellAmount, takerAddress } = body;

    // TODO: Remplacer par l'appel au DEX Monad
    // Pour l'instant, on simule un taux de change fixe pour le test
    const mockPrice = {
      price: "1.0", // 1:1 pour le test
      guaranteedPrice: "0.98", // 2% de slippage
      estimatedPriceImpact: "0.0",
      buyAmount: (BigInt(sellAmount) * 98n) / 100n, // Simuler 2% de slippage
      sellAmount,
      grossBuyAmount: sellAmount,
      grossSellAmount: sellAmount,
      gas: "100000",
      estimatedGas: "100000",
      fees: {
        integratorFee: {
          amount: "0",
          token: buyToken,
        },
      },
      source: "MonadDEX",
      buyTokenAddress: buyToken,
      sellTokenAddress: sellToken,
      allowanceTarget: "0x0000000000000000000000000000000000000000", // À mettre à jour
      issues: {
        allowance: null,
      },
    };

    return NextResponse.json(mockPrice);
  } catch (error) {
    console.error("Error in price endpoint:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
