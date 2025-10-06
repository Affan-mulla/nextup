/*
  Warnings:

  - You are about to drop the column `downvotes` on the `Ideas` table. All the data in the column will be lost.
  - You are about to drop the column `upvotes` on the `Ideas` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Ideas" DROP COLUMN "downvotes",
DROP COLUMN "upvotes",
ADD COLUMN     "votesCount" INTEGER NOT NULL DEFAULT 0;
