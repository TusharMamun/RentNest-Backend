/*
  Warnings:

  - You are about to drop the `_CategoryToProperty` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CategoryToProperty" DROP CONSTRAINT "_CategoryToProperty_A_fkey";

-- DropForeignKey
ALTER TABLE "_CategoryToProperty" DROP CONSTRAINT "_CategoryToProperty_B_fkey";

-- AlterTable
ALTER TABLE "property" ADD COLUMN     "categoryId" TEXT;

-- DropTable
DROP TABLE "_CategoryToProperty";

-- AddForeignKey
ALTER TABLE "property" ADD CONSTRAINT "property_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "catagory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
