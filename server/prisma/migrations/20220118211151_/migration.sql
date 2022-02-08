/*
  Warnings:

  - You are about to alter the column `leaf` on the `Wallet` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `BigInt`.
  - You are about to alter the column `amount` on the `Wallet` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Double`.
  - You are about to alter the column `totalFees` on the `Wallet` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Double`.
  - You are about to alter the column `failFees` on the `Wallet` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Double`.
  - You are about to alter the column `totalGas` on the `Wallet` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Double`.
  - You are about to alter the column `avgGwei` on the `Wallet` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Double`.
  - You are about to alter the column `totalDonated` on the `Wallet` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Double`.

*/
-- AlterTable
ALTER TABLE `Wallet` MODIFY `leaf` BIGINT NOT NULL,
    MODIFY `amount` DOUBLE NOT NULL,
    MODIFY `totalFees` DOUBLE NOT NULL,
    MODIFY `failFees` DOUBLE NOT NULL,
    MODIFY `totalGas` DOUBLE NOT NULL,
    MODIFY `avgGwei` DOUBLE NOT NULL,
    MODIFY `totalDonated` DOUBLE NOT NULL;
