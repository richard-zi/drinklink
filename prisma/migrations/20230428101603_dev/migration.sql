/*
  Warnings:

  - You are about to drop the column `date` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `booking` table. All the data in the column will be lost.
  - Added the required column `dateTime` to the `booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `booking` DROP COLUMN `date`,
    DROP COLUMN `time`,
    ADD COLUMN `dateTime` DATETIME(3) NOT NULL;
