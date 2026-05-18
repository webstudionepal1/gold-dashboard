import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@panchakanya.com";

/**
 * Removes all demo/seed business data. Keeps only the admin user account.
 */
async function main() {
  console.log("Clearing dummy data (keeping admin:", ADMIN_EMAIL, ")...");

  await prisma.orderItem.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.blog.deleteMany();
  await prisma.pushNotification.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.cashFlow.deleteMany();
  await prisma.purchaseReturn.deleteMany();
  await prisma.purchase.deleteMany();
  await prisma.rawItem.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.gift.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.subCategory.deleteMany();
  await prisma.category.deleteMany();
  await prisma.claspType.deleteMany();
  await prisma.stone.deleteMany();
  await prisma.occasion.deleteMany();
  await prisma.metalPrice.deleteMany();
  await prisma.priceConfig.deleteMany();
  await prisma.company.deleteMany();

  const removedUsers = await prisma.user.deleteMany({
    where: { email: { not: ADMIN_EMAIL } },
  });

  const admin = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } });

  console.log("Done.");
  console.log(`  Users removed: ${removedUsers.count}`);
  console.log(
    admin
      ? `  Admin kept: ${admin.email}`
      : `  Warning: no admin at ${ADMIN_EMAIL} — run npm run db:seed`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
