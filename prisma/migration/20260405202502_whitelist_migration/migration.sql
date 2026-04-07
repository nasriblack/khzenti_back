-- CreateTable
CREATE TABLE "whitelist" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "whitelist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "whitelist_email_key" ON "whitelist"("email");

-- CreateIndex
CREATE INDEX "whitelist_ipAddress_idx" ON "whitelist"("ipAddress");

-- CreateIndex
CREATE INDEX "whitelist_email_idx" ON "whitelist"("email");
