-- DropForeignKey
ALTER TABLE `Proof` DROP FOREIGN KEY `Proof_proofWalletAddress_fkey`;

-- AlterTable
ALTER TABLE `Proof` MODIFY `proofWalletAddress` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Proof` ADD CONSTRAINT `Proof_proofWalletAddress_fkey` FOREIGN KEY (`proofWalletAddress`) REFERENCES `Wallet`(`address`) ON DELETE SET NULL ON UPDATE CASCADE;
