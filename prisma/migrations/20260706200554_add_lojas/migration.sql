-- CreateTable
CREATE TABLE "lojas" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cidadeEstado" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "horario" TEXT NOT NULL,
    "mapUrl" TEXT,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "ativa" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lojas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loja_fotos" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "r2Key" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "lojaId" TEXT NOT NULL,

    CONSTRAINT "loja_fotos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "loja_fotos" ADD CONSTRAINT "loja_fotos_lojaId_fkey" FOREIGN KEY ("lojaId") REFERENCES "lojas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
