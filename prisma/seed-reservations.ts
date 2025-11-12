import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding sample reservations...");

  const sampleReservations = [
    // Today - some reservations
    {
      customerName: "Ragnar",
      customerPhone: "+1234567890",
      numberOfGuests: 2,
      day: "today",
      timeSlot: "17:00",
      duration: 120,
      specialRequests: null,
      tableId: 1,
    },
    {
      customerName: "Joshua",
      customerPhone: "+1234567891",
      numberOfGuests: 4,
      day: "today",
      timeSlot: "18:00",
      duration: 120,
      specialRequests: "will only eat pizzas with pineapples on them",
      tableId: 5,
    },
    {
      customerName: "Mat",
      customerPhone: "+1234567892",
      numberOfGuests: 6,
      day: "today",
      timeSlot: "19:00",
      duration: 120,
      specialRequests: null,
      tableId: 11,
    },
    {
      customerName: "Claire",
      customerPhone: "+1234567893",
      numberOfGuests: 4,
      day: "today",
      timeSlot: "19:30",
      duration: 120,
      specialRequests: null,
      tableId: 7,
    },
    // Tomorrow - fewer reservations
    {
      customerName: "Kelechi",
      customerPhone: "+1234567894",
      numberOfGuests: 2,
      day: "tomorrow",
      timeSlot: "18:00",
      duration: 120,
      specialRequests: null,
      tableId: 2,
    },
    {
      customerName: "Yangqing",
      customerPhone: "+1234567895",
      numberOfGuests: 4,
      day: "tomorrow",
      timeSlot: "20:00",
      duration: 120,
      specialRequests: null,
      tableId: 8,
    },
  ];

  for (const reservation of sampleReservations) {
    await prisma.reservation.create({
      data: reservation,
    });
    console.log(
      `Created reservation for ${reservation.customerName} on ${reservation.day} at ${reservation.timeSlot}`
    );
  }

  console.log("Sample reservations seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding reservations:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
