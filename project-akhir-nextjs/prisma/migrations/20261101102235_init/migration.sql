/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'user',
ADD COLUMN     "username" TEXT NOT NULL,
ALTER COLUMN "email" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Pesanan" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "varian" TEXT NOT NULL,
    "jumlah" INTEGER NOT NULL,
    "harga" INTEGER NOT NULL,
    "subtotal" INTEGER NOT NULL,
    "catatan" TEXT NOT NULL DEFAULT '',
    "alamat" TEXT NOT NULL,
    "jarak" DOUBLE PRECISION NOT NULL,
    "ongkir" INTEGER NOT NULL,
    "metodeBayar" TEXT NOT NULL,
    "buktiTransfer" TEXT,
    "totalBayar" INTEGER NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'Diproses',

    CONSTRAINT "Pesanan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
