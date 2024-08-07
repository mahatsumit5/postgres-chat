-- CreateTable
CREATE TABLE "CommentReply" (
    "replyId" TEXT NOT NULL,

    CONSTRAINT "CommentReply_pkey" PRIMARY KEY ("replyId")
);

-- AddForeignKey
ALTER TABLE "CommentReply" ADD CONSTRAINT "CommentReply_replyId_fkey" FOREIGN KEY ("replyId") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
