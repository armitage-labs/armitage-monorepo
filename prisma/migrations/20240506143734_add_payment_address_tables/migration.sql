-- CreateTable
CREATE TABLE "PaymentAddress" (
    "id" TEXT NOT NULL,
    "chain_id" VARCHAR(255) NOT NULL,
    "team_id" TEXT NOT NULL,
    "wallet_address" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentRecipient" (
    "id" TEXT NOT NULL,
    "wallet_address" VARCHAR(255) NOT NULL,
    "payment_percentage" DOUBLE PRECISION NOT NULL,
    "payment_address_id" TEXT NOT NULL,

    CONSTRAINT "PaymentRecipient_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PaymentAddress_team_id_key" ON "PaymentAddress"("team_id");

-- AddForeignKey
ALTER TABLE "PaymentAddress" ADD CONSTRAINT "PaymentAddress_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentRecipient" ADD CONSTRAINT "PaymentRecipient_payment_address_id_fkey" FOREIGN KEY ("payment_address_id") REFERENCES "PaymentAddress"("id") ON DELETE CASCADE ON UPDATE CASCADE;
