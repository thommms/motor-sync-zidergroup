-- CreateTable
CREATE TABLE "MileageHistory" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "mileage" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MileageHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MileageHistory_vehicleId_idx" ON "MileageHistory"("vehicleId");

-- AddForeignKey
ALTER TABLE "MileageHistory" ADD CONSTRAINT "MileageHistory_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
