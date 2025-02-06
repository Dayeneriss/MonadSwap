import { Address } from "viem";

export interface PriceResponse {
  price: string;
  guaranteedPrice: string;
  estimatedPriceImpact: string;
  buyAmount: string;
  sellAmount: string;
  grossBuyAmount: string;
  grossSellAmount: string;
  gas: string;
  estimatedGas: string;
  source: string;
  buyTokenAddress: string;
  sellTokenAddress: string;
  allowanceTarget: string;
  fees: {
    integratorFee: {
      amount: string;
      token: string;
    };
  };
  issues: {
    allowance: {
      spender?: string;
      amount?: string;
    } | null;
  };
}

export interface QuoteResponse {
  chainId: number;
  price: string;
  guaranteedPrice: string;
  to: Address;
  data: string;
  value: string;
  gas: string;
  estimatedGas: string;
  gasPrice: string;
  buyAmount: string;
  sellAmount: string;
  buyTokenAddress: string;
  sellTokenAddress: string;
  allowanceTarget: string;
}
