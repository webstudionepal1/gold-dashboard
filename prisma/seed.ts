import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

/** Seeds only the admin account — no dummy products, orders, or customers. */
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

  console.log("Seed complete (admin only).");
  console.log("  Login:", admin.email, "/", adminPassword);
  console.log("  To remove old demo data: npm run db:clear-dummy");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
