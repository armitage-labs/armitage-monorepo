/*
  Warnings:

  - Added the required column `contribution_calculation_id` to the `Attestation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `team_id` to the `Attestation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Attestation" ADD COLUMN     "contribution_calculation_id" TEXT NOT NULL,
ADD COLUMN     "team_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Attestation" ADD CONSTRAINT "Attestation_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attestation" ADD CONSTRAINT "Attestation_contribution_calculation_id_fkey" FOREIGN KEY ("contribution_calculation_id") REFERENCES "ContributionCalculation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
