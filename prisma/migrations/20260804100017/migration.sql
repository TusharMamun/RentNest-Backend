-- DropForeignKey
ALTER TABLE "subscription" DROP CONSTRAINT "subscription_rentRequestid_fkey";

-- DropIndex
DROP INDEX "subscription_stripeCustomerId_key";

-- DropIndex
DROP INDEX "subscription_tenantId_key";

-- AlterTable
ALTER TABLE "subscription" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "stripeCustomerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_rentRequestid_fkey" FOREIGN KEY ("rentRequestid") REFERENCES "rental_request"("id") ON DELETE CASCADE ON UPDATE CASCADE;
