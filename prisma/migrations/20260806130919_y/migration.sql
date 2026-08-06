/*
  Warnings:

  - Added the required column `rentelRequestId` to the `review` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "review" ADD COLUMN     "rentelRequestId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_rentelRequestId_fkey" FOREIGN KEY ("rentelRequestId") REFERENCES "rental_request"("id") ON DELETE CASCADE ON UPDATE CASCADE;
