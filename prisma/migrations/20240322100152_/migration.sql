/*
  Warnings:

  - You are about to drop the column `authorId` on the `Task` table. All the data in the column will be lost.
  - Added the required column `authorEmail` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Task` DROP FOREIGN KEY `Task_authorId_fkey`;

-- AlterTable
ALTER TABLE `Task` DROP COLUMN `authorId`,
    ADD COLUMN `authorEmail` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_authorEmail_fkey` FOREIGN KEY (`authorEmail`) REFERENCES `User`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;
