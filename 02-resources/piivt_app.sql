-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               11.0.3-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.0.0.6468
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for piivt_app
DROP DATABASE IF EXISTS `piivt_app`;
CREATE DATABASE IF NOT EXISTS `piivt_app` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;
USE `piivt_app`;

-- Dumping structure for table piivt_app.administrator
DROP TABLE IF EXISTS `administrator`;
CREATE TABLE IF NOT EXISTS `administrator` (
  `administrator_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(32) NOT NULL,
  `email` varchar(32) NOT NULL,
  `password_hash` varchar(128) NOT NULL,
  `password_reset_link` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_active` tinyint(1) unsigned NOT NULL DEFAULT 1,
  PRIMARY KEY (`administrator_id`),
  UNIQUE KEY `uq_administrator_username` (`username`),
  UNIQUE KEY `uq_administrator_email` (`email`),
  UNIQUE KEY `uq_administrator_password_reset_link` (`password_reset_link`) USING HASH
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table piivt_app.administrator: ~0 rows (approximately)

-- Dumping structure for table piivt_app.category
DROP TABLE IF EXISTS `category`;
CREATE TABLE IF NOT EXISTS `category` (
  `category_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `category_type` enum('product','news','root') NOT NULL DEFAULT 'product',
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0,
  `category__id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `uq_category_name_category__id` (`name`,`category__id`) USING BTREE,
  KEY `fk_category_fk_category_id` (`category__id`) USING BTREE,
  CONSTRAINT `fk_category_category__id` FOREIGN KEY (`category__id`) REFERENCES `category` (`category_id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table piivt_app.category: ~2 rows (approximately)
REPLACE INTO `category` (`category_id`, `name`, `category_type`, `is_deleted`, `category__id`) VALUES
	(1, 'Categories', 'root', 0, 1),
	(27, 'Products', 'product', 0, 1),
	(28, 'News', 'news', 0, 1),
	(29, 'Food', 'product', 0, 27),
	(30, 'Drinks', 'product', 0, 27),
	(31, 'Fruit', 'product', 0, 29),
	(32, 'Alcoholic drinks', 'product', 0, 30),
	(33, 'World news', 'news', 0, 28),
	(34, 'Domestic news', 'news', 0, 28),
	(35, 'Latest news', 'news', 1, 33),
	(37, 'Latest news', 'news', 1, 34);

-- Dumping structure for table piivt_app.contact
DROP TABLE IF EXISTS `contact`;
CREATE TABLE IF NOT EXISTS `contact` (
  `contact_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `firstname` varchar(32) NOT NULL,
  `lastname` varchar(32) NOT NULL,
  `email` varchar(32) NOT NULL,
  `title` varchar(32) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`contact_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table piivt_app.contact: ~0 rows (approximately)

-- Dumping structure for table piivt_app.news
DROP TABLE IF EXISTS `news`;
CREATE TABLE IF NOT EXISTS `news` (
  `news_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(32) NOT NULL,
  `content` text NOT NULL,
  `alt_text` varchar(64) DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `modified_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `category_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`news_id`),
  UNIQUE KEY `uq_news_title_category_id` (`title`,`category_id`) USING BTREE,
  KEY `fk_news_category_id` (`category_id`),
  CONSTRAINT `fk_news_category_id` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table piivt_app.news: ~0 rows (approximately)

-- Dumping structure for table piivt_app.page
DROP TABLE IF EXISTS `page`;
CREATE TABLE IF NOT EXISTS `page` (
  `page_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(32) NOT NULL,
  `alt_text` varchar(64) DEFAULT NULL,
  `content` text NOT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `modified_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`page_id`),
  UNIQUE KEY `uq_page_title` (`title`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table piivt_app.page: ~0 rows (approximately)

-- Dumping structure for table piivt_app.photo
DROP TABLE IF EXISTS `photo`;
CREATE TABLE IF NOT EXISTS `photo` (
  `photo_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `alt_text` varchar(64) DEFAULT NULL,
  `file_path` text NOT NULL,
  `content_type` enum('product','news','page') DEFAULT NULL,
  `product_id` int(10) unsigned DEFAULT NULL,
  `page_id` int(10) unsigned DEFAULT NULL,
  `news_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`photo_id`),
  UNIQUE KEY `uq_photo_name` (`name`),
  UNIQUE KEY `uq_photo_file_path` (`file_path`) USING HASH,
  KEY `fk_photo_product_id` (`product_id`),
  KEY `fk_photo_page_id` (`page_id`),
  KEY `fk_photo_news_id` (`news_id`),
  CONSTRAINT `fk_photo_news_id` FOREIGN KEY (`news_id`) REFERENCES `news` (`news_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_photo_page_id` FOREIGN KEY (`page_id`) REFERENCES `page` (`page_id`) ON UPDATE CASCADE,
  CONSTRAINT `fk_photo_product_id` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table piivt_app.photo: ~0 rows (approximately)

-- Dumping structure for table piivt_app.product
DROP TABLE IF EXISTS `product`;
CREATE TABLE IF NOT EXISTS `product` (
  `product_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL,
  `alt_text` varchar(64) DEFAULT NULL,
  `description` text NOT NULL,
  `price` decimal(10,2) unsigned NOT NULL,
  `sku` int(12) unsigned NOT NULL,
  `supply` int(10) unsigned NOT NULL,
  `is_on_discount` tinyint(1) unsigned NOT NULL DEFAULT 0,
  `discount` enum('0.1','0.2','0.3','0.4','0.5','0.6','0.7','0.8','0.9') NOT NULL,
  `is_deleted` tinyint(1) unsigned NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `modified_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `category_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`product_id`),
  UNIQUE KEY `uq_product_sku` (`sku`),
  UNIQUE KEY `uq_product_name_category_id` (`name`,`category_id`) USING BTREE,
  KEY `fk_product_category_id` (`category_id`),
  CONSTRAINT `fk_product_category_id` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table piivt_app.product: ~0 rows (approximately)

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
