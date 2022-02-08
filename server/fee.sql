-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Anamakine: localhost
-- Üretim Zamanı: 08 Şub 2022, 21:56:49
-- Sunucu sürümü: 10.4.21-MariaDB
-- PHP Sürümü: 8.0.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Veritabanı: `fee`
--

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `Proof`
--

CREATE TABLE `Proof` (
  `proofId` int(11) NOT NULL,
  `proofAddress` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `proofWalletAddress` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `Proof`
--

INSERT INTO `Proof` (`proofId`, `proofAddress`, `proofWalletAddress`) VALUES
(9, '25872694723468066951757292560857606934354657502652722934726429998485363903975', '0x389A755154844b4166fB4BeC911Dcb7B765b3B50'),
(13, '4268800815403642931668590965444961048067261344500858670133601262506270532325', '0x389A755154844b4166fB4BeC911Dcb7B765b3B50');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `Wallet`
--

CREATE TABLE `Wallet` (
  `ID` int(11) NOT NULL,
  `index` int(11) NOT NULL,
  `address` varchar(42) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` double NOT NULL,
  `totalFees` double NOT NULL,
  `failFees` double NOT NULL,
  `totalGas` double NOT NULL,
  `avgGwei` double NOT NULL,
  `totalDonated` double NOT NULL,
  `totalTxs` int(11) NOT NULL,
  `failTxs` int(11) NOT NULL,
  `leaf` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `Wallet`
--

INSERT INTO `Wallet` (`ID`, `index`, `address`, `amount`, `totalFees`, `failFees`, `totalGas`, `avgGwei`, `totalDonated`, `totalTxs`, `failTxs`, `leaf`) VALUES
(1, 369595320, '0x389A755154844b4166fB4BeC911Dcb7B765b3B50', 0, 0, 0, 0, 0, 0, 0, 0, '0x681eee2286cfef1ca3ba73caf3347899b26ac12a61db2b5acb50091388083b9an'),
(5, 687040649, '0xfa198959854514d80eadec68533f289f93ab9cc6', 0, 0, 0, 0, 0, 0, 0, 0, '0x98fa2c82e4bfb8da3da99f6741c145376b23e0d1860fc44f9c975e2ec68d753f'),
(11, 709735766, '0xddd88727c2b5f37497232ab5906e9d6edde62072', 96736885545618, 2.03854437e18, 176715000000000, 407708874, 0, 0, 513, 1, '0x6cbe4a692b8c0247a6ef003504c5253ee7fc24632470130076b754b9240bde4f');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tablo döküm verisi `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('175094df-5a47-4e1f-8646-ac7b120a0a38', '2bbb29edfb8a34febe45eca6e6e5107f668623a00405728f7f6c888faf509d27', '2022-01-18 21:12:11.465', '20220118211211_', NULL, NULL, '2022-01-18 21:12:11.437', 1),
('31676f92-9d96-4a0f-9b8f-6dd936478fa8', '4dc8ffd1a820bf9ce3f5c2eb8b6a5fdd055e7822393c15108dda55102b0f369c', '2022-01-18 21:11:57.857', '20220116210159_init', NULL, NULL, '2022-01-18 21:11:57.778', 1),
('5ec494a4-a5c4-40af-9a36-555350292fcc', '05aa4c757c556b844d74520895ce2f6992d9d924843b0446ac1102173d39ff65', '2022-01-18 21:14:43.522', '20220118211443_', NULL, NULL, '2022-01-18 21:14:43.491', 1),
('6e1c9080-aff1-48c8-88b7-49577629721d', 'dd5bebc9a5e0a552775a4f4ffbaaebf614100c0c412995f6d1faa4070ec12668', '2022-01-18 21:11:58.067', '20220118185445_', NULL, NULL, '2022-01-18 21:11:57.899', 1),
('a5a3c3ec-c235-40be-a65c-e81e313989a7', '3a51143603c7c357f25d075bb79c3f841a443acec08c556e181ea32de82a5e1c', '2022-01-18 21:11:58.104', '20220118194618_', NULL, NULL, '2022-01-18 21:11:58.070', 1),
('a8fb2b73-f76a-47b3-afd1-f3629a407b94', 'bcfd25c9e25e08cbfe8d3274b3d9e4ea9d094329347fef3e8e90b8bb8ee11d16', '2022-01-18 21:11:58.131', '20220118211151_', NULL, NULL, '2022-01-18 21:11:58.105', 1),
('dea89f27-21ff-4a74-8ef1-62f0690dfa14', '3cfada14f9cb38deda35cd089b25c3196b28a6d3b75e736e1bbf60d573469eec', '2022-01-18 21:11:57.898', '20220116210220_init', NULL, NULL, '2022-01-18 21:11:57.860', 1),
('e9a178df-954b-4796-8e61-3e3fa36dbf37', 'aefda0d24ec332a04abdd96fba022be02bad163164ef53aff9f791a7e71dc4ab', '2022-01-18 22:43:37.083', '20220118224336_init', NULL, NULL, '2022-01-18 22:43:36.996', 1),
('e9a685c3-86bc-4979-a079-b413de966d08', '4f61eb7c4045e2b44e3e21b47c78a61a6e752fc39eabf24bc533bd837b9453bd', '2022-01-18 21:30:07.664', '20220118213007_', NULL, NULL, '2022-01-18 21:30:07.629', 1);

--
-- Dökümü yapılmış tablolar için indeksler
--

--
-- Tablo için indeksler `Proof`
--
ALTER TABLE `Proof`
  ADD PRIMARY KEY (`proofId`),
  ADD KEY `Proof_proofWalletAddress_fkey` (`proofWalletAddress`);

--
-- Tablo için indeksler `Wallet`
--
ALTER TABLE `Wallet`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `Wallet_address_key` (`address`);

--
-- Tablo için indeksler `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- Dökümü yapılmış tablolar için AUTO_INCREMENT değeri
--

--
-- Tablo için AUTO_INCREMENT değeri `Proof`
--
ALTER TABLE `Proof`
  MODIFY `proofId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- Tablo için AUTO_INCREMENT değeri `Wallet`
--
ALTER TABLE `Wallet`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Dökümü yapılmış tablolar için kısıtlamalar
--

--
-- Tablo kısıtlamaları `Proof`
--
ALTER TABLE `Proof`
  ADD CONSTRAINT `Proof_proofWalletAddress_fkey` FOREIGN KEY (`proofWalletAddress`) REFERENCES `Wallet` (`address`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
