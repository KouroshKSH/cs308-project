-- MySQL dump 10.13  Distrib 8.0.41, for Linux (x86_64)
--
-- Host: localhost    Database: fashion_ecommerce
-- ------------------------------------------------------
-- Server version	8.0.41-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `carts`
--

DROP TABLE IF EXISTS `carts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carts` (
  `cart_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `session_id` varchar(255) DEFAULT NULL,
  `product_id` bigint unsigned NOT NULL,
  `variation_id` bigint unsigned NOT NULL,
  `quantity` int unsigned NOT NULL,
  PRIMARY KEY (`cart_id`),
  UNIQUE KEY `unique_cart_item` (`user_id`,`session_id`,`product_id`,`variation_id`),
  KEY `product_id` (`product_id`),
  KEY `variation_id` (`variation_id`),
  CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `carts_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE,
  CONSTRAINT `carts_ibfk_3` FOREIGN KEY (`variation_id`) REFERENCES `product_variations` (`variation_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carts`
--

LOCK TABLES `carts` WRITE;
/*!40000 ALTER TABLE `carts` DISABLE KEYS */;
INSERT INTO `carts` VALUES (11,49,'session_1746980494268_iilofywpb5_57746aa1-5421-4f32-9ab4-3aa60605a1ac',7,30,2),(12,49,'session_1746980494268_iilofywpb5_57746aa1-5421-4f32-9ab4-3aa60605a1ac',7,33,5),(13,49,'session_1746980494268_iilofywpb5_57746aa1-5421-4f32-9ab4-3aa60605a1ac',2,7,1),(14,49,'session_1746980494268_iilofywpb5_57746aa1-5421-4f32-9ab4-3aa60605a1ac',2,9,1),(15,49,'session_1746980494268_iilofywpb5_57746aa1-5421-4f32-9ab4-3aa60605a1ac',15,69,1),(22,6,'session_1747504549752_zscssvxjb7_9b54e7d9-935c-44af-98fe-b12ed7e320c9',7,29,1),(26,47,'session_1747762404968_gi0wmgfw4yn_21d58779-924e-4850-a430-2263565c4509',6,24,1),(27,47,'session_1747762404968_gi0wmgfw4yn_21d58779-924e-4850-a430-2263565c4509',7,29,1);
/*!40000 ALTER TABLE `carts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `category_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `parent_category_id` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`category_id`),
  KEY `parent_category_id` (`parent_category_id`),
  CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`parent_category_id`) REFERENCES `categories` (`category_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Men',NULL),(2,'Women',NULL),(3,'Kids',NULL),(4,'Tops',1),(5,'Bottoms',1),(6,'Shoes',1),(7,'Accessories',1),(8,'T-Shirts',4),(9,'Shirts',4),(10,'Sweaters',4),(11,'Jackets',4),(12,'Jeans',5),(13,'Pants',5),(14,'Shorts',5),(15,'Sneakers',6),(16,'Boots',6),(17,'Sandals',6),(18,'Watches',7),(19,'Bags',7),(20,'Hats',7),(21,'Glasses',7),(22,'Jewellery',7),(23,'Tops',2),(24,'Bottoms',2),(25,'Shoes',2),(26,'Accessories',2),(27,'T-Shirts',23),(28,'Shirts',23),(29,'Sweaters',23),(30,'Jackets',23),(31,'Jeans',24),(32,'Pants',24),(33,'Shorts',24),(34,'Skirts',24),(35,'Sneakers',25),(36,'Boots',25),(37,'Sandals',25),(38,'Heels',25),(39,'Watches',26),(40,'Bags',26),(41,'Hats',26),(42,'Glasses',26),(43,'Jewellery',26),(44,'Tops',3),(45,'Bottoms',3),(46,'Shoes',3),(47,'Accessories',3),(48,'T-Shirts',44),(49,'Shirts',44),(50,'Sweaters',44),(51,'Jackets',44),(52,'Jeans',45),(53,'Pants',45),(54,'Shorts',45),(55,'Skirts',45),(56,'Sneakers',46),(57,'Boots',46),(58,'Sandals',46),(59,'Watches',47),(60,'Bags',47),(61,'Hats',47),(62,'Glasses',47),(63,'Jewellery',47),(64,'catUndrDept',1),(65,'catUndrDept',2),(66,'catUndrDept',3),(67,'subCatParnt',4),(68,'subCatParnt',23),(69,'subCatParnt',44),(70,'finalDemoCatV1',1),(71,'finalDemoCatV1',2),(72,'finalDemoCatV1',3);
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `colors`
--

DROP TABLE IF EXISTS `colors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `colors` (
  `color_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`color_id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `colors`
--

LOCK TABLES `colors` WRITE;
/*!40000 ALTER TABLE `colors` DISABLE KEYS */;
INSERT INTO `colors` VALUES (8,'Black'),(5,'Blue'),(10,'Brown'),(9,'Gray'),(4,'Green'),(12,'Multiple Colors'),(2,'Orange'),(6,'Pink'),(7,'Purple'),(1,'Red'),(11,'White'),(3,'Yellow');
/*!40000 ALTER TABLE `colors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `deliveries`
--

DROP TABLE IF EXISTS `deliveries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `deliveries` (
  `delivery_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint unsigned NOT NULL,
  `delivery_address` varchar(255) DEFAULT NULL,
  `shipped_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `delivery_status` enum('pending','shipped','delivered') DEFAULT 'pending',
  `tracking_number` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`delivery_id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `deliveries_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `deliveries`
--

LOCK TABLES `deliveries` WRITE;
/*!40000 ALTER TABLE `deliveries` DISABLE KEYS */;
INSERT INTO `deliveries` VALUES (1,6,'Kocaeli, Turkey','2025-04-27 17:12:57','delivered','TRK021842'),(2,7,'Kocaeli, Turkey','2025-04-27 17:24:57','shipped','TRK884021'),(3,8,'Kocaeli, Turkey','2025-04-27 17:27:18','delivered',NULL),(4,9,'Tokyo, Japan','2025-04-27 17:32:17','delivered','TRK184260'),(5,10,'my house, my town','2025-04-28 04:09:32','pending',NULL),(6,11,'IC 24/7 study room because i was locked out after 23:45','2025-04-28 04:45:33','delivered','TRK673836'),(7,12,'kerem hane, keram Cd. kerem Mah., Kerambul','2025-04-28 05:07:42','pending',NULL),(8,13,'sabanci dorms','2025-04-28 05:33:35','delivered','TRK470601'),(9,14,'home, street, city','2025-04-28 06:29:39','delivered','TRK844800'),(10,15,'sabanci campus, Tuzla','2025-04-28 07:30:08','delivered','TRK496107'),(11,16,'unit test street, no Mah., can\'t fix it Cd.','2025-04-28 19:51:04','pending',NULL),(12,17,'my home','2025-05-01 10:34:14','delivered','TRK720950'),(13,18,'refactor alley, attempt 2 St., GitHubLand','2025-05-06 14:40:40','pending',NULL),(14,19,'kayseri, turkiye','2025-05-07 07:42:57','delivered','TRK856208'),(15,20,'kayseri, monster alley, rooster St., Mars','2025-05-07 07:48:49','delivered','TRK155687'),(16,21,'bugfix St., SWE Blvr., Code City, ProgrammingLand','2025-05-13 14:37:21','shipped',NULL),(17,22,'farm, valley','2025-05-13 18:23:34','pending',NULL),(18,23,'somwhere, idk','2025-05-13 21:10:42','delivered','TRK-20250513T211042'),(19,24,'random city','2025-05-15 06:06:14','pending','TRK-20250515T060614-959'),(22,27,'fix Floor, discounted prices Block, order Complex, is it fixed Alley, let\'s check Street, hopefully yes Blvr., Solar System ','2025-05-19 22:40:27','pending','TRK-20250519T224027-863'),(23,28,'tesing 247 PR','2025-05-21 20:07:29','delivered','TRK-20250521T200729-969'),(25,30,'address','2025-05-22 01:10:51','delivered','TRK-20250522T011051-813'),(26,31,'adrs','2025-05-22 01:13:28','delivered','TRK-20250522T011328-331'),(27,32,'sdfd','2025-05-22 01:22:45','delivered','TRK-20250522T012245-474'),(28,33,'final demo St., v1 Alley, TR','2025-05-22 04:39:36','delivered','TRK-20250522T043936-899'),(29,34,'let\'s double check my address','2025-05-22 04:44:19','delivered','TRK-20250522T044419-968'),(30,35,'addie?','2025-05-22 04:45:53','pending','TRK-20250522T044553-339'),(31,36,'paspaspaspaspaps','2025-05-22 04:46:57','shipped','TRK-20250522T044657-889'),(32,37,'whatevers adres','2025-05-22 05:11:43','pending','TRK-20250522T051143-943'),(33,38,'standart address','2025-05-22 05:29:33','delivered','TRK-20250522T052933-207');
/*!40000 ALTER TABLE `deliveries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departments` (
  `department_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`department_id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departments`
--

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
INSERT INTO `departments` VALUES (3,'Kids'),(1,'Men'),(2,'Women');
/*!40000 ALTER TABLE `departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `order_item_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint unsigned NOT NULL,
  `product_id` bigint unsigned NOT NULL,
  `variation_id` bigint unsigned DEFAULT NULL,
  `quantity` int unsigned NOT NULL,
  `price_at_purchase` decimal(10,2) NOT NULL,
  PRIMARY KEY (`order_item_id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`),
  KEY `variation_id` (`variation_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_ibfk_3` FOREIGN KEY (`variation_id`) REFERENCES `product_variations` (`variation_id`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (2,2,2,6,2,45.00),(3,3,4,17,8,60.00),(4,3,1,2,5,19.99),(5,3,7,31,1,44.99),(6,4,2,7,1,45.00),(7,5,1,3,1,19.99),(8,5,6,27,2,24.99),(9,5,11,50,1,21.00),(10,6,6,24,1,24.99),(11,6,8,35,1,39.99),(12,7,3,12,1,75.00),(13,7,9,39,2,45.99),(14,8,3,12,1,75.00),(15,8,9,39,2,45.99),(16,9,10,44,1,65.00),(17,10,14,64,3,50.00),(18,11,14,64,1,50.00),(19,12,13,59,2,40.00),(20,13,7,29,1,44.99),(21,13,14,64,1,50.00),(22,14,1,2,2,19.99),(23,15,3,13,1,75.00),(24,15,14,64,6,50.00),(25,15,7,30,2,44.99),(26,16,14,64,2,50.00),(27,17,14,64,1,50.00),(28,18,15,69,1,24.99),(29,18,1,1,1,19.99),(30,18,9,41,1,45.99),(31,19,14,65,1,50.00),(32,20,5,23,1,54.99),(33,20,14,65,2,50.00),(34,21,1,1,1,19.99),(35,21,14,64,1,50.00),(36,22,3,16,2,75.00),(37,23,13,59,1,40.00),(38,24,7,30,1,44.99),(39,24,2,6,1,45.00),(40,27,8,35,1,33.99),(41,27,7,29,1,44.99),(42,27,6,24,1,23.74),(43,28,12,56,3,20.99),(44,28,1,1,2,17.99),(45,28,13,62,1,30.00),(46,29,1,1,1,18.91),(47,30,1,1,1,18.91),(48,31,1,2,2,18.91),(49,32,1,2,2,18.91),(50,33,20,74,2,200.00),(51,34,21,75,3,15.00),(52,35,22,76,1,11.00),(53,36,23,77,6,40.00),(54,37,1,5,1,18.91),(55,38,25,79,1,90.00);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `order_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `order_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('processing','in-transit','delivered','cancelled','refunded') DEFAULT 'processing',
  `total_price` decimal(10,2) NOT NULL,
  `delivery_address` varchar(255) NOT NULL,
  `invoice_pdf_url` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`order_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (2,2,'2025-04-25 12:46:46','in-transit',100.00,'sabanci campus',NULL),(3,2,'2025-04-26 09:13:17','processing',624.94,'Address 123',NULL),(4,2,'2025-04-26 18:38:46','refunded',45.00,'London, England',NULL),(5,2,'2025-04-27 11:31:05','processing',90.97,'Boston, USA',NULL),(6,2,'2025-04-27 17:12:57','delivered',64.98,'Kocaeli, Turkey',NULL),(7,3,'2025-04-27 17:24:57','in-transit',64.98,'Kocaeli, Turkey',NULL),(8,3,'2025-04-27 17:27:18','delivered',64.98,'Kocaeli, Turkey',NULL),(9,3,'2025-04-27 17:32:17','delivered',64.98,'Tokyo, Japan',NULL),(10,2,'2025-04-28 04:09:32','processing',150.00,'my house, my town',NULL),(11,38,'2025-04-28 04:45:33','delivered',50.00,'IC 24/7 study room because i was locked out after 23:45',NULL),(12,39,'2025-04-28 05:07:42','processing',80.00,'kerem hane, keram Cd. kerem Mah., Kerambul',NULL),(13,40,'2025-04-28 05:33:35','delivered',94.99,'sabanci dorms',NULL),(14,41,'2025-04-28 06:29:39','delivered',39.98,'home, street, city',NULL),(15,42,'2025-04-28 07:30:08','delivered',464.98,'sabanci campus, Tuzla',NULL),(16,43,'2025-04-28 19:51:04','processing',100.00,'unit test street, no Mah., can\'t fix it Cd.',NULL),(17,2,'2025-05-01 10:34:14','delivered',50.00,'my home',NULL),(18,45,'2025-05-06 14:40:40','processing',90.97,'refactor alley, attempt 2 St., GitHubLand',NULL),(19,2,'2025-05-07 07:42:57','delivered',50.00,'kayseri, turkiye',NULL),(20,46,'2025-05-07 07:48:49','delivered',154.99,'kayseri, monster alley, rooster St., Mars',NULL),(21,3,'2025-05-13 14:37:21','in-transit',69.99,'bugfix St., SWE Blvr., Code City, ProgrammingLand',NULL),(22,46,'2025-05-13 18:23:34','processing',150.00,'farm, valley',NULL),(23,46,'2025-05-13 21:10:42','refunded',40.00,'somwhere, idk',NULL),(24,2,'2025-05-15 06:06:14','processing',89.99,'random city',NULL),(27,2,'2025-05-19 22:40:27','processing',102.72,'fix Floor, discounted prices Block, order Complex, is it fixed Alley, let\'s check Street, hopefully yes Blvr., Solar System ',NULL),(28,50,'2025-05-21 20:07:29','delivered',128.95,'tesing 247 PR',NULL),(29,51,'2025-05-22 01:09:15','cancelled',18.91,'test return 255 address',NULL),(30,51,'2025-05-22 01:10:51','refunded',18.91,'address',NULL),(31,51,'2024-05-22 01:13:28','delivered',37.82,'adrs',NULL),(32,51,'2025-05-22 01:22:45','refunded',37.82,'sdfd','2025-05-22-04-22'),(33,52,'2025-03-22 04:39:36','delivered',400.00,'final demo St., v1 Alley, TR','2025-05-22-07-39'),(34,52,'2025-05-22 04:44:19','delivered',45.00,'let\'s double check my address','2025-05-22-07-44'),(35,52,'2025-05-22 04:45:53','processing',11.00,'addie?','2025-05-22-07-45'),(36,52,'2025-05-22 04:46:57','in-transit',240.00,'paspaspaspaspaps','2025-05-22-07-46'),(37,2,'2025-05-22 05:11:43','processing',18.91,'whatevers adres','2025-05-22-08-11'),(38,52,'2025-05-22 05:29:33','refunded',90.00,'standart address','2025-05-22-08-29');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_reviews`
--

DROP TABLE IF EXISTS `product_reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_reviews` (
  `review_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `product_id` bigint unsigned NOT NULL,
  `user_id` int DEFAULT NULL,
  `rating` tinyint unsigned DEFAULT NULL,
  `comment` text,
  `comment_approval` enum('pending','approved','rejected') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`review_id`),
  KEY `product_id` (`product_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `product_reviews_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE,
  CONSTRAINT `product_reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL,
  CONSTRAINT `product_reviews_chk_1` CHECK ((`rating` between 1 and 5))
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_reviews`
--

LOCK TABLES `product_reviews` WRITE;
/*!40000 ALTER TABLE `product_reviews` DISABLE KEYS */;
INSERT INTO `product_reviews` VALUES (1,1,6,5,'This shirt is soft and fits great!','approved','2025-04-20 19:47:56'),(2,1,17,4,'Decent quality. I might buy again.','approved','2025-04-20 19:47:56'),(3,1,19,NULL,'The material feels okay, nothing special.','approved','2025-04-20 19:47:56'),(4,2,21,5,'Love the pockets! Super practical.','approved','2025-04-20 19:47:56'),(5,2,31,3,'Color is not as expected.','approved','2025-04-20 19:47:56'),(6,2,17,2,NULL,'approved','2025-04-20 19:47:56'),(7,3,19,5,'These boots are amazing. Durable and stylish!','approved','2025-04-20 19:47:56'),(8,3,6,4,'Comfortable but took time to break in.','approved','2025-04-20 19:47:56'),(9,3,31,1,'Sole came off after a few wears. Disappointed.','approved','2025-04-20 19:47:56'),(10,4,21,4,'Classy look, decent value for money.','approved','2025-04-20 19:47:56'),(11,4,33,3,NULL,'approved','2025-04-20 19:47:56'),(12,5,33,5,'Excellent quality. Look better than the photos!','approved','2025-04-20 19:47:56'),(13,5,23,4,'Very unique design. Feels a bit heavy though.','approved','2025-04-20 19:47:56'),(14,5,19,NULL,'Nice set, would recommend to others.','approved','2025-04-20 19:47:56'),(15,6,15,5,'GORGEOUS shirt! Perfect fit.','approved','2025-04-20 19:47:56'),(16,6,16,4,'Colors pop just like in the pictures.','approved','2025-04-20 19:47:56'),(17,6,20,2,'Did not suit me as I hoped.','approved','2025-04-20 19:47:56'),(18,6,24,NULL,'Soft and breathable material.','approved','2025-04-20 19:47:56'),(19,7,22,5,'Very stylish and warm. Love it!','approved','2025-04-20 19:47:56'),(20,7,26,4,'Great jacket for spring.','approved','2025-04-20 19:47:56'),(21,7,32,NULL,'Good quality, sleeves are a bit short.','approved','2025-04-20 19:47:56'),(22,8,16,5,'This skirt flows beautifully when you walk!','approved','2025-04-20 19:47:56'),(23,8,18,3,'Nice design, but sizing runs large.','approved','2025-04-20 19:47:56'),(24,8,34,4,NULL,'approved','2025-04-20 19:47:56'),(25,8,20,5,'Best purchase this season!','approved','2025-04-20 19:47:56'),(26,9,32,3,'Average quality. Stitching could be better.','approved','2025-04-20 19:47:56'),(27,9,34,5,'Looks great and fits like a glove.','approved','2025-04-20 19:47:56'),(28,10,15,2,'Too high for daily wear.','approved','2025-04-20 19:47:56'),(29,10,26,NULL,'Gorgeous but not super comfy.','approved','2025-04-20 19:47:56'),(30,10,18,4,'Great for parties!!','approved','2025-04-20 19:47:56'),(31,11,24,5,'My son LOVES this t-shirt.','approved','2025-04-20 19:47:56'),(32,11,23,4,'Nice colors and material.','approved','2025-04-20 19:47:56'),(33,11,21,NULL,'Bought for nephew, he wears it all the time.','approved','2025-04-20 19:47:56'),(34,12,33,3,'Looks cool but runs small.','approved','2025-04-20 19:47:56'),(35,12,22,2,'Too tight around the waist.','approved','2025-04-20 19:47:56'),(36,12,20,4,NULL,'approved','2025-04-20 19:47:56'),(37,13,26,5,'So warm and soft! Perfect for winter.','approved','2025-04-20 19:47:56'),(38,13,16,NULL,'My daughter wears it all the time.','approved','2025-04-20 19:47:56'),(39,13,34,4,'Really cozy.','approved','2025-04-20 19:47:56'),(40,13,18,3,'Nice but shrank a bit after wash.','approved','2025-04-20 19:47:56'),(41,14,25,5,'Perfect for active kids. Easy to clean.','approved','2025-04-20 19:47:56'),(42,14,23,3,NULL,'approved','2025-04-20 19:47:56'),(43,14,33,4,'Solid build. Velcro could be stronger.','approved','2025-04-20 19:47:56'),(44,15,20,5,'This hat is adorable!!','approved','2025-04-20 19:47:56'),(45,15,24,4,'Really sparkly, my kid loves it.','approved','2025-04-20 19:47:56'),(46,15,26,NULL,'Great for sunny days.','approved','2025-04-20 19:47:56'),(47,3,31,5,'Looks even better in person.','approved','2025-04-20 19:47:56'),(48,5,33,4,'These rings got me so many compliments.','approved','2025-04-20 19:47:56'),(49,6,32,2,'Did not match my expectations.','approved','2025-04-20 19:47:56'),(50,10,18,5,'Killer heels!!','approved','2025-04-20 19:47:56'),(51,15,34,3,'Cute but slightly flimsy.','approved','2025-04-20 19:47:56'),(53,1,1,NULL,'this product sucks!!!','pending','2025-04-23 08:39:25'),(54,2,2,5,'Great product!','approved','2025-04-26 18:42:09'),(55,8,2,3,'i take my previous 2 comments back, this skirt isn\'t half bad','pending','2025-05-17 15:44:46'),(56,14,38,2,'i didn\'t like it, too childish :(','approved','2025-04-28 04:48:51'),(57,7,40,5,'very nice, my mom liked the gift :D','approved','2025-04-28 05:35:17'),(58,1,41,5,'i like this tshirt, got some compliments for it too :D','rejected','2025-04-28 06:32:05'),(59,7,42,4,'review is good','approved','2025-04-28 07:32:10'),(60,14,42,1,'very bad, not good','rejected','2025-04-28 07:33:57'),(61,14,2,2,'[EDITED] too flimsy and not cute :(','pending','2025-05-17 16:09:16'),(63,14,46,1,'the straps ~how~ **have** low quality :(','approved','2025-05-17 16:15:35'),(64,12,50,1,'i didn\'t like these shorts','approved','2025-05-21 21:23:14'),(65,25,52,5,'[EDIT] i really like this weird tshirt with placeholder image','approved','2025-05-22 05:31:08');
/*!40000 ALTER TABLE `product_reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_variations`
--

DROP TABLE IF EXISTS `product_variations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_variations` (
  `variation_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `product_id` bigint unsigned NOT NULL,
  `serial_number` varchar(255) NOT NULL,
  `size_id` bigint unsigned NOT NULL,
  `color_id` bigint unsigned NOT NULL,
  `stock_quantity` int unsigned DEFAULT '0',
  PRIMARY KEY (`variation_id`),
  UNIQUE KEY `serial_number` (`serial_number`),
  KEY `size_id` (`size_id`),
  KEY `color_id` (`color_id`),
  KEY `product_variations_ibfk_1` (`product_id`),
  CONSTRAINT `product_variations_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE,
  CONSTRAINT `product_variations_ibfk_2` FOREIGN KEY (`size_id`) REFERENCES `sizes` (`size_id`),
  CONSTRAINT `product_variations_ibfk_3` FOREIGN KEY (`color_id`) REFERENCES `colors` (`color_id`)
) ENGINE=InnoDB AUTO_INCREMENT=80 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_variations`
--

LOCK TABLES `product_variations` WRITE;
/*!40000 ALTER TABLE `product_variations` DISABLE KEYS */;
INSERT INTO `product_variations` VALUES (1,1,'SN10-1',1,11,98),(2,1,'SN10-2',2,11,141),(3,1,'SN10-3',3,11,49),(4,1,'SN10-4',4,11,0),(5,1,'SN10-5',5,11,1),(6,2,'SN11-1',1,4,99),(7,2,'SN11-2',2,4,91),(8,2,'SN11-3',3,4,9),(9,2,'SN11-4',4,4,9),(10,2,'SN11-5',5,4,9),(11,3,'SN12-1',13,8,0),(12,3,'SN12-2',14,8,7),(13,3,'SN12-3',15,8,0),(14,3,'SN12-4',16,8,40),(15,3,'SN12-5',17,8,50),(16,3,'SN12-6',18,8,198),(17,4,'SN13-1',2,10,10),(18,4,'SN13-2',3,10,5),(19,4,'SN13-3',4,8,7),(20,4,'SN13-4',5,10,0),(21,5,'SN14-1',2,9,92),(22,5,'SN14-2',3,9,0),(23,5,'SN14-3',4,9,7),(24,6,'SN20-1',1,12,48),(25,6,'SN20-2',2,12,50),(26,6,'SN20-3',3,12,5),(27,6,'SN20-4',4,12,18),(28,6,'SN20-5',5,12,0),(29,7,'SN21-1',1,1,128),(30,7,'SN21-2',2,1,32),(31,7,'SN21-3',3,1,0),(32,7,'SN21-4',4,1,0),(33,7,'SN21-5',5,1,9),(34,8,'SN22-1',1,7,0),(35,8,'SN22-2',2,7,89),(36,8,'SN22-3',3,7,9),(37,8,'SN22-4',4,7,91),(38,8,'SN22-5',5,7,9),(39,9,'SN23-1',1,5,140),(40,9,'SN23-2',2,5,0),(41,9,'SN23-3',3,5,5),(42,9,'SN23-4',4,5,50),(43,9,'SN23-5',5,5,50),(44,10,'SN24-1',11,3,99),(45,10,'SN24-2',12,3,91),(46,10,'SN24-3',13,3,9),(47,10,'SN24-4',14,3,0),(48,11,'SN30-1',1,12,0),(49,11,'SN30-2',2,12,100),(50,11,'SN30-3',3,12,20),(51,11,'SN30-4',4,12,0),(52,11,'SN30-5',5,12,4),(53,12,'SN31-1',1,5,45),(54,12,'SN31-2',2,5,0),(55,12,'SN31-3',3,5,25),(56,12,'SN31-4',4,5,50),(57,12,'SN31-5',5,5,5),(58,13,'SN32-1',1,4,0),(59,13,'SN32-2',2,4,148),(60,13,'SN32-3',3,4,5),(61,13,'SN32-4',4,4,20),(62,13,'SN32-5',5,4,50),(63,14,'SN33-1',7,3,100),(64,14,'SN33-2',8,3,176),(65,14,'SN33-3',9,3,6),(66,14,'SN33-4',10,3,0),(67,15,'SN34-1',2,11,0),(68,15,'SN34-2',3,11,95),(69,15,'SN34-3',4,11,4),(71,17,'SN90-1',10,8,0),(72,18,'SN91-1',5,1,1),(73,19,'SN92-1',6,6,50),(74,20,'SN93-1',13,10,98),(75,21,'SN94-1',1,7,97),(76,22,'SN95-1',17,9,99),(77,23,'SN96-1',3,4,94),(78,24,'SN99-0',10,11,100),(79,25,'SN101',6,12,100);
/*!40000 ALTER TABLE `product_variations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `product_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `serial_number` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `price` decimal(10,2) NOT NULL,
  `cost` decimal(10,2) DEFAULT NULL,
  `department_id` bigint unsigned NOT NULL,
  `category_id` bigint unsigned NOT NULL,
  `material` varchar(255) DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `stock_quantity` int unsigned DEFAULT '0',
  `warranty_status` enum('No Warranty','6 Months','1 Year','2 Years','Lifetime') NOT NULL,
  `distributor_info` varchar(255) DEFAULT NULL,
  `popularity_score` decimal(6,3) DEFAULT NULL,
  PRIMARY KEY (`product_id`),
  UNIQUE KEY `serial_number` (`serial_number`),
  KEY `department_id` (`department_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `departments` (`department_id`) ON DELETE CASCADE,
  CONSTRAINT `products_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'SN10','Cotton T-Shirt','Premium cotton t-shirt',21.01,10.00,1,8,'Cotton','url_SN10',300,'1 Year','Dist1',7.253),(2,'SN11','Cargo Pants','Multi-functional neutral cargo pants',45.00,22.50,1,13,'Cotton','url_SN11',220,'1 Year','Dist3',5.868),(3,'SN12','Leather Boots','High quality leather boots',75.00,37.50,1,16,'Leather','url_SN12',300,'Lifetime','DistL',5.840),(4,'SN13','Wrist Watch','Premium wrist watch',60.00,30.00,1,18,'Steel','url_SN13',30,'Lifetime','DistJ',5.358),(5,'SN14','Steel Ring Set','5 piece stainless steel ring set',54.99,27.50,1,22,'Steel','url_SN14',100,'Lifetime','DistJ',6.715),(6,'SN20','Floral Shirt','Floral patterned short sleeve shirt',24.99,12.50,2,28,'Viscose','url_SN20',125,'6 Months','Dist2',5.144),(7,'SN21','Fitted Jacket','Fitted jacket with pocket detailed lining',44.99,22.50,2,30,'Polyester','url_SN21',175,'6 Months','Dist5',7.066),(8,'SN22','Maxi Skirt','Maxi skirt with polka dot pattern',39.99,20.00,2,34,'Cotton','url_SN22',200,'1 Year','DistP',6.590),(9,'SN23','Light Wash Jeans','Light wash skinny denim jeans',45.99,23.00,2,31,'Denim','url_SN23',250,'2 Years','DistD',6.108),(10,'SN24','Metallic High Heels','High Heels with a reflective coating',65.00,32.50,2,38,'Faux Leather','url_SN24',200,'1 Year','DistS',5.715),(11,'SN30','Tie-Dye Cotton T-Shirt','Premium cotton t-shirt with tie dye effect',21.00,10.50,3,48,'Cotton','url_SN30',125,'1 Year','DistK',6.911),(12,'SN31','Denim Shorts','Denim shorts with patches',34.99,17.50,3,54,'Denim','url_SN31',125,'6 Months','DistD',4.661),(13,'SN32','Wool Sweater','Premium wool sweater',40.00,20.00,3,50,'Wool','url_SN32',225,'1 Year','DistT',6.215),(14,'SN33','Sporty Sandals','Active wear sport sandals',50.00,25.00,3,58,'Mesh','url_SN33',300,'1 Year','DistS',4.962),(15,'SN34','Glittery Bucket Hat','Bucket Hat with glittery fabric',25.99,12.50,3,61,'Canvas','url_SN34',100,'1 Year','DistH',6.215),(17,'SN90','Product A','For final demo, a product that is out of stock, so can\'t be added to shopping cart.',30.00,10.00,2,23,'cotton',NULL,0,'1 Year','distributorA',0.000),(18,'SN91','Product B','For final demo, [TESTING] only 1 product in stock.',45.00,5.00,3,44,'cotton',NULL,1,'Lifetime','Distributor B',0.000),(19,'SN92','Product C','For final demo, more than one product in stock.',30.00,3.00,1,4,'cotton',NULL,50,'6 Months','distirbutor for C',0.000),(20,'SN93','Product E','For final demo, something which was purchased more than a month ago.',200.00,20.00,2,24,'leather',NULL,100,'1 Year','distributor E',0.000),(21,'SN94','Product F','For final demo, a product purchased less than a month ago',15.00,10.00,3,45,'plastic',NULL,100,'2 Years','Dist F',0.000),(22,'SN95','Product G','For final demo, purchased recently (status = processing)',11.00,10.00,1,5,'Steel',NULL,100,'1 Year','Dist G',0.000),(23,'SN96','Product H','For final demo, purchased recently (status = in-transit)',40.00,10.00,2,25,'Cotton',NULL,100,'6 Months','Dist H',0.000),(24,'SN99','Product X','For final demo, instead of Product D, I\'m adding X',-1.00,10.00,1,70,'cotton',NULL,100,'6 Months','distX',0.000),(25,'SN100','Product Y','i don\'t even know what i\'m doing at this point',90.00,100.00,1,4,'cotton',NULL,100,'No Warranty','whoKnows',0.000);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `set_cost_default` BEFORE INSERT ON `products` FOR EACH ROW BEGIN
    IF NEW.cost IS NULL THEN
        SET NEW.cost = NEW.price / 2;
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `products_backup_20250515_PR192`
--

DROP TABLE IF EXISTS `products_backup_20250515_PR192`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products_backup_20250515_PR192` (
  `product_id` bigint unsigned NOT NULL DEFAULT '0',
  `serial_number` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `price` decimal(10,2) NOT NULL,
  `department_id` bigint unsigned NOT NULL,
  `category_id` bigint unsigned NOT NULL,
  `material` varchar(255) DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `stock_quantity` int unsigned DEFAULT '0',
  `warranty_status` enum('No Warranty','6 Months','1 Year','2 Years','Lifetime') NOT NULL,
  `distributor_info` varchar(255) DEFAULT NULL,
  `popularity_score` decimal(6,3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products_backup_20250515_PR192`
--

LOCK TABLES `products_backup_20250515_PR192` WRITE;
/*!40000 ALTER TABLE `products_backup_20250515_PR192` DISABLE KEYS */;
INSERT INTO `products_backup_20250515_PR192` VALUES (1,'SN10','Cotton T-Shirt','Premium cotton t-shirt',19.99,1,8,'Cotton','url_SN10',300,'1 Year','Dist1',7.291),(2,'SN11','Cargo Pants','Multi-functional neutral cargo pants',45.00,1,13,'Cotton','url_SN11',220,'1 Year','Dist3',5.186),(3,'SN12','Leather Boots','High quality leather boots',75.00,1,16,'Leather','url_SN12',300,'Lifetime','DistL',5.873),(4,'SN13','Wrist Watch','Premium wrist watch',60.00,1,18,'Steel','url_SN13',30,'Lifetime','DistJ',5.374),(5,'SN14','Steel Ring Set','5 piece stainless steel ring set',54.99,1,22,'Steel','url_SN14',100,'Lifetime','DistJ',6.810),(6,'SN20','Floral Shirt','Floral patterned short sleeve shirt',24.99,2,28,'Viscose','url_SN20',125,'6 Months','Dist2',5.184),(7,'SN21','Fitted Jacket','Fitted jacket with pocket detailed lining',44.99,2,30,'Polyester','url_SN21',175,'6 Months','Dist5',7.113),(8,'SN22','Maxi Skirt','Maxi skirt with polka dot pattern',39.99,2,34,'Cotton','url_SN22',200,'1 Year','DistP',6.663),(9,'SN23','Light Wash Jeans','Light wash skinny denim jeans',45.99,2,31,'Denim','url_SN23',250,'2 Years','DistD',6.124),(10,'SN24','Metallic High Heels','High Heels with a reflective coating',65.00,2,38,'Faux Leather','url_SN24',200,'1 Year','DistS',5.748),(11,'SN30','Tie-Dye Cotton T-Shirt','Premium cotton t-shirt with tie dye effect',21.00,3,48,'Cotton','url_SN30',125,'1 Year','DistK',6.936),(12,'SN31','Denim Shorts','Denim shorts with patches',34.99,3,54,'Denim','url_SN31',125,'6 Months','DistD',4.686),(13,'SN32','Wool Sweater','Premium wool sweater',40.00,3,50,'Wool','url_SN32',225,'1 Year','DistT',6.248),(14,'SN33','Sporty Sandals','Active wear sport sandals',50.00,3,58,'Mesh','url_SN33',300,'1 Year','DistS',5.540),(15,'SN34','Glittery Bucket Hat','Bucket Hat with glittery fabric',24.99,3,61,'Canvas','url_SN34',100,'1 Year','DistH',6.248);
/*!40000 ALTER TABLE `products_backup_20250515_PR192` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `returns`
--

DROP TABLE IF EXISTS `returns`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `returns` (
  `return_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint unsigned NOT NULL,
  `user_id` int DEFAULT NULL,
  `refund_amount` decimal(10,2) DEFAULT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `request_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`return_id`),
  KEY `order_id` (`order_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `returns_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE,
  CONSTRAINT `returns_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `returns`
--

LOCK TABLES `returns` WRITE;
/*!40000 ALTER TABLE `returns` DISABLE KEYS */;
INSERT INTO `returns` VALUES (1,23,46,40.00,'approved','2025-05-21 04:55:00'),(2,20,46,154.99,'rejected','2025-05-21 05:13:17'),(3,4,2,45.00,'approved','2025-05-21 05:37:22'),(4,30,51,18.91,'approved','2025-05-22 01:11:42'),(5,32,51,37.82,'approved','2025-05-22 01:23:29'),(6,38,52,90.00,'approved','2025-05-22 05:36:34');
/*!40000 ALTER TABLE `returns` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sales_campaigns`
--

DROP TABLE IF EXISTS `sales_campaigns`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sales_campaigns` (
  `sales_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `product_id` bigint unsigned NOT NULL,
  `discount_percent` decimal(5,2) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `inserted_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`sales_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `sales_campaigns_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE,
  CONSTRAINT `sales_campaigns_chk_1` CHECK (((`discount_percent` > 0) and (`discount_percent` < 100)))
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales_campaigns`
--

LOCK TABLES `sales_campaigns` WRITE;
/*!40000 ALTER TABLE `sales_campaigns` DISABLE KEYS */;
INSERT INTO `sales_campaigns` VALUES (2,2,10.00,'2023-05-20','2024-05-30','2025-05-18 17:18:02','2025-05-18 17:18:02'),(3,5,35.00,'2025-06-20','2025-06-30','2025-05-18 17:18:44','2025-05-18 17:18:44'),(4,13,25.00,'2025-05-10','2025-06-20','2025-05-18 17:45:15','2025-05-18 17:45:15'),(5,8,15.00,'2025-05-15','2025-06-01','2025-05-18 17:45:51','2025-05-18 17:45:51'),(6,12,40.00,'2025-04-10','2025-07-01','2025-05-18 17:46:32','2025-05-18 17:46:32'),(7,6,5.00,'2025-04-10','2025-07-01','2025-05-18 17:51:11','2025-05-18 17:51:11'),(10,9,18.00,'2025-05-10','2026-05-19','2025-05-18 18:47:13','2025-05-18 18:47:13'),(11,15,14.00,'2025-05-18','2025-05-27','2025-05-18 19:10:59','2025-05-18 19:10:59'),(12,15,40.00,'2027-05-17','2028-05-30','2025-05-18 19:17:18','2025-05-18 19:17:18'),(13,2,31.00,'2025-05-18','2025-05-29','2025-05-18 20:09:29','2025-05-18 20:09:29'),(14,1,10.00,'2025-05-18','2025-05-30','2025-05-18 20:10:17','2025-05-18 20:10:17'),(15,5,42.00,'2025-05-16','2025-05-28','2025-05-19 22:01:33','2025-05-19 22:01:33'),(17,25,20.00,'2025-05-22','2026-05-01','2025-05-22 05:32:28','2025-05-22 05:32:28');
/*!40000 ALTER TABLE `sales_campaigns` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sizes`
--

DROP TABLE IF EXISTS `sizes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sizes` (
  `size_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`size_id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sizes`
--

LOCK TABLES `sizes` WRITE;
/*!40000 ALTER TABLE `sizes` DISABLE KEYS */;
INSERT INTO `sizes` VALUES (7,'25-27'),(8,'28-30'),(9,'31-34'),(10,'35-37'),(11,'38'),(12,'39'),(13,'40'),(14,'41'),(15,'42'),(16,'43'),(17,'44'),(18,'45'),(5,'Extra Large'),(1,'Extra Small'),(4,'Large'),(3,'Medium'),(2,'Small'),(6,'Standart');
/*!40000 ALTER TABLE `sizes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('customer','salesManager','productManager') DEFAULT 'customer',
  `address` varchar(255) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'testuser','testuser@example.com','$2b$10$ul6lIoQFrGLHtbkGXwvxxedT/1nqFFKQUOqy7gQPngWpqfDNGt3KS','customer','123 Test St','1234567890','2025-03-07 13:53:07','2025-03-07 13:53:07'),(2,'newuser','newuser@example.com','$2b$10$r5bBW5xLIKY04uE3FqYQjusv1AN80RgrGMxlm/q4WpMWGk1Nas0Wu','customer','456 New St','9876543210','2025-03-14 13:49:42','2025-03-14 13:49:42'),(3,'someotheruser','newuser1@example.com','$2b$10$gQQW1JDiWvHkJ/qwE3hHmetnKoyMKPwB17mk/UuqhE5NYl8CuK1lq','customer','456 New St','9876543210','2025-03-14 14:16:27','2025-03-14 14:16:27'),(5,'user2','user2@email.com','$2b$10$038zPI3qF5S2eoPYOlbDDelYGTmsbaIUg60gv0MeC/ozp64Sn5xYu','customer','456 New St','9876543210','2025-03-21 01:44:31','2025-03-21 01:44:31'),(6,'john.doe_541712','john.doe@email.com','$2b$10$6xoso3.mvIqeR0Zm44jmJuH57hf6DMC1qUPbP2siM3qUiRgQJbEC2','customer',NULL,NULL,'2025-03-21 02:05:41','2025-03-21 02:05:41'),(7,'idontcare_242986','idontcare@example.com','$2b$10$y9SnIbezrzXCTNP7SKIvEuc4uvG2S2ia6MDnSkPWdHbmrMFwPmuhO','customer',NULL,NULL,'2025-03-21 16:23:21','2025-03-21 16:23:21'),(8,'asd_547250','asd@asd.com','$2b$10$5amst0ineX76Ug5PdPgT3.w0AtHPtSGkgaWaZ38lyaswsrztS.jBS','customer',NULL,NULL,'2025-03-21 16:26:19','2025-03-21 16:26:19'),(9,'somethingweird_632814','somethingweird@gmail.com','$2b$10$muHJq8K.H.cAyh3sTm15Qeko0lZQ.6/PMKXczKx3zyCZuEVTf2Hm6','customer',NULL,NULL,'2025-03-21 16:31:59','2025-03-21 16:31:59'),(10,'asdfasd_202798','asdfasd@gasfds.com','$2b$10$.WtFL5MmtuGmtK52FY42w.f1uHJJyAURFvkSWHwNa5mXTaTAfEDYC','customer',NULL,NULL,'2025-03-21 16:34:14','2025-03-21 16:34:14'),(11,'something1_399495','something1@example.com','$2b$10$jTGFmf02H2Yn5rZjYLBRBO/8xHOj0apxGWl3I.ldtlx1DW6Q/.u0q','customer',NULL,NULL,'2025-03-31 14:05:30','2025-03-31 14:05:30'),(12,'something2_905353','something2@example.com','$2b$10$SaQ8ur0kL/2SY8xvKh8MYOKTzHUOlYEuyMzr5nEi7d0hlyYTye0ti','customer',NULL,NULL,'2025-03-31 14:14:06','2025-03-31 14:14:06'),(13,'person5_150515','person5@gm.com','$2b$10$XqHWbFwyZHby76qJVigYAeAr8e5cCdbw6TYU5UZknhCQ6KN4V3nDy','customer',NULL,NULL,'2025-03-31 14:16:40','2025-03-31 14:16:40'),(14,'person6_524040','person6@gm.com','$2b$10$YmyF4hgEk4FAsUJBLaIUEuaLYu/MzjQ9zGNqO12EEQQf342pJebhq','customer',NULL,NULL,'2025-03-31 14:23:52','2025-03-31 14:23:52'),(15,'arya_940271','arya@gmail.com','$2b$10$f86BbAP9QLcwghHyiPEucucreMO878xGXZUNox3EszGcuRiS4lIV2','customer',NULL,NULL,'2025-04-05 13:20:06','2025-04-05 13:20:06'),(16,'jane_smith','jane.smith@email.com','$2b$10$ul6lIoQFrGLHtbkGXwvxxedT/1nqFFKQUOqy7gQPngWpqfDNGt3KS','customer','456 Oak Ave, Somecity, Canada','987-654-3210','2025-04-15 18:10:00','2025-04-15 18:10:00'),(17,'michael_brown','michael.brown@email.com','$2b$10$ul6lIoQFrGLHtbkGXwvxxedT/1nqFFKQUOqy7gQPngWpqfDNGt3KS','customer','789 Pine Ln, Otherville, UK','+44 20 1234 5678','2025-04-15 18:10:00','2025-04-15 18:10:00'),(18,'emily_wilson','emily.wilson@email.com','$2b$10$ul6lIoQFrGLHtbkGXwvxxedT/1nqFFKQUOqy7gQPngWpqfDNGt3KS','customer','101 Elm Rd, Faraway, Australia','+61 2 9876 5432','2025-04-15 18:10:00','2025-04-15 18:10:00'),(19,'david88','david88@email.com','$2b$10$ul6lIoQFrGLHtbkGXwvxxedT/1nqFFKQUOqy7gQPngWpqfDNGt3KS','customer','222 Maple Dr, Townsville, Germany','+49 30 1234567','2025-04-15 18:10:00','2025-04-15 18:10:00'),(20,'sarah_jones','sarah.jones@email.com','$2b$10$ul6lIoQFrGLHtbkGXwvxxedT/1nqFFKQUOqy7gQPngWpqfDNGt3KS','customer','333 Willow Ct, Villagetown, France','+33 1 23 45 67 89','2025-04-15 18:10:00','2025-04-15 18:10:00'),(21,'kevin_miller','kevin.miller@email.com','$2b$10$ul6lIoQFrGLHtbkGXwvxxedT/1nqFFKQUOqy7gQPngWpqfDNGt3KS','customer','444 Birch St, Countryside, Italy','+39 06 12345678','2025-04-15 18:10:00','2025-04-15 18:10:00'),(22,'jessica_davis','jessica.davis@email.com','$2b$10$ul6lIoQFrGLHtbkGXwvxxedT/1nqFFKQUOqy7gQPngWpqfDNGt3KS','customer','555 Oakwood Ave, Hilltop, Spain','+34 91 123 45 67','2025-04-15 18:10:00','2025-04-15 18:10:00'),(23,'andrew_garcia','andrew.garcia@email.com','$2b$10$ul6lIoQFrGLHtbkGXwvxxedT/1nqFFKQUOqy7gQPngWpqfDNGt3KS','customer','666 Pinecrest Ln, Lakeside, Netherlands','+31 20 1234567','2025-04-15 18:10:00','2025-04-15 18:10:00'),(24,'olivia_rodriguez','olivia.rodriguez@email.com','$2b$10$ul6lIoQFrGLHtbkGXwvxxedT/1nqFFKQUOqy7gQPngWpqfDNGt3KS','customer','777 River Rd, Mountainview, Sweden','+46 8 123 45 67','2025-04-15 18:10:00','2025-04-15 18:10:00'),(25,'mehmet_kaya','mehmet.kaya@email.com','$2b$10$ul6lIoQFrGLHtbkGXwvxxedT/1nqFFKQUOqy7gQPngWpqfDNGt3KS','customer','Istanbul, Turkey','+90 555 123 45 67','2025-04-15 18:10:00','2025-04-15 18:10:00'),(26,'ayse_demir','ayse.demir@email.com','$2b$10$ul6lIoQFrGLHtbkGXwvxxedT/1nqFFKQUOqy7gQPngWpqfDNGt3KS','customer','Ankara, Turkey','+90 532 987 65 43','2025-04-15 18:10:00','2025-04-15 18:10:00'),(27,'thomas_white','thomas.white@email.com','$2b$10$ul6lIoQFrGLHtbkGXwvxxedT/1nqFFKQUOqy7gQPngWpqfDNGt3KS','salesManager','888 Forest Dr, Valleyview, USA','456-789-0123','2025-04-15 18:10:00','2025-04-15 18:10:00'),(28,'laura_hall','laura.hall@email.com','$2b$10$ul6lIoQFrGLHtbkGXwvxxedT/1nqFFKQUOqy7gQPngWpqfDNGt3KS','salesManager','999 Ocean Blvd, Seaside, Canada','321-654-0987','2025-04-15 18:10:00','2025-04-15 18:10:00'),(29,'ryan_adams','ryan.adams@email.com','$2b$10$ul6lIoQFrGLHtbkGXwvxxedT/1nqFFKQUOqy7gQPngWpqfDNGt3KS','productManager','111 Hill Rd, Summit, UK','+44 7700 900123','2025-04-15 18:10:00','2025-04-15 18:10:00'),(30,'sophia_baker','sophia.baker@email.com','$2b$10$ul6lIoQFrGLHtbkGXwvxxedT/1nqFFKQUOqy7gQPngWpqfDNGt3KS','productManager','222 Lake St, Clearwater, Australia','+61 4 9999 8888','2025-04-15 18:10:00','2025-04-15 18:10:00'),(31,'daniel_clark','daniel.clark@email.com','$2b$10$ul6lIoQFrGLHtbkGXwvxxedT/1nqFFKQUOqy7gQPngWpqfDNGt3KS','customer','333 Park Ave, Uptown, Germany','+49 176 12345678','2025-04-15 18:10:00','2025-04-15 18:10:00'),(32,'mia_lewis','mia.lewis@email.com','$2b$10$ul6lIoQFrGLHtbkGXwvxxedT/1nqFFKQUOqy7gQPngWpqfDNGt3KS','customer','444 Garden Ln, Downtown, France','+33 6 12 34 56 78','2025-04-15 18:10:00','2025-04-15 18:10:00'),(33,'ethan_young','ethan.young@email.com','$2b$10$ul6lIoQFrGLHtbkGXwvxxedT/1nqFFKQUOqy7gQPngWpqfDNGt3KS','customer','555 Main Rd, Eastside, Italy','+39 333 1234567','2025-04-15 18:10:00','2025-04-15 18:10:00'),(34,'ava_king','ava.king@email.com','$2b$10$ul6lIoQFrGLHtbkGXwvxxedT/1nqFFKQUOqy7gQPngWpqfDNGt3KS','customer','666 High St, Westend, Spain','+34 600 123 45 67','2025-04-15 18:10:00','2025-04-15 18:10:00'),(35,'WillThisWork','pleasework@gmail.com','$2b$10$4mFCqRRJx.tYz0ion1DTkOLk07nmEqLx8GCdW4/7nX0dfR/GUJfqK','customer',NULL,NULL,'2025-04-19 22:00:41','2025-04-19 22:00:41'),(36,'kourosh_before_demo','kourosh@demo.com','$2b$10$mZILQ2WwTbnYuYOHmZWi5./Mup1ClPvStp.t3tinjaULSayapDaK.','customer',NULL,NULL,'2025-04-28 04:21:51','2025-04-28 04:21:51'),(37,'kourosh_demo2','kourosh2@demo.com','$2b$10$jphDH/45OBE5Xe.d8JbynecXd3pcTsNi/8dx7N0jesvvZysobbTcW','customer',NULL,NULL,'2025-04-28 04:31:00','2025-04-28 04:31:00'),(38,'kourosh_demo3','kourosh3@demo.com','$2b$10$Yg98h8WygHIWfOlQcxyEDek0ckork.yw1cYqoAYMxK.Q6/hiVgmly','customer',NULL,NULL,'2025-04-28 04:44:12','2025-04-28 04:44:12'),(39,'kourosh_where_am_i','kerem@kerem.com','$2b$10$ArgShgqb5dScgUstGBcsueGBVz/12VxHfMtFPPYioyNBw4nVhicyK','customer',NULL,NULL,'2025-04-28 05:06:59','2025-04-28 05:06:59'),(40,'kourosh_demo4','kourosh@kourosh.com','$2b$10$QnFphdvY.f.oAWQxRRG/K.8riKP3tfVKZ.6JW4KykQggRHJ9W0jy6','customer',NULL,NULL,'2025-04-28 05:33:04','2025-04-28 05:33:04'),(41,'kourosh_demo5','kourosh@demo5.com','$2b$10$iUAVFNYTiOXqNrqTh/qfwes6KYaO/dNJqX6jA8PK2zoc6URkica7u','customer',NULL,NULL,'2025-04-28 06:28:55','2025-04-28 06:28:55'),(42,'kourosh_demo_day','kourosh@demoday.com','$2b$10$VzuLBaotpYd5hFJKXYdN5utndwjus8RLYp5offtkBNeodr3UBAz0K','customer',NULL,NULL,'2025-04-28 07:29:17','2025-04-28 07:29:17'),(43,'unitTestDidn\'tWork','nounittest@gmail.com','$2b$10$2nACujkcGqWMlGvaOvat2O2lQ4k9wOLlguC3Nt3/5yqmsoVVTwbtq','customer',NULL,NULL,'2025-04-28 19:50:22','2025-04-28 19:50:22'),(44,'testing_refactor_directories','refactor@directory.com','$2b$10$k6Bft8keouQ.0BjmvFChyeqbvCipnaxBsAFkRzUrPNjXXY991oGpa','customer',NULL,NULL,'2025-05-06 14:34:58','2025-05-06 14:34:58'),(45,'refactor_attempt2','refactor@attempt2.com','$2b$10$LYqTTbwjmrcdyFHTn1EZn.LffDXPnbF9XdoEQ5BkvpPh84SaETh9e','customer',NULL,NULL,'2025-05-06 14:37:56','2025-05-06 14:37:56'),(46,'monster_rooster','monster@rooster.com','$2b$10$8BGSsBdH29gQkBIQ/HHHne13P.uGWALRggg7yZMTpJ4kaU5wD6kbq','customer',NULL,NULL,'2025-05-07 07:48:10','2025-05-07 07:48:10'),(47,'ProdMan1','productmanager1@email.com','$2b$10$Vzc0hrwYVSRXH39qBxiT1eUDq8Ln2sSp7jnwvUTQvbSbkO6/2Bcm6','productManager','Ecommerce Headquarters','555-555-5555','2025-05-07 19:41:10','2025-05-07 19:41:10'),(48,'SalesMan1','salesmanager1@email.com','$2b$10$62S6O56ZdFA2F7WAwZlbUODJHPtI2tU4T9sLaxKmr9C1EsO9YOYMa','salesManager','Sales Branch','444-555-6666','2025-05-11 12:28:58','2025-05-11 12:28:58'),(49,'sadiq qara','sadig@gara.com','$2b$10$wkTGQy1uQZTrY9.fOPFhQufssUFAL1/BdqyAiFNq4ZZd/0A/N3in6','customer',NULL,NULL,'2025-05-11 16:24:24','2025-05-11 16:24:24'),(50,'testing_order_cancelling_247','testordercancel@247.com','$2b$10$cvR4r7UKBxH40BkTk6dEb.WY7tIHQr7FazgqWXyUia3yZmPb3WY6q','customer',NULL,NULL,'2025-05-21 20:03:05','2025-05-21 20:03:05'),(51,'test_return_255','test_return@255.com','$2b$10$6FBgNs/6Oy8bjPw8HMxfdOtMcfF1ItxSt4Wk1pc/24Ti0rrO849yK','customer',NULL,NULL,'2025-05-22 01:08:03','2025-05-22 01:08:03'),(52,'final_demo_v1','finaldemov1@email.com','$2b$10$zXM57Q/mDZBU0QvZ2dtp.OP0VG/6.jYDtfAORoJ88Px/JYXERso82','customer','Konyaaltı, Antalya, Turkey','+905321234567','2025-05-22 04:35:55','2025-05-22 04:37:19');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `variation_stock_view`
--

DROP TABLE IF EXISTS `variation_stock_view`;
/*!50001 DROP VIEW IF EXISTS `variation_stock_view`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `variation_stock_view` AS SELECT 
 1 AS `product_id`,
 1 AS `variation_id`,
 1 AS `serial_number`,
 1 AS `size_id`,
 1 AS `color_id`,
 1 AS `stock_quantity`,
 1 AS `stock_status`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `wishlists`
--

DROP TABLE IF EXISTS `wishlists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wishlists` (
  `wishlist_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `product_id` bigint unsigned NOT NULL,
  `variation_id` bigint unsigned DEFAULT NULL,
  `added_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`wishlist_id`),
  UNIQUE KEY `unique_wishlist_item` (`user_id`,`product_id`,`variation_id`),
  KEY `product_id` (`product_id`),
  KEY `variation_id` (`variation_id`),
  CONSTRAINT `wishlists_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `wishlists_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`),
  CONSTRAINT `wishlists_ibfk_3` FOREIGN KEY (`variation_id`) REFERENCES `product_variations` (`variation_id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wishlists`
--

LOCK TABLES `wishlists` WRITE;
/*!40000 ALTER TABLE `wishlists` DISABLE KEYS */;
INSERT INTO `wishlists` VALUES (5,6,10,NULL,'2025-05-17 18:23:20'),(7,6,15,NULL,'2025-05-17 18:24:38'),(9,6,8,NULL,'2025-05-17 18:54:01'),(10,47,8,NULL,'2025-05-18 20:08:38'),(11,47,6,NULL,'2025-05-18 20:24:20'),(12,2,7,NULL,'2025-05-19 21:35:06'),(13,2,6,NULL,'2025-05-19 21:47:27'),(16,50,2,NULL,'2025-05-21 21:22:30'),(17,2,13,NULL,'2025-05-21 23:38:02'),(18,2,10,NULL,'2025-05-21 23:38:21'),(19,52,19,NULL,'2025-05-22 04:50:36');
/*!40000 ALTER TABLE `wishlists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Final view structure for view `variation_stock_view`
--

/*!50001 DROP VIEW IF EXISTS `variation_stock_view`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `variation_stock_view` AS select `pv`.`product_id` AS `product_id`,`pv`.`variation_id` AS `variation_id`,`pv`.`serial_number` AS `serial_number`,`pv`.`size_id` AS `size_id`,`pv`.`color_id` AS `color_id`,`pv`.`stock_quantity` AS `stock_quantity`,(case when (`pv`.`stock_quantity` > 10) then 'In Stock' when (`pv`.`stock_quantity` > 0) then 'Low in Stock' else 'Out of Stock' end) AS `stock_status` from `product_variations` `pv` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-22  9:00:34
