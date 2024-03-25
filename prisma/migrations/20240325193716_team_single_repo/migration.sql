/*
  Warnings:

  - Added the required column `email` to the `ContributionRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ContributionCalculation" ADD COLUMN     "score_interval" JSONB;

-- AlterTable
ALTER TABLE "ContributionRequest" ADD COLUMN     "email" VARCHAR(1000) NOT NULL;

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "singleRepository" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "UserScore" ADD COLUMN     "score_interval" JSONB;
