-- AlterTable
ALTER TABLE "User" ADD COLUMN     "refreshJWT" TEXT NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE "Session" (
    "sessionID" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "timeStamps" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("sessionID")
);

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
