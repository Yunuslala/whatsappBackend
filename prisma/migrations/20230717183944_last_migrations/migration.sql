/*
  Warnings:

  - Changed the type of `textId` on the `conversations` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "conversations" DROP COLUMN "textId",
ADD COLUMN     "textId" INTEGER NOT NULL;
