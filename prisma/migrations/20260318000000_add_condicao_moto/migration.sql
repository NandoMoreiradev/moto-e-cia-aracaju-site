-- CreateEnum
CREATE TYPE "CondicaoMoto" AS ENUM ('NOVA', 'SEMINOVA');

-- AlterTable: adicionar campo condicao na tabela motos
ALTER TABLE "motos" ADD COLUMN "condicao" "CondicaoMoto" NOT NULL DEFAULT 'NOVA';

-- AlterEnum: remover SEMINOVA de MarcaMoto
-- Nota: motos com marca=SEMINOVA precisam ser migradas para a marca correta
-- antes de remover o valor do enum. Execute o UPDATE abaixo se necessário:
-- UPDATE "motos" SET "marca" = 'OUTRO' WHERE "marca" = 'SEMINOVA';
-- Em seguida remova o valor:
-- ALTER TYPE "MarcaMoto" RENAME TO "MarcaMoto_old";
-- CREATE TYPE "MarcaMoto" AS ENUM ('SUZUKI', 'HAOJUE', 'ZONTES', 'KYMCO', 'OUTRO');
-- ALTER TABLE "motos" ALTER COLUMN "marca" TYPE "MarcaMoto" USING "marca"::text::"MarcaMoto";
-- DROP TYPE "MarcaMoto_old";
