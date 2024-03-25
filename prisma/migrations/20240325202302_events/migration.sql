/*
  Warnings:

  - Added the required column `email` to the `ContributionRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ContributionCalculation" ADD COLUMN     "score_interval" JSONB;

-- AlterTable
ALTER TABLE "ContributionRequest" ADD COLUMN     "email" VARCHAR(1000) NOT NULL;

-- AlterTable
ALTER TABLE "UserScore" ADD COLUMN     "score_interval" JSONB;

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "event_name" VARCHAR(1000) NOT NULL,
    "event_data" JSONB,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);
