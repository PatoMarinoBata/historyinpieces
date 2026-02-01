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

  // Seed example pieces (2 per category). Update existing by title.
  const pieces = [
      // PAINTING
      {
        title: "Mona Lisa",
        description: "A portrait by Leonardo da Vinci, arguably the most famous painting in the world.",
        history: "Painted between 1503 and 1506. Acquired by King Francis I and later moved to the Louvre.",
        images: ["/images/mona-lisa.jpg", "/images/Monalisa2.jpg", "/images/Monalisa3.jpg"],
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
        images: ["/images/starry-night.jpg"],
        category: "PAINTING",
        transactionHistory: [
          { date: "1941-01-01", owner: "Museum of Modern Art, New York" }
        ],
      },
      {
        title: "Girl with a Pearl Earring",
        description: "Oil painting by Dutch Golden Age painter Johannes Vermeer.",
        history: "Created around 1665, often referred to as 'the Mona Lisa of the North'. Housed in the Mauritshuis museum.",
        images: ["https://upload.wikimedia.org/wikipedia/commons/0/0f/1665_Girl_with_a_Pearl_Earring.jpg"],
        category: "PAINTING",
        transactionHistory: [
          { date: "1902-01-01", owner: "Mauritshuis, The Hague" }
        ],
      },
      {
        title: "The Last Supper",
        description: "Mural painting by Leonardo da Vinci depicting Jesus's final meal with his apostles.",
        history: "Painted between 1495-1498 on the wall of Santa Maria delle Grazie in Milan. One of the most recognized works in Western art.",
        images: ["https://upload.wikimedia.org/wikipedia/commons/4/4b/%C3%9Altima_Cena_-_Da_Vinci_5.jpg"],
        category: "PAINTING",
        transactionHistory: [
          { date: "1498-01-01", owner: "Santa Maria delle Grazie, Milan" }
        ],
      },
      {
        title: "The Scream",
        description: "Iconic painting by Norwegian artist Edvard Munch.",
        history: "Created in 1893, expressing existential angst. Four versions exist - pastel and oil paintings.",
        images: ["https://upload.wikimedia.org/wikipedia/commons/c/c5/Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg"],
        category: "PAINTING",
        lastSoldPrice: 119900000,
        lastSoldDate: new Date("2012-05-02"),
        transactionHistory: [
          { date: "1893-01-01", owner: "Edvard Munch" },
          { date: "2012-05-02", owner: "Private Collector", price: 119900000 }
        ],
      },
      // CAR
      {
        title: "Al Capone's 1928 Cadillac",
        description: "Armored Cadillac Town Sedan used by notorious gangster Al Capone.",
        history: "Built with bulletproof glass and armor plating. Later used by President Franklin D. Roosevelt.",
        images: ["/images/cadillac.svg"],
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
        images: ["/images/aston-martin-db5.jpg"],
        category: "CAR",
        lastSoldPrice: 6385000,
        lastSoldDate: new Date("2019-08-15"),
        transactionHistory: [
          { date: "1964-01-01", owner: "Eon Productions" },
          { date: "2019-08-15", owner: "Private Collector", price: 6385000 }
        ],
      },
      {
        title: "1962 Ferrari 250 GTO",
        description: "The most expensive car ever sold at auction, an iconic racing Ferrari.",
        history: "Only 36 models produced between 1962-1964. Dominated GT racing in the early 1960s.",
        images: ["https://upload.wikimedia.org/wikipedia/commons/e/e4/1962_Ferrari_250_GTO.jpg"],
        category: "CAR",
        lastSoldPrice: 48405000,
        lastSoldDate: new Date("2018-08-25"),
        transactionHistory: [
          { date: "1962-01-01", owner: "Scuderia Ferrari" },
          { date: "2018-08-25", owner: "Private Collector", price: 48405000 }
        ],
      },
      {
        title: "1955 Mercedes-Benz 300 SL Gullwing",
        description: "Revolutionary sports car with distinctive upward-opening doors.",
        history: "First production car with fuel injection. Nicknamed 'Gullwing' for its unique door design.",
        images: ["https://upload.wikimedia.org/wikipedia/commons/4/4f/Mercedes-Benz_300SL_Coupe_vr_silver_EMS.jpg"],
        category: "CAR",
        lastSoldPrice: 1900000,
        lastSoldDate: new Date("2020-01-15"),
        transactionHistory: [
          { date: "1955-01-01", owner: "Mercedes-Benz" },
          { date: "2020-01-15", owner: "Private Collector", price: 1900000 }
        ],
      },
      {
        title: "1931 Bugatti Type 41 Royale",
        description: "One of the largest and most luxurious cars ever built.",
        history: "Only 6 were produced. Built for royalty with a massive 12.7L engine.",
        images: ["https://upload.wikimedia.org/wikipedia/commons/8/89/1933_Bugatti_Type_41_Royale.jpg"],
        category: "CAR",
        lastSoldPrice: 10000000,
        lastSoldDate: new Date("1987-01-01"),
        transactionHistory: [
          { date: "1931-01-01", owner: "Ettore Bugatti" },
          { date: "1987-01-01", owner: "Private Collector", price: 10000000 }
        ],
      },
      // STATUE
      {
        title: "David by Michelangelo",
        description: "Renaissance sculpture created between 1501 and 1504.",
        history: "Marble statue depicting the Biblical hero David. Originally placed in Florence's Piazza della Signoria.",
        images: ["/images/david.jpg"],
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
        images: ["/images/statue-liberty.jpg"],
        category: "STATUE",
        transactionHistory: [
          { date: "1886-10-28", owner: "United States of America" }
        ],
      },
      {
        title: "The Thinker by Auguste Rodin",
        description: "Bronze sculpture depicting a nude male figure deep in thought.",
        history: "Originally created in 1880 as part of The Gates of Hell. Over 20 castings exist worldwide.",
        images: ["https://upload.wikimedia.org/wikipedia/commons/5/56/The_Thinker_Musee_Rodin.jpg"],
        category: "STATUE",
        transactionHistory: [
          { date: "1880-01-01", owner: "Auguste Rodin" },
          { date: "1922-01-01", owner: "Musée Rodin, Paris" }
        ],
      },
      {
        title: "Venus de Milo",
        description: "Ancient Greek marble statue believed to depict Aphrodite.",
        history: "Created between 130-100 BC, discovered in 1820 on the island of Milos. Famous for missing arms.",
        images: ["https://upload.wikimedia.org/wikipedia/commons/6/6b/Venus_de_Milo_Louvre_Ma399.jpg"],
        category: "STATUE",
        transactionHistory: [
          { date: "1820-04-08", owner: "France" },
          { date: "1821-01-01", owner: "Louvre Museum" }
        ],
      },
      {
        title: "Christ the Redeemer",
        description: "Art Deco statue of Jesus Christ in Rio de Janeiro, Brazil.",
        history: "Constructed between 1922-1931. Stands 98 feet tall on Corcovado mountain. Considered the largest Art Deco statue.",
        images: ["https://upload.wikimedia.org/wikipedia/commons/4/4f/Christ_the_Redeemer_-_Cristo_Redentor.jpg"],
        category: "STATUE",
        transactionHistory: [
          { date: "1931-10-12", owner: "Archdiocese of Rio de Janeiro" }
        ],
      },
      // COLLECTIBLE
      {
        title: "Honus Wagner T206 Baseball Card",
        description: "One of the rarest and most valuable baseball cards ever produced.",
        history: "Produced between 1909-1911. Only 50-200 copies believed to exist.",
        images: ["/images/baseball-card.svg"],
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
        images: ["/images/action-comics.svg"],
        category: "COLLECTIBLE",
        lastSoldPrice: 3250000,
        lastSoldDate: new Date("2021-04-06"),
        transactionHistory: [
          { date: "1938-06-01", owner: "DC Comics" },
          { date: "2021-04-06", owner: "Private Collector", price: 3250000 }
        ],
      },
      {
        title: "1933 Double Eagle Gold Coin",
        description: "The most valuable coin in the world, a $20 gold piece.",
        history: "Never officially circulated. Only one is legal to own after a legal battle. Sold for record price in 2002.",
        images: ["https://upload.wikimedia.org/wikipedia/commons/d/d4/NNC-US-1933-G%2420-Saint_Gaudens_%28Smithsonian%29.jpg"],
        category: "COLLECTIBLE",
        lastSoldPrice: 18900000,
        lastSoldDate: new Date("2021-06-08"),
        transactionHistory: [
          { date: "1933-01-01", owner: "US Mint" },
          { date: "2021-06-08", owner: "Private Collector", price: 18900000 }
        ],
      },
      {
        title: "The Black Lotus (Alpha)",
        description: "The most valuable Magic: The Gathering trading card.",
        history: "From the first Magic set released in 1993. Extremely powerful and rare. Only ~1,100 exist.",
        images: ["https://upload.wikimedia.org/wikipedia/en/e/e4/Black_Lotus.jpg"],
        category: "COLLECTIBLE",
        lastSoldPrice: 540000,
        lastSoldDate: new Date("2021-01-27"),
        transactionHistory: [
          { date: "1993-08-05", owner: "Wizards of the Coast" },
          { date: "2021-01-27", owner: "Private Collector", price: 540000 }
        ],
      },
      {
        title: "1909 Penny with VDB",
        description: "Rare Lincoln cent with designer's initials on the reverse.",
        history: "First year of Lincoln penny production. VDB initials removed after public outcry. San Francisco mint version extremely rare.",
        images: ["https://upload.wikimedia.org/wikipedia/commons/7/70/1909-S_VDB_Lincoln_Cent.jpg"],
        category: "COLLECTIBLE",
        lastSoldPrice: 1800000,
        lastSoldDate: new Date("2010-01-01"),
        transactionHistory: [
          { date: "1909-01-01", owner: "US Mint" },
          { date: "2010-01-01", owner: "Private Collector", price: 1800000 }
        ],
      },
      // DOCUMENT
      {
        title: "Magna Carta (1215)",
        description: "Medieval charter guaranteeing English political liberties.",
        history: "Drafted in 1215 to make peace between King John and rebel barons. Foundation of constitutional law.",
        images: ["/images/magna-carta.jpg"],
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
        images: ["/images/declaration.svg"],
        category: "DOCUMENT",
        transactionHistory: [
          { date: "1776-07-04", owner: "Continental Congress" },
          { date: "1952-01-01", owner: "National Archives, Washington D.C." }
        ],
      },
      {
        title: "Gutenberg Bible",
        description: "The first major book printed using movable type in Europe.",
        history: "Printed by Johannes Gutenberg in Mainz, Germany around 1455. Revolutionized book production.",
        images: ["https://upload.wikimedia.org/wikipedia/commons/b/b4/Gutenberg_Bible%2C_Lenox_Copy%2C_New_York_Public_Library%2C_2009._Pic_01.jpg"],
        category: "DOCUMENT",
        lastSoldPrice: 4900000,
        lastSoldDate: new Date("1987-10-22"),
        transactionHistory: [
          { date: "1455-01-01", owner: "Johannes Gutenberg" },
          { date: "1987-10-22", owner: "Private Collector", price: 4900000 }
        ],
      },
      {
        title: "The Constitution of the United States",
        description: "Supreme law of the United States, ratified in 1788.",
        history: "Written in 1787 at the Constitutional Convention in Philadelphia. Establishes the framework of the federal government.",
        images: ["https://upload.wikimedia.org/wikipedia/commons/6/6f/Constitution_of_the_United_States%2C_page_1.jpg"],
        category: "DOCUMENT",
        transactionHistory: [
          { date: "1787-09-17", owner: "United States" },
          { date: "1952-01-01", owner: "National Archives, Washington D.C." }
        ],
      },
      {
        title: "Emancipation Proclamation",
        description: "Presidential proclamation freeing slaves in Confederate states.",
        history: "Issued by Abraham Lincoln on January 1, 1863 during the American Civil War.",
        images: ["https://upload.wikimedia.org/wikipedia/commons/e/e5/Emancipation_Proclamation.jpg"],
        category: "DOCUMENT",
        transactionHistory: [
          { date: "1863-01-01", owner: "United States Government" },
          { date: "1936-01-01", owner: "National Archives, Washington D.C." }
        ],
      },
      // OTHER
      {
        title: "Hope Diamond",
        description: "A 45.52-carat deep-blue diamond, one of the most famous jewels in the world.",
        history: "Discovered in India in the 17th century. Donated to the Smithsonian Institution in 1958.",
        images: ["/images/hope-diamond.jpg"],
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
        images: ["/images/crown-jewels.svg"],
        category: "OTHER",
        transactionHistory: [
          { date: "1661-01-01", owner: "British Monarchy" }
        ],
      },
      {
        title: "Rosetta Stone",
        description: "Ancient Egyptian granodiorite stele with decree in three scripts.",
        history: "Created in 196 BC. Discovered in 1799. Key to deciphering Egyptian hieroglyphs.",
        images: ["https://upload.wikimedia.org/wikipedia/commons/2/23/Rosetta_Stone.JPG"],
        category: "OTHER",
        transactionHistory: [
          { date: "1799-07-15", owner: "French Army" },
          { date: "1802-01-01", owner: "British Museum" }
        ],
      },
      {
        title: "The Holy Grail (Chalice of Doña Urraca)",
        description: "Medieval chalice claimed by some to be the Holy Grail.",
        history: "11th century onyx chalice housed in León, Spain. Donated by Princess Urraca of Zamora.",
        images: ["https://upload.wikimedia.org/wikipedia/commons/1/14/Santo_C%C3%A1liz_de_Valencia.JPG"],
        category: "OTHER",
        transactionHistory: [
          { date: "1055-01-01", owner: "Princess Urraca of Zamora" },
          { date: "1063-01-01", owner: "Basilica of San Isidoro, León" }
        ],
      },
      {
        title: "The Shroud of Turin",
        description: "Linen cloth bearing the image of a man, believed by some to be Jesus Christ.",
        history: "First recorded in 1354. Has been subject of scientific study and religious devotion. Housed in Turin Cathedral.",
        images: ["https://upload.wikimedia.org/wikipedia/commons/5/56/Shroud_positive_negative_compare.jpg"],
        category: "OTHER",
        transactionHistory: [
          { date: "1354-01-01", owner: "House of Savoy" },
          { date: "1983-01-01", owner: "Holy See" }
        ],
      },
    ];

  for (const piece of pieces) {
    const existing = await prisma.piece.findFirst({ where: { title: piece.title } });
    if (existing) {
      await prisma.piece.update({ where: { id: existing.id }, data: piece as any });
    } else {
      await prisma.piece.create({ data: piece as any });
    }
  }
  console.log(`Seeded ${pieces.length} example pieces across all categories.`);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());