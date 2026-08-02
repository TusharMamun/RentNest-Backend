/*
  Warnings:

  - You are about to drop the column `propertyId` on the `catagory` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "catagory" DROP CONSTRAINT "catagory_propertyId_fkey";

-- DropIndex
DROP INDEX "catagory_propertyId_key";

-- AlterTable
ALTER TABLE "catagory" DROP COLUMN "propertyId";

-- AlterTable
ALTER TABLE "property" ADD COLUMN     "categoryId" TEXT;

-- AddForeignKey
ALTER TABLE "property" ADD CONSTRAINT "property_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "catagory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
