import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const TROY_OZ_GRAMS = 31.1034768;
const GRAMS_PER_TOLA = 11.664;

function toMetalJson(perGram: number, currency = "NPR") {
  return {
    perGram,
    perOunce: perGram * TROY_OZ_GRAMS,
    currency,
  };
}

/** Seeds the admin account and a latest dummy metal-price record. */
async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@panchakanya.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin12345";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      role: UserRole.ADMIN,
      isActive: true,
      isVerified: true,
    },
    create: {
      email: adminEmail,
      passwordHash,
      name: "Admin",
      role: UserRole.ADMIN,
      isActive: true,
      isVerified: true,
    },
  });

  const latestMetalPrice = await prisma.metalPrice.findFirst({
    where: { isLatest: true },
    orderBy: { createdAt: "desc" },
  });

  // Seed base inputs as "per tola" like Nepali bullion rates.
  const baseGold999PerTola = 311000; // 99.9%
  const baseSilverPerTola = 5350;
  const purityConfig = { "24": 99.9, "22": 91.6, "18": 75, "14": 58.3, "10": 41.7 };

  const fineGoldPerGram = baseGold999PerTola / GRAMS_PER_TOLA;
  const silverPerGram = baseSilverPerTola / GRAMS_PER_TOLA;
  const tejabi22PerGram = (baseGold999PerTola * (purityConfig["22"] / 99.9)) / GRAMS_PER_TOLA;

  const gold = {
    ...toMetalJson(fineGoldPerGram),
    tejabiGold22k: toMetalJson(tejabi22PerGram),
  };
  const silver = toMetalJson(silverPerGram);

  if (latestMetalPrice) {
    await prisma.metalPrice.update({
      where: { id: latestMetalPrice.id },
      data: {
        gold,
        silver,
        baseGold999PerTola,
        baseSilverPerTola,
        tolaGrams: GRAMS_PER_TOLA,
        purityConfig,
        isLatest: true,
      } as any,
    });
  } else {
    await prisma.metalPrice.create({
      data: {
        gold,
        silver,
        baseGold999PerTola,
        baseSilverPerTola,
        tolaGrams: GRAMS_PER_TOLA,
        purityConfig,
        isLatest: true,
      } as any,
    });
  }

  const productTypes = [
    { name: "Gold", slug: "gold", sortOrder: 1 },
    { name: "Silver", slug: "silver", sortOrder: 2 },
    { name: "Diamond", slug: "diamond", sortOrder: 3 },
    { name: "Astral Gems", slug: "astral_gems", sortOrder: 4 },
  ];

  for (const productType of productTypes) {
    await prisma.productType.upsert({
      where: { slug: productType.slug },
      update: {
        name: productType.name,
        sortOrder: productType.sortOrder,
        isActive: true,
      },
      create: {
        ...productType,
        isActive: true,
      },
    });
  }

  const metalTypes = [
    { name: "Gold", slug: "gold", sortOrder: 1 },
    { name: "Silver", slug: "silver", sortOrder: 2 },
    { name: "Platinum", slug: "platinum", sortOrder: 3 },
    { name: "Rose Gold", slug: "rose_gold", sortOrder: 4 },
  ];

  for (const metalType of metalTypes) {
    await prisma.metalType.upsert({
      where: { slug: metalType.slug },
      update: {
        name: metalType.name,
        sortOrder: metalType.sortOrder,
        isActive: true,
      },
      create: {
        ...metalType,
        isActive: true,
      },
    });
  }

  console.log("Seed complete (admin + metal prices + product types + metal types).");
  console.log("  Login:", admin.email, "/", adminPassword);
  console.log("  Gold 24k:", gold.perGram, "NPR/g");
  console.log("  Gold 22k (tejabi):", gold.tejabiGold22k.perGram, "NPR/g");
  console.log("  Silver:", silver.perGram, "NPR/g");
  console.log("  Product types:", productTypes.map((pt) => pt.name).join(", "));
  console.log("  Metal types:", metalTypes.map((mt) => mt.name).join(", "));
  console.log("  To remove old demo data: npm run db:clear-dummy");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
