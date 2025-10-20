-- AlterTable
ALTER TABLE "public"."Comments" ADD COLUMN     "votesCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "public"."CommentVotes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "type" "public"."VoteType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommentVotes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CommentVotes_userId_commentId_key" ON "public"."CommentVotes"("userId", "commentId");

-- AddForeignKey
ALTER TABLE "public"."CommentVotes" ADD CONSTRAINT "CommentVotes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CommentVotes" ADD CONSTRAINT "CommentVotes_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "public"."Comments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
