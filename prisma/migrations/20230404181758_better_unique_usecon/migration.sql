/*
  Warnings:

  - A unique constraint covering the columns `[year_name]` on the table `USEcon` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `year_name` to the `USEcon` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "USEcon_name_key";

-- AlterTable
ALTER TABLE "USEcon" ADD COLUMN     "year_name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "USEcon_year_name_key" ON "USEcon"("year_name");
