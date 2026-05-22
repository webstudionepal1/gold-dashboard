import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiError, apiSuccess } from "@/lib/api-response";
import { withMongoId, withMongoIds } from "@/lib/serializers";
import { parseBody } from "../crud";

const TROY_OZ_GRAMS = 31.1034768;

type MetalJson = {
  perGram: number;
  perOunce: number;
  currency: string;
  tejabiGold22k?: MetalJson;
};

function toMetalJson(perGram: number, currency: string): MetalJson {
  const perGramNum = Number(perGram) || 0;
  return {
    perGram: perGramNum,
    perOunce: perGramNum * TROY_OZ_GRAMS,
    currency: currency || "NPR",
  };
}

function toMetalPriceRecord(
  id: string,
  metal: MetalJson,
  createdAt: Date
) {
  const ts = createdAt.toISOString();
  return {
    _id: id,
    pricePerGram: metal.perGram,
    pricePerOunce: metal.perOunce,
    currency: metal.currency,
    timestamp: ts,
    source: "database",
    createdAt: ts,
    updatedAt: ts,
    __v: 0,
    isActive: true,
  };
}

function formatLatestResponse(price: {
  id: string;
  gold: unknown;
  silver: unknown;
  createdAt: Date;
}) {
  const gold = price.gold as MetalJson;
  const silver = price.silver as MetalJson;
  const goldPrice = toMetalPriceRecord(`${price.id}-gold-fine`, gold, price.createdAt);
  const tejabi =
    gold.tejabiGold22k &&
    toMetalPriceRecord(
      `${price.id}-gold-tejabi`,
      gold.tejabiGold22k,
      price.createdAt
    );

  return {
    goldPrice,
    silverPrice: toMetalPriceRecord(`${price.id}-silver`, silver, price.createdAt),
    nepali: {
      gold: {
        fineGold24k: goldPrice,
        ...(tejabi && { tejabiGold22k: tejabi }),
      },
      silver: toMetalPriceRecord(`${price.id}-silver`, silver, price.createdAt),
    },
    lastUpdated: price.createdAt.toISOString(),
  };
}

export async function handleMetalPricesLatest() {
  const price = await prisma.metalPrice.findFirst({
    where: { isLatest: true },
    orderBy: { createdAt: "desc" },
  });

  if (!price) {
    return apiSuccess({
      goldPrice: {
        pricePerGram: 0,
        pricePerOunce: 0,
        currency: "NPR",
        timestamp: new Date().toISOString(),
        source: "database",
      },
      silverPrice: {
        pricePerGram: 0,
        pricePerOunce: 0,
        currency: "NPR",
        timestamp: new Date().toISOString(),
        source: "database",
      },
    });
  }

  return apiSuccess(formatLatestResponse(price));
}

export async function handleMetalPricesList() {
  const items = await prisma.metalPrice.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return apiSuccess(withMongoIds(items));
}

export async function handleMetalPriceCreate(req: NextRequest) {
  try {
    const body = (await parseBody(req)) as Record<string, unknown>;
    const currency = String(body.currency || "NPR");

    const fineGoldPerGram = Number(
      body.fineGold24kPerGram ?? body.goldPerGram ?? body.fineGoldPerGram
    );
    const tejabiGoldPerGram = Number(
      body.tejabiGold22kPerGram ?? body.tejabiGoldPerGram ?? 0
    );
    const silverPerGram = Number(body.silverPerGram);

    if (!fineGoldPerGram || fineGoldPerGram <= 0) {
      return apiError("Fine gold (24k) price per gram is required", 400);
    }
    if (!silverPerGram || silverPerGram <= 0) {
      return apiError("Silver price per gram is required", 400);
    }

    const gold: MetalJson = toMetalJson(fineGoldPerGram, currency);
    if (tejabiGoldPerGram > 0) {
      gold.tejabiGold22k = toMetalJson(tejabiGoldPerGram, currency);
    }

    const silver = toMetalJson(silverPerGram, currency);

    await prisma.$transaction([
      prisma.metalPrice.updateMany({
        where: { isLatest: true },
        data: { isLatest: false },
      }),
      prisma.metalPrice.create({
        data: {
          gold,
          silver,
          isLatest: true,
        },
      }),
    ]);

    const latest = await prisma.metalPrice.findFirst({
      where: { isLatest: true },
      orderBy: { createdAt: "desc" },
    });

    if (!latest) return apiError("Failed to save metal prices", 500);

    return apiSuccess(
      {
        record: withMongoId(latest),
        ...formatLatestResponse(latest),
      },
      "Metal prices updated",
      201
    );
  } catch (error) {
    console.error("Metal price create error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to save metal prices";
    return apiError(message, 500);
  }
}
