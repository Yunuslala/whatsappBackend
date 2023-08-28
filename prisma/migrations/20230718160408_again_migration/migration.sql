-- DropForeignKey
ALTER TABLE "relations" DROP CONSTRAINT "relations_reciverId_fkey";

-- AddForeignKey
ALTER TABLE "relations" ADD CONSTRAINT "relations_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
