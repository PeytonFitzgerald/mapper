/*
  Warnings:

  - Added the required column `fibs` to the `USEcon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `USEcon` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "USEcon" ADD COLUMN     "fibs" TEXT NOT NULL,
ADD COLUMN     "year" INTEGER NOT NULL;
