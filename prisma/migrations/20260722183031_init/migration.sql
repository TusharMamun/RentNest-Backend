/*
  Warnings:

  - The `isAvailable` column on the `Property` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `isAvailable` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Property" DROP COLUMN "isAvailable",
ADD COLUMN     "isAvailable" "AvailabilityStatus" NOT NULL DEFAULT 'AVAILABLE';

-- AlterTable
ALTER TABLE "user" DROP COLUMN "isAvailable",
ADD COLUMN     "isAvailable" "ActiveStatus" NOT NULL DEFAULT 'ACTIVE';
