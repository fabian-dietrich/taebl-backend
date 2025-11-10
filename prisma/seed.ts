import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");

  const tables = [
    { tableNumber: "1", capacity: 2, location: "Window" },
    { tableNumber: "2", capacity: 2, location: "Window" },
    { tableNumber: "3", capacity: 2, location: "Center" },
    { tableNumber: "4", capacity: 2, location: "Center" },

    { tableNumber: "5", capacity: 4, location: "Window" },
    { tableNumber: "6", capacity: 4, location: "Window" },
    { tableNumber: "7", capacity: 4, location: "Center" },
    { tableNumber: "8", capacity: 4, location: "Center" },
    { tableNumber: "9", capacity: 4, location: "Patio" },
    { tableNumber: "10", capacity: 4, location: "Patio" },

    { tableNumber: "11", capacity: 6, location: "Center" },
    { tableNumber: "12", capacity: 6, location: "Patio" },
  ];

  for (const table of tables) {
    await prisma.table.create({
      data: table,
    });
    console.log(
      `Created table ${table.tableNumber} (${table.capacity} seats, ${table.location})`
    );
  }

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
