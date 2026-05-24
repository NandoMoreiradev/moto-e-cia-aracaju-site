/*
  Warnings:

  - The values [SEMINOVA] on the enum `MarcaMoto` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MarcaMoto_new" AS ENUM ('SUZUKI', 'HAOJUE', 'ZONTES', 'KYMCO', 'OUTRO');
ALTER TABLE "motos" ALTER COLUMN "marca" TYPE "MarcaMoto_new" USING ("marca"::text::"MarcaMoto_new");
ALTER TYPE "MarcaMoto" RENAME TO "MarcaMoto_old";
ALTER TYPE "MarcaMoto_new" RENAME TO "MarcaMoto";
DROP TYPE "public"."MarcaMoto_old";
COMMIT;
