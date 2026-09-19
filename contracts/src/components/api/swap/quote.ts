import type { VercelRequest, VercelResponse } from "@vercel/node";
import { z } from "zod";

// --- BUSHIDØ CONFIGURATION ---
const BUSHIDO_CONFIG = {
  // Revenue Splitter contract address (Base chain)
  feeRecipient: "0xBA397fAae1D5Fe10C0356f2e585bef34577ab111",
  // Fixed 0.50% fee (50 BPS)
  feeBps: "50",
  // Standard Base Chain ID
  defaultChainId: "8453",
} as const;

// --- INPUT VALIDATION SCHEMA ---
const EVM_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;

const QuoteRequestSchema = z.object({
  chainId: z.string().default(BUSHIDO_CONFIG.defaultChainId),
  sellToken: z.string().regex(EVM_ADDRESS_REGEX, "Invalid sellToken address"),
  buyToken: z.string().regex(EVM_ADDRESS_REGEX, "Invalid buyToken address"),
  sellAmount: z.string().regex(/^\d+$/, "sellAmount must be an integer string"),
  taker: z.string().regex(EVM_ADDRESS_REGEX, "Invalid taker address"),
  slippageBps: z.string().regex(/^\d+$/).optional().default("100"), // Default 1%
  swapFeeToken: z.string().regex(EVM_ADDRESS_REGEX).optional(),
});

export type QuoteRequestQuery = z.infer<typeof QuoteRequestSchema>;

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed. Use GET." });
  }

  // Ensure 0x API key is present on server
  const apiKey = process.env.ZEROX_API_KEY;
  if (!apiKey) {
    console.error("Missing ZEROX_API_KEY environment variable");
    return res
      .status(500)
      .json({ error: "Server misconfiguration: Missing API Key" });
  }

  try {
    // 1. Validate incoming query parameters
    const validatedQuery = QuoteRequestSchema.parse(req.query);

    // 2. Build 0x Swap API v2 query string
    const zeroXParams = new URLSearchParams({
      chainId: validatedQuery.chainId,
      sellToken: validatedQuery.sellToken,
      buyToken: validatedQuery.buyToken,
      sellAmount: validatedQuery.sellAmount,
      taker: validatedQuery.taker,
      slippageBps: validatedQuery.slippageBps,

      // --- Enforce Bushidø Monetization Layer ---
      swapFeeRecipient: BUSHIDO_CONFIG.feeRecipient,
      swapFeeBps: BUSHIDO_CONFIG.feeBps,
      // Default to charging fee in sellToken if not specified
      swapFeeToken: validatedQuery.swapFeeToken ?? validatedQuery.sellToken,
    });

    // 3. Call 0x Swap API v2 AllowanceHolder quote endpoint
    const zeroXResponse = await fetch(
      `https://api.0x.org/swap/allowance-holder/quote?${zeroXParams.toString()}`,
      {
        headers: {
          "0x-api-key": apiKey,
          "0x-version": "v2",
          "Content-Type": "application/json",
        },
      }
    );

    const data = await zeroXResponse.json();

    if (!zeroXResponse.ok) {
      return res.status(zeroXResponse.status).json({
        error: "0x API quote retrieval failed",
        details: data,
      });
    }

    // 4. Return normalized quote response to mobile app
    return res.status(200).json({
      success: true,
      quote: {
        liquidityAvailable: data.liquidityAvailable,
        allowanceTarget: data.allowanceTarget, // AllowanceHolder address
        sellToken: data.sellToken,
        buyToken: data.buyToken,
        sellAmount: data.sellAmount,
        buyAmount: data.buyAmount,
        minBuyAmount: data.minBuyAmount,
        transaction: {
          to: data.transaction?.to,
          data: data.transaction?.data,
          value: data.transaction?.value,
          gas: data.transaction?.gas,
          gasPrice: data.transaction?.gasPrice,
        },
        fees: {
          integratorFee: {
            amount: data.fees?.integratorFee?.amount ?? "0",
            token: data.fees?.integratorFee?.token ?? validatedQuery.sellToken,
            bps: BUSHIDO_CONFIG.feeBps,
            recipient: BUSHIDO_CONFIG.feeRecipient,
          },
          zeroExFee: data.fees?.zeroExFee,
          gasFee: data.fees?.gasFee,
        },
        issues: data.issues ?? null,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Invalid request query parameters",
        issues: error.errors,
      });
    }

    console.error("Unhandled endpoint error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
