/*
  Warnings:

  - You are about to drop the column `user_id` on the `GithubRepo` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[team_id,full_name]` on the table `GithubRepo` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `team_id` to the `GithubRepo` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "GithubRepo" DROP CONSTRAINT "GithubRepo_user_id_fkey";

-- DropIndex
DROP INDEX "GithubRepo_full_name_key";

-- AlterTable
ALTER TABLE "GithubRepo" DROP COLUMN "user_id",
ADD COLUMN     "team_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "owner_user_id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContributionCalculation" (
    "id" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContributionCalculation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContributionRequest" (
    "id" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "access_token" TEXT NOT NULL,

    CONSTRAINT "ContributionRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CalculationSemaphore" (
    "id" TEXT NOT NULL,
    "available" BOOLEAN NOT NULL,

    CONSTRAINT "CalculationSemaphore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserScore" (
    "id" TEXT NOT NULL,
    "contribution_calculation_id" TEXT NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "user_type" VARCHAR(255) NOT NULL,
    "score" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserScore_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GithubRepo_team_id_full_name_key" ON "GithubRepo"("team_id", "full_name");

-- AddForeignKey
ALTER TABLE "GithubRepo" ADD CONSTRAINT "GithubRepo_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContributionCalculation" ADD CONSTRAINT "ContributionCalculation_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContributionRequest" ADD CONSTRAINT "ContributionRequest_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserScore" ADD CONSTRAINT "UserScore_contribution_calculation_id_fkey" FOREIGN KEY ("contribution_calculation_id") REFERENCES "ContributionCalculation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
