/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `USState` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "USEcon" (
    "id" TEXT NOT NULL,
    "real_gdp" DOUBLE PRECISION,
    "real_personal" DOUBLE PRECISION,
    "real_pce" DOUBLE PRECISION,
    "current_gdp" DOUBLE PRECISION,
    "personal_income" DOUBLE PRECISION,
    "disposable_income" DOUBLE PRECISION,
    "personal_consumption" DOUBLE PRECISION,
    "real_per_capita_personal_income" DOUBLE PRECISION,
    "real_per_capita_pce" DOUBLE PRECISION,
    "current_per_capita_personal_income" DOUBLE PRECISION,
    "current_per_capita_disposable_income" DOUBLE PRECISION,
    "rpp" DOUBLE PRECISION,
    "implicit_regional_price_deflator" DOUBLE PRECISION,
    "employment" DOUBLE PRECISION,
    "uSStateId" INTEGER NOT NULL,

    CONSTRAINT "USEcon_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "USState_name_key" ON "USState"("name");

-- AddForeignKey
ALTER TABLE "USEcon" ADD CONSTRAINT "USEcon_uSStateId_fkey" FOREIGN KEY ("uSStateId") REFERENCES "USState"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
