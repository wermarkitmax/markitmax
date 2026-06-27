import { bulkCreateRecordsFn } from "./src/lib/db";

async function main() {
  try {
    const res = await bulkCreateRecordsFn({
      data: {
        table: "leads",
        values: [
          {
            phone: "9810005282",
            category: "healthcare",
            name: "Rajeev Sood",
            created_by: "05001bc8-4763-4ef3-a2d6-707fb8b599f1",
            assigned_to: "05001bc8-4763-4ef3-a2d6-707fb8b599f1"
          }
        ]
      }
    });
    console.log("Success", res);
  } catch (e: any) {
    console.error("ERROR CAUGHT:");
    console.error(e.message);
  }
}
main();
