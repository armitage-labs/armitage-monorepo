-- DropForeignKey
ALTER TABLE "ContributionCalculation" DROP CONSTRAINT "ContributionCalculation_team_id_fkey";

-- DropForeignKey
ALTER TABLE "ContributionRequest" DROP CONSTRAINT "ContributionRequest_team_id_fkey";

-- DropForeignKey
ALTER TABLE "GithubRepo" DROP CONSTRAINT "GithubRepo_team_id_fkey";

-- DropForeignKey
ALTER TABLE "ProductTourView" DROP CONSTRAINT "ProductTourView_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Team" DROP CONSTRAINT "Team_owner_user_id_fkey";

-- DropForeignKey
ALTER TABLE "UserScore" DROP CONSTRAINT "UserScore_contribution_calculation_id_fkey";

-- AddForeignKey
ALTER TABLE "GithubRepo" ADD CONSTRAINT "GithubRepo_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContributionCalculation" ADD CONSTRAINT "ContributionCalculation_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContributionRequest" ADD CONSTRAINT "ContributionRequest_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductTourView" ADD CONSTRAINT "ProductTourView_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserScore" ADD CONSTRAINT "UserScore_contribution_calculation_id_fkey" FOREIGN KEY ("contribution_calculation_id") REFERENCES "ContributionCalculation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
