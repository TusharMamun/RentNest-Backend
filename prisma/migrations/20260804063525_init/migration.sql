/*
  Warnings:

  - Added the required column `totalPrice` to the `rental_request` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "rental_request" ADD COLUMN     "totalPrice" DOUBLE PRECISION NOT NULL;
