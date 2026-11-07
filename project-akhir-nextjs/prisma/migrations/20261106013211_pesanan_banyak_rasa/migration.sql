-- CreateTable
CREATE TABLE "ItemPesanan" (
    "id" SERIAL NOT NULL,
    "pesananId" TEXT NOT NULL,
    "varian" TEXT NOT NULL,
    "jumlah" INTEGER NOT NULL,
    "harga" INTEGER NOT NULL,
    "subtotal" INTEGER NOT NULL,

    CONSTRAINT "ItemPesanan_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ItemPesanan" ADD CONSTRAINT "ItemPesanan_pesananId_fkey" FOREIGN KEY ("pesananId") REFERENCES "Pesanan"("id") ON DELETE CASCADE ON UPDATE CASCADE;
