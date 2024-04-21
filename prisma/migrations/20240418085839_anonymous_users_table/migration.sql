-- CreateTable
CREATE TABLE "AnonymousUsers" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnonymousUsers_pkey" PRIMARY KEY ("id")
);
