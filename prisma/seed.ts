import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const TROY_OZ_GRAMS = 31.1034768;

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

  const gold = {
    ...toMetalJson(11250),
    tejabiGold22k: toMetalJson(10350),
  };
  const silver = toMetalJson(145);

  if (latestMetalPrice) {
    await prisma.metalPrice.update({
      where: { id: latestMetalPrice.id },
      data: { gold, silver, isLatest: true },
    });
  } else {
    await prisma.metalPrice.create({
      data: {
        gold,
        silver,
        isLatest: true,
      },
    });
  }

  console.log("Seed complete (admin + dummy metal prices).");
  console.log("  Login:", admin.email, "/", adminPassword);
  console.log("  Gold 24k:", gold.perGram, "NPR/g");
  console.log("  Gold 22k (tejabi):", gold.tejabiGold22k.perGram, "NPR/g");
  console.log("  Silver:", silver.perGram, "NPR/g");
  console.log("  To remove old demo data: npm run db:clear-dummy");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
