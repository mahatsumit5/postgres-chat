/*
  Warnings:

  - Added the required column `toUser` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "toUser" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_toUser_fkey" FOREIGN KEY ("toUser") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
