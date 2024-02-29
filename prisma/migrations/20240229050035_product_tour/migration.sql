/*
  Warnings:

  - You are about to drop the column `user_id` on the `GithubRepo` table. All the data in the column will be lost.
  - You are about to drop the column `contribution_id` on the `UserScore` table. All the data in the column will be lost.
  - You are about to alter the column `score` on the `UserScore` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `VarChar(255)`.
  - You are about to drop the `Contribution` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[team_id,full_name]` on the table `GithubRepo` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `team_id` to the `GithubRepo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contribution_calculation_id` to the `UserScore` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Contribution" DROP CONSTRAINT "Contribution_user_id_fkey";

-- DropForeignKey
ALTER TABLE "GithubRepo" DROP CONSTRAINT "GithubRepo_user_id_fkey";

-- DropForeignKey
ALTER TABLE "UserScore" DROP CONSTRAINT "UserScore_contribution_id_fkey";

-- DropIndex
DROP INDEX "GithubRepo_full_name_key";

-- AlterTable
ALTER TABLE "GithubRepo" DROP COLUMN "user_id",
ADD COLUMN     "team_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "UserScore" DROP COLUMN "contribution_id",
ADD COLUMN     "contribution_calculation_id" TEXT NOT NULL,
ALTER COLUMN "score" SET DATA TYPE VARCHAR(255);

-- DropTable
DROP TABLE "Contribution";

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
CREATE TABLE "ProductTourView" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "ProductTourView_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductTourView_user_id_key" ON "ProductTourView"("user_id");

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
ALTER TABLE "ProductTourView" ADD CONSTRAINT "ProductTourView_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserScore" ADD CONSTRAINT "UserScore_contribution_calculation_id_fkey" FOREIGN KEY ("contribution_calculation_id") REFERENCES "ContributionCalculation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
