import {
  OrderStatus,
  PaymentStatus,
  PrismaClient,
  UserRole,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("admin12345", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@panchakanya.com" },
    update: {},
    create: {
      email: "admin@panchakanya.com",
      passwordHash,
      name: "Admin",
      role: UserRole.ADMIN,
      isActive: true,
      isVerified: true,
    },
  });

  const customers = await Promise.all(
    [
      { email: "ram@example.com", name: "Ram Sharma" },
      { email: "sita@example.com", name: "Sita Gurung" },
      { email: "hari@example.com", name: "Hari Thapa" },
    ].map((c) =>
      prisma.user.upsert({
        where: { email: c.email },
        update: {},
        create: {
          ...c,
          passwordHash,
          role: UserRole.CUSTOMER,
          isActive: true,
          isVerified: true,
        },
      })
    )
  );

  await prisma.metalPrice.deleteMany({});
  await prisma.metalPrice.create({
    data: {
      isLatest: true,
      gold: { perGram: 12500, perOunce: 388000, currency: "NPR" },
      silver: { perGram: 150, perOunce: 4665, currency: "NPR" },
    },
  });

  const goldCategory = await prisma.category.upsert({
    where: { id: "seed-category-gold" },
    update: {},
    create: {
      id: "seed-category-gold",
      name: "Gold Jewelry",
      description: "Gold products",
      isActive: true,
    },
  });

  const silverCategory = await prisma.category.upsert({
    where: { id: "seed-category-silver" },
    update: {},
    create: {
      id: "seed-category-silver",
      name: "Silver Jewelry",
      description: "Silver products",
      isActive: true,
    },
  });

  const ringsSub = await prisma.subCategory.upsert({
    where: { id: "seed-subcategory-rings" },
    update: {},
    create: {
      id: "seed-subcategory-rings",
      name: "Rings",
      description: "Gold rings",
      categoryId: goldCategory.id,
      isActive: true,
    },
  });

  const products = await Promise.all(
    [
      {
        id: "seed-product-ring-1",
        name: "22K Gold Wedding Ring",
        slug: "22k-gold-wedding-ring",
        categoryId: goldCategory.id,
        subCategoryId: ringsSub.id,
        quantity: 3,
        price: 85000,
      },
      {
        id: "seed-product-ring-2",
        name: "Diamond Studded Ring",
        slug: "diamond-studded-ring",
        categoryId: goldCategory.id,
        subCategoryId: ringsSub.id,
        quantity: 1,
        price: 125000,
      },
      {
        id: "seed-product-bangle",
        name: "Gold Bangle Set",
        slug: "gold-bangle-set",
        categoryId: goldCategory.id,
        subCategoryId: ringsSub.id,
        quantity: 8,
        price: 95000,
      },
      {
        id: "seed-product-silver-chain",
        name: "Silver Chain",
        slug: "silver-chain",
        categoryId: silverCategory.id,
        subCategoryId: ringsSub.id,
        quantity: 0,
        price: 12000,
      },
    ].map((p) =>
      prisma.product.upsert({
        where: { id: p.id },
        update: {
          quantity: p.quantity,
          isActive: true,
        },
        create: {
          id: p.id,
          name: p.name,
          slug: p.slug,
          description: `${p.name} — handcrafted jewelry`,
          categoryId: p.categoryId,
          subCategoryId: p.subCategoryId,
          quantity: p.quantity,
          isActive: true,
          images: ["/logo.png"],
          tags: ["featured"],
          visibleAs: "public",
          variants: {
            create: {
              sku: `${p.slug}-default`,
              price: p.price,
              wt: 10,
              unit: "gm",
              isActive: true,
            },
          },
        },
        include: { variants: true },
      })
    )
  );

  await prisma.orderItem.deleteMany({});
  await prisma.transaction.deleteMany({});
  await prisma.order.deleteMany({});

  const now = new Date();
  const orderSpecs = [
    { daysAgo: 0, customer: customers[0], product: products[0], qty: 1, status: OrderStatus.confirmed },
    { daysAgo: 0, customer: customers[1], product: products[1], qty: 1, status: OrderStatus.pending },
    { daysAgo: 1, customer: customers[2], product: products[2], qty: 2, status: OrderStatus.completed },
    { daysAgo: 2, customer: customers[0], product: products[1], qty: 1, status: OrderStatus.completed },
    { daysAgo: 3, customer: customers[1], product: products[0], qty: 1, status: OrderStatus.completed },
    { daysAgo: 4, customer: customers[2], product: products[2], qty: 1, status: OrderStatus.assigned },
    { daysAgo: 5, customer: customers[0], product: products[3], qty: 1, status: OrderStatus.completed },
    { daysAgo: 6, customer: customers[1], product: products[0], qty: 1, status: OrderStatus.completed },
  ];

  for (let i = 0; i < orderSpecs.length; i++) {
    const spec = orderSpecs[i];
    const variant = spec.product.variants[0];
    const totalAmount = variant.price * spec.qty;
    const createdAt = new Date(now);
    createdAt.setDate(createdAt.getDate() - spec.daysAgo);
    createdAt.setHours(10 + i, 30, 0, 0);

    const order = await prisma.order.create({
      data: {
        orderNumber: `ORD-SEED-${1000 + i}`,
        customerId: spec.customer.id,
        shippingAddress: {
          fullname: spec.customer.name,
          address: "Kathmandu",
          phone: "9800000000",
          email: spec.customer.email,
        },
        billingAddress: {
          fullname: spec.customer.name,
          address: "Kathmandu",
          phone: "9800000000",
          email: spec.customer.email,
        },
        billDetails: {
          subTotalItemPrice: totalAmount,
          shippingCost: 0,
          discount: 0,
          totalBill: totalAmount,
        },
        orderStatus: spec.status,
        paymentStatus:
          spec.status === OrderStatus.completed
            ? PaymentStatus.paid
            : PaymentStatus.pending,
        totalAmount,
        createdAt,
        items: {
          create: {
            productId: spec.product.id,
            quantity: spec.qty,
            selectedVariant: {
              price: variant.price,
              wt: variant.wt,
              unit: variant.unit,
            },
          },
        },
      },
    });

    if (spec.status === OrderStatus.completed) {
      await prisma.transaction.create({
        data: {
          transactionId: `TXN-SEED-${1000 + i}`,
          orderId: order.id,
          orderDate: createdAt,
          totalAmount,
          paymentMethod: "cash",
          payment: totalAmount,
          remainingPayment: 0,
          customerName: spec.customer.name,
        },
      });
    }
  }

  await prisma.company.upsert({
    where: { id: "seed-company-main" },
    update: {},
    create: {
      id: "seed-company-main",
      name: "Panchakanya Jewellers",
      companyName: "Panchakanya Jewellers",
      email: "info@panchakanya.com",
      phone: "+977-1-0000000",
      address: "Kathmandu, Nepal",
      openDay: "Sunday-Friday",
      openTime: "10:00",
      closeTime: "18:00",
    },
  });

  console.log("Seed complete. Admin login:", admin.email, "/ admin12345");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
