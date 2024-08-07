/*
  Warnings:

  - The primary key for the `CommentLikes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `CommentLikes` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "CommentLikes_commentId_userId_key";

-- AlterTable
ALTER TABLE "CommentLikes" DROP CONSTRAINT "CommentLikes_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "CommentLikes_pkey" PRIMARY KEY ("commentId", "userId");
