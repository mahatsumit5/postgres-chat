/*
  Warnings:

  - The `status` column on the `FriendRequests` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACCEPTED', 'REJECTED', 'PENDING');

-- AlterTable
ALTER TABLE "FriendRequests" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'PENDING';
