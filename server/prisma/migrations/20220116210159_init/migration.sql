-- CreateTable
CREATE TABLE `Wallet` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `index` INTEGER NOT NULL,
    `leaf` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `totalFees` DOUBLE NOT NULL,
    `failFees` DOUBLE NOT NULL,
    `totalGas` DOUBLE NOT NULL,
    `avgGwei` DOUBLE NOT NULL,
    `totalDonated` DOUBLE NOT NULL,
    `totalTxs` INTEGER NOT NULL,
    `failTxs` INTEGER NOT NULL,
    `ahmet` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Proof` (
    `proofId` INTEGER NOT NULL AUTO_INCREMENT,
    `proofAddress` VARCHAR(191) NOT NULL,
    `proofWalletId` INTEGER NULL,

    PRIMARY KEY (`proofId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Proof` ADD CONSTRAINT `Proof_proofWalletId_fkey` FOREIGN KEY (`proofWalletId`) REFERENCES `Wallet`(`ID`) ON DELETE SET NULL ON UPDATE CASCADE;
