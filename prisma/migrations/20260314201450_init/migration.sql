-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'EDITOR');

-- CreateEnum
CREATE TYPE "MarcaMoto" AS ENUM ('SUZUKI', 'HAOJUE', 'ZONTES', 'KYMCO', 'OUTRO', 'SEMINOVA');

-- CreateEnum
CREATE TYPE "TipoMoto" AS ENUM ('SPORT', 'NAKED', 'ADVENTURE', 'SCOOTER', 'TRAIL');

-- CreateEnum
CREATE TYPE "StatusMoto" AS ENUM ('DISPONIVEL', 'VENDIDA', 'RESERVADA', 'ALUGUEL');

-- CreateEnum
CREATE TYPE "Combustivel" AS ENUM ('GASOLINA', 'ETANOL', 'FLEX', 'ELETRICO');

-- CreateEnum
CREATE TYPE "Transmissao" AS ENUM ('MANUAL', 'AUTOMATICA', 'SEMI_AUTOMATICA');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'EDITOR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "motos" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "marca" "MarcaMoto" NOT NULL,
    "tipo" "TipoMoto" NOT NULL,
    "preco" DECIMAL(10,2),
    "precoFormatado" TEXT,
    "descricao" TEXT NOT NULL,
    "specs" JSONB NOT NULL DEFAULT '{}',
    "destaque" BOOLEAN NOT NULL DEFAULT false,
    "status" "StatusMoto" NOT NULL DEFAULT 'DISPONIVEL',
    "metaProductId" TEXT,
    "ano" INTEGER,
    "km" INTEGER,
    "cor" TEXT,
    "vin" TEXT,
    "combustivel" "Combustivel" NOT NULL DEFAULT 'GASOLINA',
    "transmissao" "Transmissao" NOT NULL DEFAULT 'MANUAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "motos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "moto_fotos" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "r2Key" TEXT NOT NULL,
    "principal" BOOLEAN NOT NULL DEFAULT false,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "motoId" TEXT NOT NULL,

    CONSTRAINT "moto_fotos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_posts" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "resumo" TEXT NOT NULL,
    "conteudo" JSONB NOT NULL DEFAULT '{}',
    "coverUrl" TEXT,
    "coverR2Key" TEXT,
    "tags" TEXT[],
    "publicado" BOOLEAN NOT NULL DEFAULT false,
    "publicadoEm" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blog_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leads" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "whatsapp" TEXT,
    "mensagem" TEXT NOT NULL,
    "motoInteresse" TEXT,
    "lido" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_configs" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_configs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "motos_slug_key" ON "motos"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "blog_posts_slug_key" ON "blog_posts"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "site_configs_key_key" ON "site_configs"("key");

-- AddForeignKey
ALTER TABLE "moto_fotos" ADD CONSTRAINT "moto_fotos_motoId_fkey" FOREIGN KEY ("motoId") REFERENCES "motos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
