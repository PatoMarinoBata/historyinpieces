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

  // Seed example pieces (2 per category) if database is empty
  const count = await prisma.piece.count();
  if (count === 0) {
    const pieces = [
      // PAINTING
      {
        title: "Mona Lisa",
        description: "A portrait by Leonardo da Vinci, arguably the most famous painting in the world.",
        history: "Painted between 1503 and 1506. Acquired by King Francis I and later moved to the Louvre.",
        images: ["https://upload.wikimedia.org/wikipedia/commons/6/6a/Mona_Lisa.jpg"],
        category: "PAINTING",
        transactionHistory: [
          { date: "1517-01-01", owner: "King Francis I of France" },
          { date: "1797-01-01", owner: "Louvre Museum" }
        ],
      },
      {
        title: "The Starry Night",
        description: "An oil-on-canvas painting by Vincent van Gogh.",
        history: "Painted in June 1889, depicting the view from his asylum room in Saint-Rémy-de-Provence.",
        images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1280px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg"],
        category: "PAINTING",
        transactionHistory: [
          { date: "1941-01-01", owner: "Museum of Modern Art, New York" }
        ],
      },
      // CAR
      {
        title: "Al Capone's 1928 Cadillac",
        description: "Armored Cadillac Town Sedan used by notorious gangster Al Capone.",
        history: "Built with bulletproof glass and armor plating. Later used by President Franklin D. Roosevelt.",
        images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Al_Capone%27s_bulletproof_Cadillac.jpg/1280px-Al_Capone%27s_bulletproof_Cadillac.jpg"],
        category: "CAR",
        lastSoldPrice: 341000,
        lastSoldDate: new Date("2012-01-01"),
        transactionHistory: [
          { date: "1928-01-01", owner: "Al Capone", price: 20000 },
          { date: "1947-01-01", owner: "US Treasury" },
          { date: "2012-01-01", owner: "Private Collector", price: 341000 }
        ],
      },
      {
        title: "James Bond's Aston Martin DB5",
        description: "The iconic car from Goldfinger (1964) and other James Bond films.",
        history: "Featured in multiple Bond films with gadgets including machine guns and an ejector seat.",
        images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Aston_Martin_DB5_%2837984034152%29.jpg/1280px-Aston_Martin_DB5_%2837984034152%29.jpg"],
        category: "CAR",
        lastSoldPrice: 6385000,
        lastSoldDate: new Date("2019-08-15"),
        transactionHistory: [
          { date: "1964-01-01", owner: "Eon Productions" },
          { date: "2019-08-15", owner: "Private Collector", price: 6385000 }
        ],
      },
      // STATUE
      {
        title: "David by Michelangelo",
        description: "Renaissance sculpture created between 1501 and 1504.",
        history: "Marble statue depicting the Biblical hero David. Originally placed in Florence's Piazza della Signoria.",
        images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/%27David%27_by_Michelangelo_Fir_JBU002.jpg/800px-%27David%27_by_Michelangelo_Fir_JBU002.jpg"],
        category: "STATUE",
        transactionHistory: [
          { date: "1504-01-01", owner: "Republic of Florence" },
          { date: "1873-01-01", owner: "Galleria dell'Accademia, Florence" }
        ],
      },
      {
        title: "Statue of Liberty",
        description: "A colossal neoclassical sculpture on Liberty Island in New York Harbor.",
        history: "Designed by Frédéric Auguste Bartholdi. A gift from France to the United States, dedicated in 1886.",
        images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Statue_of_Liberty%2C_NY.jpg/800px-Statue_of_Liberty%2C_NY.jpg"],
        category: "STATUE",
        transactionHistory: [
          { date: "1886-10-28", owner: "United States of America" }
        ],
      },
      // COLLECTIBLE
      {
        title: "Honus Wagner T206 Baseball Card",
        description: "One of the rarest and most valuable baseball cards ever produced.",
        history: "Produced between 1909-1911. Only 50-200 copies believed to exist.",
        images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Honus_Wagner_baseball_card.jpg/800px-Honus_Wagner_baseball_card.jpg"],
        category: "COLLECTIBLE",
        lastSoldPrice: 7250000,
        lastSoldDate: new Date("2022-08-01"),
        transactionHistory: [
          { date: "1909-01-01", owner: "American Tobacco Company" },
          { date: "2022-08-01", owner: "Private Collector", price: 7250000 }
        ],
      },
      {
        title: "Action Comics #1 (1938)",
        description: "The first appearance of Superman, the most valuable comic book in existence.",
        history: "Published in June 1938. Fewer than 100 copies are thought to exist today.",
        images: ["https://upload.wikimedia.org/wikipedia/en/5/5a/Action_Comics_1.jpg"],
        category: "COLLECTIBLE",
        lastSoldPrice: 3250000,
        lastSoldDate: new Date("2021-04-06"),
        transactionHistory: [
          { date: "1938-06-01", owner: "DC Comics" },
          { date: "2021-04-06", owner: "Private Collector", price: 3250000 }
        ],
      },
      // DOCUMENT
      {
        title: "Magna Carta (1215)",
        description: "Medieval charter guaranteeing English political liberties.",
        history: "Drafted in 1215 to make peace between King John and rebel barons. Foundation of constitutional law.",
        images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Magna_Carta_%28British_Library_Cotton_MS_Augustus_II.106%29.jpg/800px-Magna_Carta_%28British_Library_Cotton_MS_Augustus_II.106%29.jpg"],
        category: "DOCUMENT",
        transactionHistory: [
          { date: "1215-06-15", owner: "Kingdom of England" },
          { date: "1753-01-01", owner: "British Library" }
        ],
      },
      {
        title: "Declaration of Independence",
        description: "Document declaring the thirteen American colonies independent from British rule.",
        history: "Adopted on July 4, 1776. Primarily drafted by Thomas Jefferson.",
        images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/United_States_Declaration_of_Independence.jpg/1024px-United_States_Declaration_of_Independence.jpg"],
        category: "DOCUMENT",
        transactionHistory: [
          { date: "1776-07-04", owner: "Continental Congress" },
          { date: "1952-01-01", owner: "National Archives, Washington D.C." }
        ],
      },
      // OTHER
      {
        title: "Hope Diamond",
        description: "A 45.52-carat deep-blue diamond, one of the most famous jewels in the world.",
        history: "Discovered in India in the 17th century. Donated to the Smithsonian Institution in 1958.",
        images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Hope_Diamond.jpg/800px-Hope_Diamond.jpg"],
        category: "OTHER",
        transactionHistory: [
          { date: "1668-01-01", owner: "Jean-Baptiste Tavernier" },
          { date: "1958-01-01", owner: "Smithsonian Institution" }
        ],
      },
      {
        title: "The Crown Jewels of England",
        description: "Collection of royal ceremonial objects including crowns, scepters, and orbs.",
        history: "Accumulated over centuries. Housed in the Tower of London since 1661.",
        images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/St_Edwards_Crown_and_the_Sovereign%27s_Sceptre_with_Cross.jpg/800px-St_Edwards_Crown_and_the_Sovereign%27s_Sceptre_with_Cross.jpg"],
        category: "OTHER",
        transactionHistory: [
          { date: "1661-01-01", owner: "British Monarchy" }
        ],
      },
    ];

    for (const piece of pieces) {
      await prisma.piece.create({ data: piece });
    }
    console.log(`Seeded ${pieces.length} example pieces across all categories.`);
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());