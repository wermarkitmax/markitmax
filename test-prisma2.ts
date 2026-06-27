import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const snakeToCamel = (obj: any): any => {
  if (Array.isArray(obj)) return obj.map(snakeToCamel);
  if (obj !== null && typeof obj === "object") {
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
      acc[camelKey] = snakeToCamel(obj[key]);
      return acc;
    }, {} as any);
  }
  return obj;
};

async function main() {
  try {
    const raw = {
      phone: "9810005282",
      category: "healthcare",
      name: "Rajeev Sood",
      created_by: "05001bc8-4763-4ef3-a2d6-707fb8b599f1",
      assigned_to: "05001bc8-4763-4ef3-a2d6-707fb8b599f1"
    };
    
    const camelData = snakeToCamel(raw);
    console.log("Camel Data:", camelData);

    await prisma.lead.createMany({
      data: [camelData],
      skipDuplicates: true
    });
    console.log("Success");
  } catch (e: any) {
    console.error("ERROR:");
    console.error(e.message);
  } finally {
    await prisma.$disconnect();
  }
}
main();
