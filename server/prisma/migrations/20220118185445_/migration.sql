/*
  Warnings:

  - You are about to drop the column `proofWalletId` on the `Proof` table. All the data in the column will be lost.
  - You are about to alter the column `address` on the `Wallet` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(42)`.
  - A unique constraint covering the columns `[address]` on the table `Wallet` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `Proof` DROP FOREIGN KEY `Proof_proofWalletId_fkey`;

-- AlterTable
ALTER TABLE `Proof` DROP COLUMN `proofWalletId`,
    ADD COLUMN `proofWalletAddress` INTEGER NULL;

-- AlterTable
ALTER TABLE `Wallet` MODIFY `address` VARCHAR(42) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Wallet_address_key` ON `Wallet`(`address`);

-- AddForeignKey
ALTER TABLE `Proof` ADD CONSTRAINT `Proof_proofWalletAddress_fkey` FOREIGN KEY (`proofWalletAddress`) REFERENCES `Wallet`(`ID`) ON DELETE SET NULL ON UPDATE CASCADE;
