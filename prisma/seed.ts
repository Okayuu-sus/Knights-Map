import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import { env } from "prisma/config";

dotenv.config({path: ".env.local"});

const prisma = new PrismaClient();

async function main() {
  const buildings = [
    {
      code: "LIB",
      name: "John C. Hitt Library",
      description: "Main university library",
      latitude: 28.6006,
      longitude: -81.2019,
    },
    {
      code: "SU",
      name: "Student Union",
      description: "Student services and dining",
      latitude: 28.6018,
      longitude: -81.2006,
    },
    {
      code: "ENG1",
      name: "Engineering Building I",
      description: "Engineering classrooms and facilities",
      latitude: 28.6011,
      longitude: -81.1986,
    },
  ];

  for (const building of buildings) {
    await prisma.building.upsert({
      where: {
        code: building.code,
      },
      update: building,
      create: building,
    });
  }

  console.log("Buildings seeded successfully!");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });