/*
 Navicat Premium Data Transfer

 Source Server         : aplikacija
 Source Server Type    : MariaDB
 Source Server Version : 110102 (11.1.2-MariaDB)
 Source Host           : localhost:3306
 Source Schema         : piivt_app

 Target Server Type    : MariaDB
 Target Server Version : 110102 (11.1.2-MariaDB)
 File Encoding         : 65001

 Date: 06/09/2023 17:08:11
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for administrator
-- ----------------------------
DROP TABLE IF EXISTS `administrator`;
CREATE TABLE `administrator` (
  `administrator_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(64) NOT NULL,
  `email` varchar(64) NOT NULL,
  `password_hash` varchar(128) NOT NULL,
  `password_reset_link` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_active` tinyint(1) unsigned NOT NULL DEFAULT 1,
  PRIMARY KEY (`administrator_id`) USING BTREE,
  UNIQUE KEY `uq_administrator_username` (`username`) USING BTREE,
  UNIQUE KEY `uq_administrator_email` (`email`) USING BTREE,
  UNIQUE KEY `uq_administrator_password_reset_link` (`password_reset_link`) USING HASH
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of administrator
-- ----------------------------
BEGIN;
INSERT INTO `administrator` (`administrator_id`, `username`, `email`, `password_hash`, `password_reset_link`, `created_at`, `is_active`) VALUES (27, 'profesor3', 'profesor3@profesor.com', '$2b$10$/Opvqhi8L.40mXaD3/JvA.2EDf10lAz/WsXYpm0EUwgWQwd6g2A42', NULL, '2023-08-28 00:59:48', 1);
INSERT INTO `administrator` (`administrator_id`, `username`, `email`, `password_hash`, `password_reset_link`, `created_at`, `is_active`) VALUES (30, 'profesorr', 'profesor2@profesor.com', '$2b$10$QCfZCEt8kk1PHyCnW/WJDOgpJUUxfYzDPlMEOz/tbNgqZJwmHP1Ym', NULL, '2023-08-28 02:05:42', 1);
INSERT INTO `administrator` (`administrator_id`, `username`, `email`, `password_hash`, `password_reset_link`, `created_at`, `is_active`) VALUES (31, 'nenad', 'nenad@student.com', '$2b$10$rkEXGhYv6StDKQDy58eaSeFZtbRxHCKwu8ObQ7tjXf0eKOVItpo1i', NULL, '2023-08-31 14:00:28', 1);
INSERT INTO `administrator` (`administrator_id`, `username`, `email`, `password_hash`, `password_reset_link`, `created_at`, `is_active`) VALUES (34, 'admin', 'admin@profesor.com', '$2b$10$WtM6kpaaPnKEukc8Xnn2Aeype6oFpmRATSSFyk7aKCZt0/YrgUbOu', NULL, '2023-08-31 15:10:05', 0);
INSERT INTO `administrator` (`administrator_id`, `username`, `email`, `password_hash`, `password_reset_link`, `created_at`, `is_active`) VALUES (35, 'adminu', 'admin@student.com', '$2b$10$SHimehEhNqqkgtrquu5mz.bjj0NfrjfySXu0A6LwE1u6kNlNATUgO', NULL, '2023-09-01 20:54:00', 1);
INSERT INTO `administrator` (`administrator_id`, `username`, `email`, `password_hash`, `password_reset_link`, `created_at`, `is_active`) VALUES (39, 'adminulo', 'admhhhin@student.com', '$2b$10$qabwl83/JOP1qMg7DMe/qOMrd.qm9CMl7GIxx/aFSs.y1kPLeUzIe', NULL, '2023-09-01 21:54:43', 1);
INSERT INTO `administrator` (`administrator_id`, `username`, `email`, `password_hash`, `password_reset_link`, `created_at`, `is_active`) VALUES (40, 'student', 'student@student.com', '$2b$10$HiXDmhKlYpZzQpKcxXLbZ.R1Ce/iKZUmolel9wBJs.k6iTi.pCXJu', NULL, '2023-09-03 12:37:26', 1);
INSERT INTO `administrator` (`administrator_id`, `username`, `email`, `password_hash`, `password_reset_link`, `created_at`, `is_active`) VALUES (42, 'student2', 'student1@student.com', '$2b$10$3KJWF9UM3h2GXi/N2V9J5uOEQwcmGNZ5U8L5bxsX2lKT2tUei5Rty', NULL, '2023-09-05 23:22:16', 1);
COMMIT;

-- ----------------------------
-- Table structure for category
-- ----------------------------
DROP TABLE IF EXISTS `category`;
CREATE TABLE `category` (
  `category_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL,
  `category_type` enum('product','news','root') NOT NULL DEFAULT 'product',
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0,
  `parent_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`category_id`) USING BTREE,
  UNIQUE KEY `uq_category_name_category__id` (`name`,`parent_id`) USING BTREE,
  KEY `fk_category_fk_category_id` (`parent_id`) USING BTREE,
  CONSTRAINT `fk_category_parent_id` FOREIGN KEY (`parent_id`) REFERENCES `category` (`category_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=85 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of category
-- ----------------------------
BEGIN;
INSERT INTO `category` (`category_id`, `name`, `category_type`, `is_deleted`, `parent_id`) VALUES (1, 'root', 'root', 0, 1);
INSERT INTO `category` (`category_id`, `name`, `category_type`, `is_deleted`, `parent_id`) VALUES (27, 'Products', 'product', 0, 1);
INSERT INTO `category` (`category_id`, `name`, `category_type`, `is_deleted`, `parent_id`) VALUES (28, 'News', 'news', 0, 1);
INSERT INTO `category` (`category_id`, `name`, `category_type`, `is_deleted`, `parent_id`) VALUES (29, 'Food', 'product', 0, 27);
INSERT INTO `category` (`category_id`, `name`, `category_type`, `is_deleted`, `parent_id`) VALUES (30, 'Drinks', 'product', 0, 27);
INSERT INTO `category` (`category_id`, `name`, `category_type`, `is_deleted`, `parent_id`) VALUES (31, 'World news', 'news', 0, 29);
INSERT INTO `category` (`category_id`, `name`, `category_type`, `is_deleted`, `parent_id`) VALUES (32, 'Alcoholic drinks', 'product', 0, 30);
INSERT INTO `category` (`category_id`, `name`, `category_type`, `is_deleted`, `parent_id`) VALUES (33, 'Regional news', 'news', 0, 28);
INSERT INTO `category` (`category_id`, `name`, `category_type`, `is_deleted`, `parent_id`) VALUES (34, 'World news', 'news', 1, 28);
INSERT INTO `category` (`category_id`, `name`, `category_type`, `is_deleted`, `parent_id`) VALUES (35, 'World news', 'news', 0, 33);
INSERT INTO `category` (`category_id`, `name`, `category_type`, `is_deleted`, `parent_id`) VALUES (37, 'Latest news', 'news', 0, 34);
INSERT INTO `category` (`category_id`, `name`, `category_type`, `is_deleted`, `parent_id`) VALUES (38, 'Vegetables', 'product', 0, 29);
INSERT INTO `category` (`category_id`, `name`, `category_type`, `is_deleted`, `parent_id`) VALUES (84, 'Non alcoholic drinks', 'product', 0, 30);
COMMIT;

-- ----------------------------
-- Table structure for contact
-- ----------------------------
DROP TABLE IF EXISTS `contact`;
CREATE TABLE `contact` (
  `contact_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `firstname` varchar(64) NOT NULL,
  `lastname` varchar(64) NOT NULL,
  `email` varchar(64) NOT NULL,
  `title` varchar(64) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`contact_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of contact
-- ----------------------------
BEGIN;
INSERT INTO `contact` (`contact_id`, `firstname`, `lastname`, `email`, `title`, `message`, `created_at`) VALUES (1, 'Marko', 'Ilić', 'marko14@gmail.com', 'Pozdrav', 'Odlični proizvodi', '2023-08-29 22:42:37');
INSERT INTO `contact` (`contact_id`, `firstname`, `lastname`, `email`, `title`, `message`, `created_at`) VALUES (3, 'Djordje', 'Matic', 'string@string.rs', 'Ovo je nekakva poruka', 'Ovo je nekakva poruka,Ovo je nekakva poruka,Ovo je nekakva poruka,Ovo je nekakva poruka,Ovo je nekakva poruka,Ovo je nekakva poruka,Ovo je nekakva poruka,Ovo je nekakva poruka,Ovo je nekakva poruka,Ovo je nekakva poruka,Ovo je nekakva poruka,Ovo je nekakva poruka,', '2023-09-06 13:26:01');
COMMIT;

-- ----------------------------
-- Table structure for news
-- ----------------------------
DROP TABLE IF EXISTS `news`;
CREATE TABLE `news` (
  `news_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(64) NOT NULL,
  `content` text NOT NULL,
  `alt_text` varchar(64) DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `modified_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `category_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`news_id`) USING BTREE,
  UNIQUE KEY `uq_news_title_category_id` (`title`,`category_id`) USING BTREE,
  KEY `fk_news_category_id` (`category_id`) USING BTREE,
  CONSTRAINT `fk_news_category_id` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of news
-- ----------------------------
BEGIN;
INSERT INTO `news` (`news_id`, `title`, `content`, `alt_text`, `is_deleted`, `created_at`, `modified_at`, `category_id`) VALUES (8, 'Novi artikli na popustu u Beogradu!', 'Vaši omiljeni proizvodi ponovo na popustu od danas..', '#popusti', 0, '2023-08-25 22:04:19', '2023-09-01 19:17:56', 33);
INSERT INTO `news` (`news_id`, `title`, `content`, `alt_text`, `is_deleted`, `created_at`, `modified_at`, `category_id`) VALUES (19, 'Otvoren novi supermarket u Nišu!', 'Od sada možete kupovati naše proizvode i u Nišu na lokaciji..', NULL, 0, '2023-08-30 00:09:38', '2023-08-30 00:09:38', 35);
INSERT INTO `news` (`news_id`, `title`, `content`, `alt_text`, `is_deleted`, `created_at`, `modified_at`, `category_id`) VALUES (36, 'Nagradna igra Maksi supermarketa', 'Pspravna Prijava koja je izvršena putem SMS poruke ili putem internet obrasca, koja je primljena u periodu od 19.09.2022. godine od 00:01h zaključno sa 30.10.2022. godine najkasnije do 23:59 časova, učestvuje u izvlačenju nagrada.', '#maxi#nagradna igra', 1, '2023-09-05 20:50:03', '2023-09-05 23:00:55', 34);
INSERT INTO `news` (`news_id`, `title`, `content`, `alt_text`, `is_deleted`, `created_at`, `modified_at`, `category_id`) VALUES (37, 'Maxi akcija!', 'Kupovinom bilo koje Najlepše Želje čokolade u prodajnim objektima „Univerexport“ i u online prodavnici „eLAKOLIJE“, najmanje jednog proizvoda, stiče se osnov za učešće u Nagradnoj igri.', '#maxi#shoping', 0, '2023-09-05 22:50:15', '2023-09-05 22:50:15', 34);
INSERT INTO `news` (`news_id`, `title`, `content`, `alt_text`, `is_deleted`, `created_at`, `modified_at`, `category_id`) VALUES (39, 'Max!', 'Kupovinom bilo koje Najlepše Želje čokolade u prodajnim objektima „Univerexport“ i u online prodavnici „eLAKOLIJE“, najmanje jednog proizvoda, stiče se osnov za učešće u Nagradnoj igri.', '#maxi#shoping', 0, '2023-09-05 22:50:38', '2023-09-05 22:50:38', 34);
COMMIT;

-- ----------------------------
-- Table structure for page
-- ----------------------------
DROP TABLE IF EXISTS `page`;
CREATE TABLE `page` (
  `page_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(64) NOT NULL,
  `alt_text` varchar(64) DEFAULT NULL,
  `content` text NOT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `modified_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`page_id`) USING BTREE,
  UNIQUE KEY `uq_page_title` (`title`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of page
-- ----------------------------
BEGIN;
INSERT INTO `page` (`page_id`, `title`, `alt_text`, `content`, `is_deleted`, `created_at`, `modified_at`) VALUES (1, 'Oglasna tabla', NULL, 'Na prodaju....', 1, '2023-08-29 22:51:31', '2023-09-06 04:17:58');
INSERT INTO `page` (`page_id`, `title`, `alt_text`, `content`, `is_deleted`, `created_at`, `modified_at`) VALUES (2, 'Recepti', NULL, '1. Kiflice sa dzemom. 2. Tiramisu', 0, '2023-08-29 22:56:49', '2023-08-29 22:57:37');
INSERT INTO `page` (`page_id`, `title`, `alt_text`, `content`, `is_deleted`, `created_at`, `modified_at`) VALUES (3, 'Akcija', '', 'asdfgfhghjhgfdssn,.,mnbvcsxscdvbnm,.,mnbfvdcsdvfbbfvdcdvmh,k.lk/.,mhnbfvdcsdvfbghmj,k.ljhj', 0, '2023-09-06 04:33:27', '2023-09-06 04:43:09');
INSERT INTO `page` (`page_id`, `title`, `alt_text`, `content`, `is_deleted`, `created_at`, `modified_at`) VALUES (5, 'Poterrer', '', 'asdfgfhghjhgfdssn,.,mnbvcsxscdvbnm,.,mnbfvdcsdvfbbfvdcdvmh,k.lk/.,mhnbfvdcsdvfbghmj,k.ljhj', 0, '2023-09-06 04:38:41', '2023-09-06 04:38:41');
COMMIT;

-- ----------------------------
-- Table structure for photo
-- ----------------------------
DROP TABLE IF EXISTS `photo`;
CREATE TABLE `photo` (
  `photo_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL,
  `alt_text` varchar(64) DEFAULT NULL,
  `file_path` text NOT NULL,
  `product_id` int(10) unsigned DEFAULT NULL,
  `page_id` int(10) unsigned DEFAULT NULL,
  `news_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`photo_id`) USING BTREE,
  UNIQUE KEY `uq_photo_name` (`name`) USING BTREE,
  UNIQUE KEY `uq_photo_file_path` (`file_path`) USING HASH,
  KEY `fk_photo_news_id_` (`news_id`) USING BTREE,
  KEY `fk_photo_page_id` (`page_id`) USING BTREE,
  KEY `fk_photo_product_id` (`product_id`) USING BTREE,
  CONSTRAINT `fk_photo_news_id_` FOREIGN KEY (`news_id`) REFERENCES `news` (`news_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_photo_page_id` FOREIGN KEY (`page_id`) REFERENCES `page` (`page_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_photo_product_id` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of photo
-- ----------------------------
BEGIN;
INSERT INTO `photo` (`photo_id`, `name`, `alt_text`, `file_path`, `product_id`, `page_id`, `news_id`) VALUES (2, 'Banane', NULL, '/slike/banana.jpg', 1, NULL, NULL);
INSERT INTO `photo` (`photo_id`, `name`, `alt_text`, `file_path`, `product_id`, `page_id`, `news_id`) VALUES (3, 'Wiski JD', '#jackdaniels', '/slike/wiski.jpg', 2, NULL, NULL);
INSERT INTO `photo` (`photo_id`, `name`, `alt_text`, `file_path`, `product_id`, `page_id`, `news_id`) VALUES (4, 'Kupus', '#kupus', '/slike/kupus.jpg', 3, NULL, NULL);
INSERT INTO `photo` (`photo_id`, `name`, `alt_text`, `file_path`, `product_id`, `page_id`, `news_id`) VALUES (5, 'OglasiBarner', NULL, '/slike/oglasiBarner.jpg', NULL, 1, NULL);
INSERT INTO `photo` (`photo_id`, `name`, `alt_text`, `file_path`, `product_id`, `page_id`, `news_id`) VALUES (6, 'ReceptiHeroPhoto', NULL, '/slike/receptiHero.jpg', NULL, 2, NULL);
INSERT INTO `photo` (`photo_id`, `name`, `alt_text`, `file_path`, `product_id`, `page_id`, `news_id`) VALUES (7, 'Supermarket u Nišu', NULL, '/slike/lokalNiš.jop', NULL, NULL, 19);
INSERT INTO `photo` (`photo_id`, `name`, `alt_text`, `file_path`, `product_id`, `page_id`, `news_id`) VALUES (8, 'SlikaArtikala', NULL, '/slike/artikli.jpg', NULL, NULL, 8);
COMMIT;

-- ----------------------------
-- Table structure for product
-- ----------------------------
DROP TABLE IF EXISTS `product`;
CREATE TABLE `product` (
  `product_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL,
  `alt_text` varchar(64) DEFAULT NULL,
  `description` text NOT NULL,
  `price` decimal(10,2) unsigned NOT NULL,
  `sku` bigint(20) unsigned NOT NULL DEFAULT 0,
  `supply` int(10) unsigned NOT NULL,
  `is_on_discount` tinyint(1) unsigned NOT NULL DEFAULT 0,
  `discount` enum('0.1','0.2','0.3','0.4','0.5','0.6','0.7','0.8','0.9') DEFAULT NULL,
  `is_deleted` tinyint(1) unsigned NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `modified_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `category_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`product_id`) USING BTREE,
  UNIQUE KEY `uq_product_sku` (`sku`) USING BTREE,
  UNIQUE KEY `uq_product_name_category_id` (`name`,`category_id`) USING BTREE,
  KEY `fk_product_category_id` (`category_id`) USING BTREE,
  CONSTRAINT `fk_product_category_id` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of product
-- ----------------------------
BEGIN;
INSERT INTO `product` (`product_id`, `name`, `alt_text`, `description`, `price`, `sku`, `supply`, `is_on_discount`, `discount`, `is_deleted`, `created_at`, `modified_at`, `category_id`) VALUES (1, 'Jabuka', NULL, 'Ovo je mnogo zdrava jabuka koja je odgajana na...............................................cvbcvbcvbxcvbcvbzcxvmcvmbzmvbmcxzvbmcxvmbxvnbcnvbmnczv zfgnbfd.', 60.00, 125489736955, 100, 0, NULL, 0, '2023-08-29 23:12:15', '2023-09-04 02:05:24', 31);
INSERT INTO `product` (`product_id`, `name`, `alt_text`, `description`, `price`, `sku`, `supply`, `is_on_discount`, `discount`, `is_deleted`, `created_at`, `modified_at`, `category_id`) VALUES (2, 'Wiski', '#wiski', 'Jack Daniels 0.9', 3000.00, 135454513515, 30, 0, '0.1', 0, '2023-08-29 23:39:34', '2023-09-01 22:48:51', 32);
INSERT INTO `product` (`product_id`, `name`, `alt_text`, `description`, `price`, `sku`, `supply`, `is_on_discount`, `discount`, `is_deleted`, `created_at`, `modified_at`, `category_id`) VALUES (3, 'Kupus', '#mladikupus', 'Kupus 1Kg', 80.00, 254698754254, 40, 0, NULL, 1, '2023-08-29 23:43:08', '2023-09-02 16:24:43', 38);
INSERT INTO `product` (`product_id`, `name`, `alt_text`, `description`, `price`, `sku`, `supply`, `is_on_discount`, `discount`, `is_deleted`, `created_at`, `modified_at`, `category_id`) VALUES (4, 'Avokado', '#avokado', 'Avokado na komad', 140.00, 123456789123, 100, 0, NULL, 1, '2023-09-01 22:17:26', '2023-09-02 21:57:56', 38);
INSERT INTO `product` (`product_id`, `name`, `alt_text`, `description`, `price`, `sku`, `supply`, `is_on_discount`, `discount`, `is_deleted`, `created_at`, `modified_at`, `category_id`) VALUES (5, 'Limun', NULL, 'Ovo je mnogo zut i kiseo limun....Ovo je mnogo zut i kiseo limun....Ovo je mnogo zut i kiseo limun....Ovo je mnogo zut i kiseo limun....Ovo je mnogo zut i kiseo limun....Ovo je mnogo zut i kiseo limun....Ovo je mnogo zut i kiseo limun....', 40.00, 125489736985, 100, 0, NULL, 0, '2023-09-04 01:52:30', '2023-09-04 17:35:49', 38);
INSERT INTO `product` (`product_id`, `name`, `alt_text`, `description`, `price`, `sku`, `supply`, `is_on_discount`, `discount`, `is_deleted`, `created_at`, `modified_at`, `category_id`) VALUES (9, 'Jabuka Ajdared', NULL, 'Ovo je mnogo zdrava jabuka koja je odgajana na...............................................cvbcvbcvbxcvbcvbzcxvmcvmbzmvbmcxzvbmcxvmbxvnbcnvbmnczv zfgnbfd.', 60.50, 125489736385, 100, 0, NULL, 0, '2023-09-05 00:52:46', '2023-09-05 00:52:46', 38);
INSERT INTO `product` (`product_id`, `name`, `alt_text`, `description`, `price`, `sku`, `supply`, `is_on_discount`, `discount`, `is_deleted`, `created_at`, `modified_at`, `category_id`) VALUES (11, 'Pomorandze', NULL, 'Organske pomorandze koje su uvezene sa...............................................................................................................', 500.50, 125484536385, 134, 0, NULL, 0, '2023-09-05 23:27:33', '2023-09-05 23:27:33', 38);
INSERT INTO `product` (`product_id`, `name`, `alt_text`, `description`, `price`, `sku`, `supply`, `is_on_discount`, `discount`, `is_deleted`, `created_at`, `modified_at`, `category_id`) VALUES (14, 'Pomorandze', NULL, 'Organske pomorandze koje su uvezene sa...............................................................................................................', 500.50, 125484636385, 134, 0, NULL, 0, '2023-09-05 23:28:17', '2023-09-05 23:28:17', 31);
INSERT INTO `product` (`product_id`, `name`, `alt_text`, `description`, `price`, `sku`, `supply`, `is_on_discount`, `discount`, `is_deleted`, `created_at`, `modified_at`, `category_id`) VALUES (19, 'Pomorandzee', NULL, 'Organske pomorandze koje su uvezene sa...............................................................................................................', 500.50, 12548385, 134, 0, NULL, 1, '2023-09-05 23:31:35', '2023-09-05 23:56:18', 31);
INSERT INTO `product` (`product_id`, `name`, `alt_text`, `description`, `price`, `sku`, `supply`, `is_on_discount`, `discount`, `is_deleted`, `created_at`, `modified_at`, `category_id`) VALUES (23, 'Pomorandzeeer', NULL, 'Organske pomorandze koje su uvezene sa...............................................................................................................', 500.50, 12548675467631, 134, 0, NULL, 1, '2023-09-05 23:34:39', '2023-09-05 23:54:32', 31);
INSERT INTO `product` (`product_id`, `name`, `alt_text`, `description`, `price`, `sku`, `supply`, `is_on_discount`, `discount`, `is_deleted`, `created_at`, `modified_at`, `category_id`) VALUES (24, 'Breskwdfssdfi', NULL, 'MandarineMandarineeMandarineeMandarineeMandarineeMandarineeMandarineeMandarineeMandarineeMandarineeMandarineeMandarineeMandarineeMandarineeMandarineeMandarineeMandarine Mandarine', 65.00, 254897, 100, 0, NULL, 0, '2023-09-05 23:34:51', '2023-09-06 01:39:54', 31);
INSERT INTO `product` (`product_id`, `name`, `alt_text`, `description`, `price`, `sku`, `supply`, `is_on_discount`, `discount`, `is_deleted`, `created_at`, `modified_at`, `category_id`) VALUES (25, 'Pomorandzeeerrt', NULL, 'Organske pomorandze koje su uvezene sa...............................................................................................................', 500.50, 125486123456, 134, 0, NULL, 0, '2023-09-06 01:40:49', '2023-09-06 01:40:49', 31);
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
