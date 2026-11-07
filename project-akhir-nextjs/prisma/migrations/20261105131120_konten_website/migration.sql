-- CreateTable
CREATE TABLE "Sesi" (
    "token" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sesi_pkey" PRIMARY KEY ("token")
);

-- CreateTable
CREATE TABLE "Konten" (
    "kunci" TEXT NOT NULL,
    "nilai" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Konten_pkey" PRIMARY KEY ("kunci")
);

-- CreateTable
CREATE TABLE "ItemGaleri" (
    "id" SERIAL NOT NULL,
    "kode" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "gambar" TEXT NOT NULL,
    "lebar" INTEGER NOT NULL,
    "tinggi" INTEGER NOT NULL,
    "urutan" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ItemGaleri_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gambar" (
    "id" TEXT NOT NULL,
    "mime" TEXT NOT NULL,
    "data" BYTEA NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Gambar_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Sesi" ADD CONSTRAINT "Sesi_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
