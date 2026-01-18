import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = "test123";
  const hashed = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {
      password: hashed,
      name: "Admin",
      role: "ADMIN",
    },
    create: {
      email: "admin@example.com",
      password: hashed,
      name: "Admin",
      role: "ADMIN",
    },
  });

  console.log("Admin user created!");
  console.log("Email: admin@example.com");
  console.log(`Password: ${password}`);
  console.log("Use these to log in later.");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());