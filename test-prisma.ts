import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.lead.createMany({
      data: [
        {
          phone: "9810005282",
          category: "healthcare",
          name: "Rajeev Sood",
          createdBy: "05001bc8-4763-4ef3-a2d6-707fb8b599f1",
          assignedTo: "05001bc8-4763-4ef3-a2d6-707fb8b599f1"
        }
      ],
      skipDuplicates: true
    });
    console.log("Success");
  } catch (e: any) {
    console.error(e.message);
  } finally {
    await prisma.$disconnect();
  }
}
main();
