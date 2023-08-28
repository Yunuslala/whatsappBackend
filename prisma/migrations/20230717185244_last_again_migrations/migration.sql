/*
  Warnings:

  - You are about to drop the `conversations` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `conversations` to the `relations` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "conversations" DROP CONSTRAINT "conversations_conversationsID_fkey";

-- AlterTable
ALTER TABLE "relations" ADD COLUMN     "conversations" JSONB NOT NULL;

-- DropTable
DROP TABLE "conversations";
