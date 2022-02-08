/*
  Warnings:

  - You are about to alter the column `amount` on the `Wallet` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.
  - You are about to alter the column `totalFees` on the `Wallet` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.
  - You are about to alter the column `failFees` on the `Wallet` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.
  - You are about to alter the column `totalGas` on the `Wallet` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.
  - You are about to alter the column `avgGwei` on the `Wallet` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.
  - You are about to alter the column `totalDonated` on the `Wallet` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `Wallet` MODIFY `amount` VARCHAR(191) NOT NULL,
    MODIFY `totalFees` VARCHAR(191) NOT NULL,
    MODIFY `failFees` VARCHAR(191) NOT NULL,
    MODIFY `totalGas` VARCHAR(191) NOT NULL,
    MODIFY `avgGwei` VARCHAR(191) NOT NULL,
    MODIFY `totalDonated` VARCHAR(191) NOT NULL;
