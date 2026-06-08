import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiError, apiSuccess } from "@/lib/api-response";
import { withMongoId, withMongoIds } from "@/lib/serializers";
import { parseBody } from "../crud";

const TROY_OZ_GRAMS = 31.1034768;
const DEFAULT_TOLA_GRAMS = 11.664;

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

type PurityConfig = Record<string, number>;

function parsePurityConfig(value: unknown): PurityConfig {
  if (!value || typeof value !== "object") {
    return { "24": 99.9, "22": 91.6, "18": 75, "14": 58.3, "10": 41.7 };
  }
  const cfg = value as Record<string, unknown>;
  const out: PurityConfig = {};
  for (const [k, v] of Object.entries(cfg)) {
    const num = Number(v);
    if (Number.isFinite(num) && num > 0) out[k] = num;
  }
  return Object.keys(out).length > 0
    ? out
    : { "24": 99.9, "22": 91.6, "18": 75, "14": 58.3, "10": 41.7 };
}

function computePerGramFromTola(perTola: number, tolaGrams: number) {
  const denom = Number(tolaGrams) || DEFAULT_TOLA_GRAMS;
  return denom > 0 ? perTola / denom : 0;
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
  baseGold999PerTola?: number;
  baseSilverPerTola?: number;
  tolaGrams?: number;
  purityConfig?: unknown;
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
    config: {
      baseGold999PerTola: Number(price.baseGold999PerTola ?? 0),
      baseSilverPerTola: Number(price.baseSilverPerTola ?? 0),
      tolaGrams: Number(price.tolaGrams ?? DEFAULT_TOLA_GRAMS),
      purityConfig: parsePurityConfig(price.purityConfig),
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
    take: 100,
  });

  const formatted = items.map((price) => {
    const gold = price.gold as MetalJson;
    const silver = price.silver as MetalJson;
    return withMongoId({
      _id: price.id,
      id: price.id,
      baseGold999PerTola: Number(price.baseGold999PerTola ?? 0),
      baseSilverPerTola: Number(price.baseSilverPerTola ?? 0),
      tolaGrams: Number(price.tolaGrams ?? DEFAULT_TOLA_GRAMS),
      purityConfig: parsePurityConfig(price.purityConfig),
      goldPerGram: Number(gold?.perGram ?? 0),
      silverPerGram: Number(silver?.perGram ?? 0),
      currency: gold?.currency || silver?.currency || "NPR",
      isLatest: price.isLatest,
      createdAt: price.createdAt.toISOString(),
    });
  });

  return apiSuccess(formatted);
}

export async function handleMetalPriceCreate(req: NextRequest) {
  try {
    const body = (await parseBody(req)) as Record<string, unknown>;
    const currency = String(body.currency || "NPR");

    const tolaGrams = Number(body.tolaGrams ?? DEFAULT_TOLA_GRAMS) || DEFAULT_TOLA_GRAMS;
    const purityConfig = parsePurityConfig(body.purityConfig);

    // New preferred inputs (per tola, 99.9 / fine gold base).
    const baseGold999PerTola = Number(
      body.baseGold999PerTola ?? body.fineGold999PerTola ?? body.fineGoldPerTola
    );
    const baseSilverPerTola = Number(body.baseSilverPerTola ?? body.silverPerTola);

    // Back-compat inputs (per gram).
    const fineGoldPerGramLegacy = Number(
      body.fineGold24kPerGram ?? body.goldPerGram ?? body.fineGoldPerGram
    );
    const silverPerGramLegacy = Number(body.silverPerGram);

    const hasTolaInputs =
      Number.isFinite(baseGold999PerTola) &&
      baseGold999PerTola > 0 &&
      Number.isFinite(baseSilverPerTola) &&
      baseSilverPerTola > 0;

    const fineGoldPerGram = hasTolaInputs
      ? computePerGramFromTola(baseGold999PerTola, tolaGrams)
      : fineGoldPerGramLegacy;

    const silverPerGram = hasTolaInputs
      ? computePerGramFromTola(baseSilverPerTola, tolaGrams)
      : silverPerGramLegacy;

    // Optional 22k rate (legacy field). If not provided, compute from purity config.
    const tejabiGoldPerGram =
      Number(body.tejabiGold22kPerGram ?? body.tejabiGoldPerGram ?? 0) ||
      (hasTolaInputs
        ? computePerGramFromTola(
            baseGold999PerTola * ((purityConfig["22"] ?? 91.6) / 99.9),
            tolaGrams
          )
        : 0);

    if (!fineGoldPerGram || fineGoldPerGram <= 0) {
      return apiError(
        hasTolaInputs
          ? "Fine gold (99.9) price per tola is required"
          : "Fine gold (24k) price per gram is required",
        400
      );
    }
    if (!silverPerGram || silverPerGram <= 0) {
      return apiError(
        hasTolaInputs ? "Silver price per tola is required" : "Silver price per gram is required",
        400
      );
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
          baseGold999PerTola: hasTolaInputs
            ? baseGold999PerTola
            : Number.isFinite(fineGoldPerGramLegacy) && fineGoldPerGramLegacy > 0
              ? fineGoldPerGramLegacy * tolaGrams
              : 0,
          baseSilverPerTola: hasTolaInputs
            ? baseSilverPerTola
            : Number.isFinite(silverPerGramLegacy) && silverPerGramLegacy > 0
              ? silverPerGramLegacy * tolaGrams
              : 0,
          tolaGrams,
          purityConfig,
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
