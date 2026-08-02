/*
  Warnings:

  - A unique constraint covering the columns `[tenantId]` on the table `subscription` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "subscription_tenantId_key" ON "subscription"("tenantId");
