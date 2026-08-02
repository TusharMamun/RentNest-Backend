/*
  Warnings:

  - You are about to drop the column `name` on the `catagory` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[catagoryName]` on the table `catagory` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `catagoryName` to the `catagory` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "catagory_name_key";

-- AlterTable
ALTER TABLE "catagory" DROP COLUMN "name",
ADD COLUMN     "catagoryName" VARCHAR(100) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "catagory_catagoryName_key" ON "catagory"("catagoryName");
