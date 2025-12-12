import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.college.createMany({
    data: [
      {
        name: "Government College A",
        collegeId: "CLG001",
        sheetId: "12EdF_jJ1F8dMQ465R-1votjqrkVkHUWmIi6AOryOKcQ"
      },
      {
        name: "Government College B",
        collegeId: "CLG002",
        sheetId: "1socdG4XO71HEfRkTsu0GCpGZAbGiz_UtxIsrjOz4ovA"
      }
    ],
    skipDuplicates: true
  });

  console.log("✅ Colleges seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
