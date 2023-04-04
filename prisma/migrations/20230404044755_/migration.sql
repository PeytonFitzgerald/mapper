/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `USEcon` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `USEcon` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "USEcon" ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "USEcon_name_key" ON "USEcon"("name");
