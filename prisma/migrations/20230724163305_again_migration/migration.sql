/*
  Warnings:

  - The `conversations` column on the `relations` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "relations" DROP COLUMN "conversations",
ADD COLUMN     "conversations" JSONB[];
