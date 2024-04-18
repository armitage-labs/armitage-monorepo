-- DropForeignKey
ALTER TABLE "Attestation" DROP CONSTRAINT "Attestation_contribution_calculation_id_fkey";

-- AddForeignKey
ALTER TABLE "Attestation" ADD CONSTRAINT "Attestation_contribution_calculation_id_fkey" FOREIGN KEY ("contribution_calculation_id") REFERENCES "ContributionCalculation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
