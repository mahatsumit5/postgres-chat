/*
  Warnings:

  - You are about to drop the column `fromId` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `toId` on the `Chat` table. All the data in the column will be lost.
  - Added the required column `fromId` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_fromId_fkey";

-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_toId_fkey";

-- DropIndex
DROP INDEX "Chat_fromId_toId_idx";

-- DropIndex
DROP INDEX "Chat_fromId_toId_key";

-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "fromId",
DROP COLUMN "toId";

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "fromId" TEXT NOT NULL,
ADD COLUMN     "toId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_toId_fkey" FOREIGN KEY ("toId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
