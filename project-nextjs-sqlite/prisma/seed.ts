// Mengisi database dengan akun admin default. Jalankan: npx prisma db seed
// Memakai upsert (bukan deleteMany) supaya akun hasil signup tidak ikut terhapus
// dan seed aman dijalankan berulang kali.
import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: "admin123",
      role: "admin",
      nama: "Admin Bika Ambon",
    },
  });
  console.log("Seeding selesai: akun admin ditambahkan.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
