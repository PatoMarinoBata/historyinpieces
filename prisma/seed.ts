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

  // Seed a sample piece if none exists
  const count = await prisma.piece.count();
  if (count === 0) {
    await prisma.piece.create({
      data: {
        title: "Mona Lisa",
        description: "A portrait by Leonardo da Vinci.",
        history: "Painted between 1503 and 1506.",
        images: ["https://upload.wikimedia.org/wikipedia/commons/6/6a/Mona_Lisa.jpg"],
        category: "PAINTING",
        transactionHistory: [
          { date: "1517-01-01", owner: "King Francis I" },
          { date: "1797-01-01", owner: "Louvre Museum" }
        ],
      },
    });
    console.log("Seeded sample piece: Mona Lisa");
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());