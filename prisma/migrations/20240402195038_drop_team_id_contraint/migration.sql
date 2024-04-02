-- CreateTable
CREATE TABLE "TeamWeightConfig" (
    "id" TEXT NOT NULL,
    "type" VARCHAR(255) NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "team_id" TEXT NOT NULL,

    CONSTRAINT "TeamWeightConfig_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TeamWeightConfig" ADD CONSTRAINT "TeamWeightConfig_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;
