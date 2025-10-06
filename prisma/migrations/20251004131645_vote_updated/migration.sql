/*
  Warnings:

  - You are about to drop the column `votesCount` on the `Ideas` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Ideas" DROP COLUMN "votesCount",
ADD COLUMN     "downvotes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "upvotes" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "username" DROP DEFAULT;
