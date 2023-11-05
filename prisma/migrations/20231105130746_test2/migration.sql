-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_fromUser_fkey";

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_fromUser_fkey" FOREIGN KEY ("fromUser") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
