/*
  Warnings:

  - You are about to drop the column `categoryId` on the `property` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[propertyId]` on the table `catagory` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `propertyId` to the `catagory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "property" DROP CONSTRAINT "property_categoryId_fkey";

-- AlterTable
ALTER TABLE "catagory" ADD COLUMN     "propertyId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "property" DROP COLUMN "categoryId";

-- CreateIndex
CREATE UNIQUE INDEX "catagory_propertyId_key" ON "catagory"("propertyId");

-- AddForeignKey
ALTER TABLE "catagory" ADD CONSTRAINT "catagory_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
