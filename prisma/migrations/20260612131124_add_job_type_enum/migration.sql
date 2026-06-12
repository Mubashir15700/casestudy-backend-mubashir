/*
  Warnings:

  - Changed the type of `type` on the `jobs` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "JobType" AS ENUM ('SEND_RECEIPT_EMAIL', 'PROCESS_PAYMENT_WEBHOOK');

-- AlterTable
ALTER TABLE "jobs" DROP COLUMN "type",
ADD COLUMN     "type" "JobType" NOT NULL;
