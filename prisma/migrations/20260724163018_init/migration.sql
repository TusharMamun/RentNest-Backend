/*
  Warnings:

  - You are about to drop the column `categoryId` on the `property` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "property" DROP CONSTRAINT "property_categoryId_fkey";

-- AlterTable
ALTER TABLE "property" DROP COLUMN "categoryId";

-- CreateTable
CREATE TABLE "_CategoryToProperty" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CategoryToProperty_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CategoryToProperty_B_index" ON "_CategoryToProperty"("B");

-- AddForeignKey
ALTER TABLE "_CategoryToProperty" ADD CONSTRAINT "_CategoryToProperty_A_fkey" FOREIGN KEY ("A") REFERENCES "catagory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToProperty" ADD CONSTRAINT "_CategoryToProperty_B_fkey" FOREIGN KEY ("B") REFERENCES "property"("id") ON DELETE CASCADE ON UPDATE CASCADE;
