import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not configured");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const categoryNames = ["Food", "Travel", "Shopping"];

  for (const name of categoryNames) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  const paymentMethodNames = [
    "Cash",
    "UPI",
    "Credit Card",
    "Debit Card",
    "Net Banking",
  ];

  for (const name of paymentMethodNames) {
    await prisma.paymentMethod.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log("Default categories and payment methods seeded successfully.");
}

main()
  .catch((error) => {
    console.error("Failed to seed categories:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
