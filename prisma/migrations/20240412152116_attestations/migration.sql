-- CreateTable
CREATE TABLE "Attestation" (
    "id" TEXT NOT NULL,
    "chain_id" VARCHAR(255) NOT NULL,
    "attestation_uuid" VARCHAR(255) NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Attestation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Attestation" ADD CONSTRAINT "Attestation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
