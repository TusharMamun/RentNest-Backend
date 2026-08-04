/*
  Warnings:

  - A unique constraint covering the columns `[rentRequestid]` on the table `subscription` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "subscription_rentRequestid_key" ON "subscription"("rentRequestid");
