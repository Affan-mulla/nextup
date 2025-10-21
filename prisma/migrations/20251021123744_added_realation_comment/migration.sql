-- AddForeignKey
ALTER TABLE "public"."Comments" ADD CONSTRAINT "Comments_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "public"."Comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
