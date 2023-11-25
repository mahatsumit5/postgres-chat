/*
  Warnings:

  - The primary key for the `FriendRequests` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `FriendRequests` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FriendRequests" DROP CONSTRAINT "FriendRequests_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "FriendRequests_pkey" PRIMARY KEY ("fromId", "toId");
