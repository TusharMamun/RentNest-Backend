/*
  Warnings:

  - You are about to drop the `Payment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `rentalRequest` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId]` on the table `catagory` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `catagory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `catagory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "rentalRequest" DROP CONSTRAINT "rentalRequest_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "rentalRequest" DROP CONSTRAINT "rentalRequest_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "review" DROP CONSTRAINT "review_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "review" DROP CONSTRAINT "review_tenantId_fkey";

-- AlterTable
ALTER TABLE "catagory" ADD COLUMN     "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Payment";

-- DropTable
DROP TABLE "rentalRequest";

-- CreateIndex
CREATE UNIQUE INDEX "catagory_userId_key" ON "catagory"("userId");

-- AddForeignKey
ALTER TABLE "catagory" ADD CONSTRAINT "catagory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
