-- MySQL dump 10.13  Distrib 8.0.30, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: zeerba
-- ------------------------------------------------------
-- Server version	8.0.30

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin_log`
--

DROP TABLE IF EXISTS `admin_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin_log` (
  `admlog_id` int NOT NULL AUTO_INCREMENT,
  `admlog_description` varchar(45) NOT NULL,
  `admuse_created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `admuse_id` int NOT NULL,
  PRIMARY KEY (`admlog_id`),
  KEY `FK_admlog_admuse_id` (`admuse_id`) /*!80000 INVISIBLE */,
  CONSTRAINT `FK_admlog_admuse_id` FOREIGN KEY (`admuse_id`) REFERENCES `admin_user` (`admuse_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_log`
--

LOCK TABLES `admin_log` WRITE;
/*!40000 ALTER TABLE `admin_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `admin_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admin_modules`
--

DROP TABLE IF EXISTS `admin_modules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin_modules` (
  `admmod_id` int NOT NULL AUTO_INCREMENT,
  `admmod_name` varchar(45) NOT NULL,
  `admmod_description` varchar(45) NOT NULL,
  PRIMARY KEY (`admmod_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_modules`
--

LOCK TABLES `admin_modules` WRITE;
/*!40000 ALTER TABLE `admin_modules` DISABLE KEYS */;
/*!40000 ALTER TABLE `admin_modules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admin_user`
--

DROP TABLE IF EXISTS `admin_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin_user` (
  `admuse_id` int NOT NULL AUTO_INCREMENT,
  `admuse_status` tinyint(1) NOT NULL,
  `admuse_user` varchar(45) NOT NULL,
  `admuse_user_hash` varchar(45) NOT NULL,
  `admuse_password` varchar(45) NOT NULL,
  `admuse_name` varchar(45) NOT NULL,
  `admuse_email` varchar(45) NOT NULL,
  `admuse_email_hash` varchar(45) NOT NULL,
  `admuse_photo` json DEFAULT NULL,
  `admuse_created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `admuse_updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`admuse_id`),
  UNIQUE KEY `UQ_admuse_user` (`admuse_user`),
  UNIQUE KEY `UQ_admuse_user_hash` (`admuse_user_hash`),
  KEY `IND_admuse_user_hash` (`admuse_user_hash`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_user`
--

LOCK TABLES `admin_user` WRITE;
/*!40000 ALTER TABLE `admin_user` DISABLE KEYS */;
INSERT INTO `admin_user` VALUES (1,1,'gerson','2e3746e131d178d04609038957bfa567','e10adc3949ba59abbe56e057f20f883e','Gerson','gersonoviedo@artistshot.com','73f3b6bf7ab3b790978d9b329015a0cd',NULL,'2022-06-01 16:09:24','2022-06-01 16:09:24');
/*!40000 ALTER TABLE `admin_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admin_user_modules`
--

DROP TABLE IF EXISTS `admin_user_modules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin_user_modules` (
  `admusemod_id` int NOT NULL AUTO_INCREMENT,
  `admusemod_status` varchar(45) NOT NULL,
  `admmod_id` int NOT NULL,
  `admuse_id` int NOT NULL,
  PRIMARY KEY (`admusemod_id`),
  KEY `FK_admusemod_admmod_id` (`admmod_id`) /*!80000 INVISIBLE */,
  KEY `FK_admusemod_admuse_id` (`admuse_id`),
  CONSTRAINT `FK_admusemod_admmod_id` FOREIGN KEY (`admmod_id`) REFERENCES `admin_modules` (`admmod_id`),
  CONSTRAINT `FK_admusemod_admuse_id` FOREIGN KEY (`admuse_id`) REFERENCES `admin_user` (`admuse_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_user_modules`
--

LOCK TABLES `admin_user_modules` WRITE;
/*!40000 ALTER TABLE `admin_user_modules` DISABLE KEYS */;
/*!40000 ALTER TABLE `admin_user_modules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `cat_id` int NOT NULL AUTO_INCREMENT,
  `cat_name` varchar(45) NOT NULL,
  `cat_status` tinyint(1) NOT NULL,
  `cat_sort` tinyint(1) NOT NULL,
  `cat_title` varchar(200) NOT NULL,
  `cat_description` text,
  `cat_image` json DEFAULT NULL,
  `cat_created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `cat_updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`cat_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,'Digital',1,1,'Digital Art','Digital description','\"\"','2022-05-10 16:32:21','2022-05-10 16:32:21'),(2,'Mugs',1,2,'Mugs','Travel mugs','\"\"','2022-05-11 15:05:55','2022-05-11 15:05:55'),(3,'testing 2',1,32,'Testing Products11','Testing Products 121 21 21 212121 ',NULL,'2022-05-13 19:07:21','2022-06-03 16:31:16'),(4,'This is a test',3,12,'New product category','Required description',NULL,'2022-06-03 16:32:08','2022-06-03 16:33:45'),(5,'Men Hoodies',1,22,'Men Hoodies category','This is a description of men hoodies',NULL,'2022-06-03 16:33:34','2022-06-03 16:33:34');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `configuration_design_web`
--

DROP TABLE IF EXISTS `configuration_design_web`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `configuration_design_web` (
  `condenweb_id` int NOT NULL AUTO_INCREMENT,
  `condenweb_head_favicon` json DEFAULT NULL,
  `condenweb_head_title` varchar(500) DEFAULT NULL,
  `condenweb_head_title_prefix` varchar(500) DEFAULT NULL,
  `condenweb_head_title_sufix` varchar(500) DEFAULT NULL,
  `condenweb_head_description` varchar(500) DEFAULT NULL,
  `condenweb_head_keywords` varchar(500) DEFAULT NULL,
  `condenweb_head_robots` varchar(100) DEFAULT NULL,
  `condenweb_head_scripts` longtext,
  `condenweb_header_logo` json DEFAULT NULL,
  `condenweb_header_logo_alt` varchar(100) DEFAULT NULL,
  `condenweb_header_welcome_text` varchar(200) DEFAULT NULL,
  `condenweb_footer_copyright` varchar(200) DEFAULT NULL,
  `condenweb_footer_html` longtext,
  `condenweb_created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `condenweb_updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`condenweb_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `configuration_design_web`
--

LOCK TABLES `configuration_design_web` WRITE;
/*!40000 ALTER TABLE `configuration_design_web` DISABLE KEYS */;
INSERT INTO `configuration_design_web` VALUES (2,'{\"resized\": [{\"file\": {\"key\": \"assets/site/configuration/favicon/favicon-16x16.png\", \"bucket\": \"zeerba-bucket-development\", \"region\": \"us-west-1\", \"baseUrl\": \"https://zeerba-bucket-development.s3.us-west-1.amazonaws.com\"}, \"dimensions\": \"16x16\"}, {\"file\": {\"key\": \"assets/site/configuration/favicon/favicon-32x32.png\", \"bucket\": \"zeerba-bucket-development\", \"region\": \"us-west-1\", \"baseUrl\": \"https://zeerba-bucket-development.s3.us-west-1.amazonaws.com\"}, \"dimensions\": \"32x32\"}, {\"file\": {\"key\": \"assets/site/configuration/favicon/favicon-180x180.png\", \"bucket\": \"zeerba-bucket-development\", \"region\": \"us-west-1\", \"baseUrl\": \"https://zeerba-bucket-development.s3.us-west-1.amazonaws.com\"}, \"dimensions\": \"180x180\"}], \"original\": {\"key\": \"assets/site/configuration/favicon/favicon.png\", \"bucket\": \"zeerba-bucket-development\", \"region\": \"us-west-1\", \"baseUrl\": \"https://zeerba-bucket-development.s3.us-west-1.amazonaws.com\"}}','111 1112...','222 222','333 333','444 444','555 555','NOINDEX,FOLLOW','666 666','{\"resized\": [{\"file\": {\"key\": \"assets/site/configuration/logo/logo-200x200.png\", \"bucket\": \"zeerba-bucket-development\", \"region\": \"us-west-1\", \"baseUrl\": \"https://zeerba-bucket-development.s3.us-west-1.amazonaws.com\"}, \"dimensions\": \"200x200\"}], \"original\": {\"key\": \"assets/site/configuration/logo/logo.png\", \"bucket\": \"zeerba-bucket-development\", \"region\": \"us-west-1\", \"baseUrl\": \"https://zeerba-bucket-development.s3.us-west-1.amazonaws.com\"}}','777 777...','888 888','999 999...','000 000','2022-06-01 14:35:07','2022-06-02 19:34:00'),(3,'{\"resized\": [{\"file\": {\"key\": \"assets/site/configuration/favicon/favicon-16x16.png\", \"bucket\": \"zeerba-bucket-development\", \"region\": \"us-west-1\", \"baseUrl\": \"https://zeerba-bucket-development.s3.us-west-1.amazonaws.com\"}, \"dimensions\": \"16x16\"}, {\"file\": {\"key\": \"assets/site/configuration/favicon/favicon-32x32.png\", \"bucket\": \"zeerba-bucket-development\", \"region\": \"us-west-1\", \"baseUrl\": \"https://zeerba-bucket-development.s3.us-west-1.amazonaws.com\"}, \"dimensions\": \"32x32\"}, {\"file\": {\"key\": \"assets/site/configuration/favicon/favicon-180x180.png\", \"bucket\": \"zeerba-bucket-development\", \"region\": \"us-west-1\", \"baseUrl\": \"https://zeerba-bucket-development.s3.us-west-1.amazonaws.com\"}, \"dimensions\": \"180x180\"}], \"original\": {\"key\": \"assets/site/configuration/favicon/favicon.png\", \"bucket\": \"zeerba-bucket-development\", \"region\": \"us-west-1\", \"baseUrl\": \"https://zeerba-bucket-development.s3.us-west-1.amazonaws.com\"}}','111 111.','222 222','333 333','444 444','555 555','NOINDEX,FOLLOW','666 666','{\"resized\": [{\"file\": {\"key\": \"assets/site/configuration/logo/logo-200x200.png\", \"bucket\": \"zeerba-bucket-development\", \"region\": \"us-west-1\", \"baseUrl\": \"https://zeerba-bucket-development.s3.us-west-1.amazonaws.com\"}, \"dimensions\": \"200x200\"}], \"original\": {\"key\": \"assets/site/configuration/logo/logo.png\", \"bucket\": \"zeerba-bucket-development\", \"region\": \"us-west-1\", \"baseUrl\": \"https://zeerba-bucket-development.s3.us-west-1.amazonaws.com\"}}','777 777','888 888','999 999','000 000','2022-06-01 15:34:50','2022-06-01 15:34:50');
/*!40000 ALTER TABLE `configuration_design_web` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `configuration_email_address`
--

DROP TABLE IF EXISTS `configuration_email_address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `configuration_email_address` (
  `conemaadd_id` int NOT NULL AUTO_INCREMENT,
  `conemaadd_general_contact_sender_name` varchar(200) NOT NULL,
  `conemaadd_general_contact_sender_email` varchar(200) NOT NULL,
  `conemaadd_customer_support_sender_name` varchar(200) NOT NULL,
  `conemaadd_customer_support_sender_email` varchar(200) NOT NULL,
  `conemaadd_designer_support_sender_name` varchar(200) NOT NULL,
  `conemaadd_designer_support_sender_email` varchar(200) NOT NULL,
  `conemaadd_sales_sender_name` varchar(200) NOT NULL,
  `conemaadd_sales_sender_email` varchar(200) NOT NULL,
  `conemaadd_address_verification_sender_name` varchar(200) NOT NULL,
  `conemaadd_address_verification_sender_email` varchar(200) NOT NULL,
  `conemaadd_logo_email` json DEFAULT NULL,
  `conemaadd_created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `conemaadd_updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`conemaadd_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `configuration_email_address`
--

LOCK TABLES `configuration_email_address` WRITE;
/*!40000 ALTER TABLE `configuration_email_address` DISABLE KEYS */;
INSERT INTO `configuration_email_address` VALUES (1,'FABIAN SOTO','gersonoviedo@artistshot.com','GERSON OVIEDO ROJAS','gerson.oviedo@gmail.com','CALIFORNIA ADDRESS','gersonoviedo@artistshot.com','BODYSUIT BOB X3','gersonoviedo@artistshot.com','ADDRESS','cindy_caicedo@me.com','{\"resized\": [{\"file\": {\"key\": \"assets/site/configuration/emailLogo/emailLogo-200x200.png\", \"bucket\": \"zeerba-bucket-development\", \"region\": \"us-west-1\", \"baseUrl\": \"https://zeerba-bucket-development.s3.us-west-1.amazonaws.com\"}, \"dimensions\": \"200x200\"}], \"original\": {\"key\": \"assets/site/configuration/emailLogo/emailLogo.png\", \"bucket\": \"zeerba-bucket-development\", \"region\": \"us-west-1\", \"baseUrl\": \"https://zeerba-bucket-development.s3.us-west-1.amazonaws.com\"}}','2022-06-02 14:52:24','2022-06-02 19:34:59');
/*!40000 ALTER TABLE `configuration_email_address` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `configuration_email_address_1`
--

DROP TABLE IF EXISTS `configuration_email_address_1`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `configuration_email_address_1` (
  `conemaadd_id` int NOT NULL AUTO_INCREMENT,
  `conemaadd_status` tinyint(1) DEFAULT NULL,
  `conemaadd_type` varchar(45) NOT NULL,
  `conemaadd_name` varchar(200) NOT NULL,
  `conemaadd_email` varchar(200) NOT NULL,
  `conemaadd_created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `conemaadd_updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`conemaadd_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `configuration_email_address_1`
--

LOCK TABLES `configuration_email_address_1` WRITE;
/*!40000 ALTER TABLE `configuration_email_address_1` DISABLE KEYS */;
/*!40000 ALTER TABLE `configuration_email_address_1` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `configuration_general`
--

DROP TABLE IF EXISTS `configuration_general`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `configuration_general` (
  `congen_id` int NOT NULL AUTO_INCREMENT,
  `congen_store_name` varchar(100) NOT NULL,
  `congen_store_contact_telephone` varchar(100) NOT NULL,
  `congen_store_country` varchar(100) NOT NULL,
  `congen_store_contact_address` varchar(500) NOT NULL,
  `congen_created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `congen_updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`congen_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `configuration_general`
--

LOCK TABLES `configuration_general` WRITE;
/*!40000 ALTER TABLE `configuration_general` DISABLE KEYS */;
INSERT INTO `configuration_general` VALUES (4,'Zeerba Inc','18132051763','US','1800, Saratoga Avenue','2022-06-01 16:02:14','2022-06-02 19:33:40');
/*!40000 ALTER TABLE `configuration_general` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `configuration_payment_method_paypal`
--

DROP TABLE IF EXISTS `configuration_payment_method_paypal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `configuration_payment_method_paypal` (
  `conpaymetpay_id` int NOT NULL AUTO_INCREMENT,
  `conpaymetpay_status` tinyint(1) DEFAULT NULL,
  `conpaymetpay_title` varchar(200) DEFAULT NULL,
  `conpaymetpay_user` varchar(200) DEFAULT NULL,
  `conpaymetpay_password` varchar(200) DEFAULT NULL,
  `conpaymetpay_client_id` varchar(200) DEFAULT NULL,
  `conpaymetpay_secret` varchar(200) DEFAULT NULL,
  `conpaymetpay_mode` varchar(15) DEFAULT NULL,
  `conpaymetpay_sort` tinyint(1) DEFAULT NULL,
  `conpaymetpay_type` varchar(100) DEFAULT NULL,
  `conpaymetpay_created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `conpaymetpay_updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`conpaymetpay_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `configuration_payment_method_paypal`
--

LOCK TABLES `configuration_payment_method_paypal` WRITE;
/*!40000 ALTER TABLE `configuration_payment_method_paypal` DISABLE KEYS */;
INSERT INTO `configuration_payment_method_paypal` VALUES (1,1,'1113','222 222','333','444 444','555 555','sandbox',1,'cc','2022-06-01 20:21:21','2022-06-02 19:34:25'),(2,1,'1115','222 222','333','444 444','555 555','sandbox',2,'ec','2022-06-01 20:21:21','2022-06-02 19:34:25');
/*!40000 ALTER TABLE `configuration_payment_method_paypal` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `configuration_payment_method_stripe`
--

DROP TABLE IF EXISTS `configuration_payment_method_stripe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `configuration_payment_method_stripe` (
  `conpaymetstr_id` int NOT NULL AUTO_INCREMENT,
  `conpaymetstr_status` tinyint(1) NOT NULL,
  `conpaymetstr_title` varchar(100) NOT NULL,
  `conpaymetstr_secret_key` longtext NOT NULL,
  `conpaymetstr_publishable_key` longtext NOT NULL,
  `conpaymetstr_wallet_pay` int DEFAULT NULL,
  `conpaymetstr_created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `conpaymetstr_updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`conpaymetstr_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `configuration_payment_method_stripe`
--

LOCK TABLES `configuration_payment_method_stripe` WRITE;
/*!40000 ALTER TABLE `configuration_payment_method_stripe` DISABLE KEYS */;
INSERT INTO `configuration_payment_method_stripe` VALUES (1,1,'1114','222 222','333 333',1,'2022-06-01 20:21:21','2022-06-02 19:34:25');
/*!40000 ALTER TABLE `configuration_payment_method_stripe` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order`
--

DROP TABLE IF EXISTS `order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order` (
  `ord_id` int NOT NULL AUTO_INCREMENT,
  `ord_status` tinyint(1) NOT NULL,
  `ord_number` varchar(45) NOT NULL,
  `ord_date` datetime NOT NULL,
  `ord_billing_information` json NOT NULL,
  `ord_shipping_information` json NOT NULL,
  `ord_payment_method_information` json NOT NULL,
  `ord_product_information` json NOT NULL,
  `orduse_created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `orduse_updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `use_id` int DEFAULT NULL,
  PRIMARY KEY (`ord_id`),
  KEY `FK_ord_use_id` (`use_id`),
  CONSTRAINT `FK_ord_use_id` FOREIGN KEY (`use_id`) REFERENCES `user` (`use_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order`
--

LOCK TABLES `order` WRITE;
/*!40000 ALTER TABLE `order` DISABLE KEYS */;
/*!40000 ALTER TABLE `order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `pro_id` int NOT NULL AUTO_INCREMENT,
  `pro_status` tinyint(1) NOT NULL,
  `pro_name` varchar(100) NOT NULL,
  `pro_description` varchar(500) DEFAULT NULL,
  `pro_price` decimal(45,2) NOT NULL,
  `pro_images` json DEFAULT NULL,
  `pro_url` varchar(200) DEFAULT NULL,
  `pro_created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `pro_updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `use_id` int NOT NULL,
  `procat_id` int NOT NULL,
  `cat_id` int NOT NULL,
  PRIMARY KEY (`pro_id`),
  KEY `FK_pro_use_id` (`use_id`),
  KEY `FK_pro_procat_id` (`procat_id`),
  KEY `FK_pro_cat_id` (`cat_id`),
  CONSTRAINT `FK_pro_cat_id` FOREIGN KEY (`cat_id`) REFERENCES `category` (`cat_id`),
  CONSTRAINT `FK_pro_procat_id` FOREIGN KEY (`procat_id`) REFERENCES `product_category` (`procat_id`),
  CONSTRAINT `FK_pro_use_id` FOREIGN KEY (`use_id`) REFERENCES `user` (`use_id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (1,1,'product name','example description',12.49,NULL,NULL,'2022-05-10 16:32:40','2022-05-13 22:45:50',1,1,1),(2,1,'Unique Travel Mug','New travel mug for all kind of ocassions',29.95,NULL,NULL,'2022-05-11 16:36:48','2022-05-13 22:45:50',2,5,2),(3,1,'Testing product','',2.99,NULL,NULL,'2022-05-11 19:12:24','2022-05-13 22:45:50',1,2,1),(23,1,'Magic mug','A high quality polyester coated ceramic mug available in gloss finish. When mug is cold, the mug is black.  When the mug is hot (holding hot beverage), the mug turns white and any images that are sublimated onto the mug will appear.',20.00,'[{\"uid\": \"53b1a1c523cd\", \"file\": {\"resized\": {\"key\": \"assets/site/products/23/images/bd7a920f-9cdd-4b4a-b348-285d2fb385a6-1000x1000.png\", \"bucket\": \"zeerba-bucket-development\", \"region\": \"us-west-1\", \"baseUrl\": \"https://zeerba-bucket-development.s3.us-west-1.amazonaws.com\"}, \"original\": {\"key\": \"assets/site/products/23/images/86751d9a-274b-43ce-aff0-b439fabd841e.png\", \"bucket\": \"zeerba-bucket-development\", \"region\": \"us-west-1\", \"baseUrl\": \"https://zeerba-bucket-development.s3.us-west-1.amazonaws.com\"}}, \"index\": 0, \"primary\": false}, {\"uid\": \"e57dc641aee4\", \"file\": {\"resized\": {\"key\": \"assets/site/products/23/images/20e91f0f-c313-4e20-86a4-04600a45c1e4-1000x1000.png\", \"bucket\": \"zeerba-bucket-development\", \"region\": \"us-west-1\", \"baseUrl\": \"https://zeerba-bucket-development.s3.us-west-1.amazonaws.com\"}, \"original\": {\"key\": \"assets/site/products/23/images/d9de8f04-5617-4a5a-8453-0986af240449.png\", \"bucket\": \"zeerba-bucket-development\", \"region\": \"us-west-1\", \"baseUrl\": \"https://zeerba-bucket-development.s3.us-west-1.amazonaws.com\"}}, \"index\": 1, \"primary\": false}, {\"uid\": \"f95ce260b7f2\", \"file\": {\"resized\": {\"key\": \"assets/site/products/23/images/7c5b4e41-04c0-463d-a452-effc24c5ec5d-1000x1000.png\", \"bucket\": \"zeerba-bucket-development\", \"region\": \"us-west-1\", \"baseUrl\": \"https://zeerba-bucket-development.s3.us-west-1.amazonaws.com\"}, \"original\": {\"key\": \"assets/site/products/23/images/2b020236-a084-4cfa-8b57-bc75937b2615.png\", \"bucket\": \"zeerba-bucket-development\", \"region\": \"us-west-1\", \"baseUrl\": \"https://zeerba-bucket-development.s3.us-west-1.amazonaws.com\"}}, \"index\": 2, \"primary\": false}, {\"uid\": \"de2f24e591f9\", \"file\": {\"resized\": {\"key\": \"assets/site/products/23/images/5560fa8e-afb3-49b8-9c20-a311caaf84dd-1000x1000.png\", \"bucket\": \"zeerba-bucket-development\", \"region\": \"us-west-1\", \"baseUrl\": \"https://zeerba-bucket-development.s3.us-west-1.amazonaws.com\"}, \"original\": {\"key\": \"assets/site/products/23/images/cbfda4dd-c142-465f-96b0-890c8c8df926.png\", \"bucket\": \"zeerba-bucket-development\", \"region\": \"us-west-1\", \"baseUrl\": \"https://zeerba-bucket-development.s3.us-west-1.amazonaws.com\"}}, \"index\": 3, \"primary\": true}, {\"uid\": \"50122270b15b\", \"file\": {\"resized\": {\"key\": \"assets/site/products/23/images/8e3028ba-614c-4d7c-ae9d-e6934334058f-1000x1000.png\", \"bucket\": \"zeerba-bucket-development\", \"region\": \"us-west-1\", \"baseUrl\": \"https://zeerba-bucket-development.s3.us-west-1.amazonaws.com\"}, \"original\": {\"key\": \"assets/site/products/23/images/484361e7-8981-48fd-b24c-b7dbd4c717c0.png\", \"bucket\": \"zeerba-bucket-development\", \"region\": \"us-west-1\", \"baseUrl\": \"https://zeerba-bucket-development.s3.us-west-1.amazonaws.com\"}}, \"index\": 4, \"primary\": false}]',NULL,'2022-05-11 22:34:43','2022-05-25 14:44:41',3,5,2),(32,1,'Testing product','Testing product',12.99,NULL,'','2022-05-13 22:51:01','2022-05-13 22:51:01',1,2,3),(33,1,'Testing product','Testing product',12.00,NULL,'','2022-05-13 22:52:55','2022-05-13 22:52:55',1,2,3),(34,1,'Testing product','Testing product',12.00,NULL,'','2022-05-13 22:53:28','2022-05-13 23:08:52',1,2,3),(35,1,'Testing product1','Testing product',13.00,'[{\"uid\": \"1df0a97e137b\", \"file\": {\"resized\": {\"key\": \"assets/site/products/35/images/e6a82f7d-16db-4207-8ca2-832793a48f7c-1000x1000.png\", \"bucket\": \"zeerba-bucket-development\", \"region\": \"us-west-1\", \"baseUrl\": \"https://zeerba-bucket-development.s3.us-west-1.amazonaws.com\"}, \"original\": {\"key\": \"assets/site/products/35/images/9702fd1b-b608-4af9-89fc-518a1030bead.png\", \"bucket\": \"zeerba-bucket-development\", \"region\": \"us-west-1\", \"baseUrl\": \"https://zeerba-bucket-development.s3.us-west-1.amazonaws.com\"}}, \"index\": 0, \"primary\": false}, {\"uid\": \"38e23634ff16\", \"file\": {\"resized\": {\"key\": \"assets/site/products/35/images/4efffbca-3167-4d68-92c7-f7cdc3aabacd-1000x1000.png\", \"bucket\": \"zeerba-bucket-development\", \"region\": \"us-west-1\", \"baseUrl\": \"https://zeerba-bucket-development.s3.us-west-1.amazonaws.com\"}, \"original\": {\"key\": \"assets/site/products/35/images/74610ebb-6f5a-4a3a-b961-53de21e8243f.png\", \"bucket\": \"zeerba-bucket-development\", \"region\": \"us-west-1\", \"baseUrl\": \"https://zeerba-bucket-development.s3.us-west-1.amazonaws.com\"}}, \"index\": 1, \"primary\": false}, {\"uid\": \"35946e34c9ee\", \"file\": {\"resized\": {\"key\": \"assets/site/products/35/images/0fb391cb-793f-46d1-b188-6a67816b5bc1-1000x1000.png\", \"bucket\": \"zeerba-bucket-development\", \"region\": \"us-west-1\", \"baseUrl\": \"https://zeerba-bucket-development.s3.us-west-1.amazonaws.com\"}, \"original\": {\"key\": \"assets/site/products/35/images/407f0860-a3da-4a70-b3f4-f6b8f691a9f9.png\", \"bucket\": \"zeerba-bucket-development\", \"region\": \"us-west-1\", \"baseUrl\": \"https://zeerba-bucket-development.s3.us-west-1.amazonaws.com\"}}, \"index\": 2, \"primary\": false}, {\"uid\": \"1606ac56e577\", \"file\": {\"resized\": {\"key\": \"assets/site/products/35/images/3991fc8b-7851-43d2-b819-0bff14bf130f-1000x1000.png\", \"bucket\": \"zeerba-bucket-development\", \"region\": \"us-west-1\", \"baseUrl\": \"https://zeerba-bucket-development.s3.us-west-1.amazonaws.com\"}, \"original\": {\"key\": \"assets/site/products/35/images/3ad77539-710e-4d27-ae43-4c93ecb8fa4f.png\", \"bucket\": \"zeerba-bucket-development\", \"region\": \"us-west-1\", \"baseUrl\": \"https://zeerba-bucket-development.s3.us-west-1.amazonaws.com\"}}, \"index\": 3, \"primary\": true}, {\"uid\": \"9f1292ca4b6e\", \"file\": {\"resized\": {\"key\": \"assets/site/products/35/images/07dd792e-b346-49ef-894e-6229c6895c04-1000x1000.png\", \"bucket\": \"zeerba-bucket-development\", \"region\": \"us-west-1\", \"baseUrl\": \"https://zeerba-bucket-development.s3.us-west-1.amazonaws.com\"}, \"original\": {\"key\": \"assets/site/products/35/images/e20a3ca1-7641-4d03-b423-8b12654c79ba.png\", \"bucket\": \"zeerba-bucket-development\", \"region\": \"us-west-1\", \"baseUrl\": \"https://zeerba-bucket-development.s3.us-west-1.amazonaws.com\"}}, \"index\": 4, \"primary\": false}, {\"uid\": \"beb3a6c39fed\", \"file\": {\"resized\": {\"key\": \"assets/site/products/35/images/c111f62a-da62-4b6a-a57a-552def73475d-1000x1000.png\", \"bucket\": \"zeerba-bucket-development\", \"region\": \"us-west-1\", \"baseUrl\": \"https://zeerba-bucket-development.s3.us-west-1.amazonaws.com\"}, \"original\": {\"key\": \"assets/site/products/35/images/569cc931-a447-4ec4-98b4-23b05493d1e5.png\", \"bucket\": \"zeerba-bucket-development\", \"region\": \"us-west-1\", \"baseUrl\": \"https://zeerba-bucket-development.s3.us-west-1.amazonaws.com\"}}, \"index\": 5, \"primary\": false}]','','2022-05-13 23:10:18','2022-06-03 21:35:56',1,2,3),(36,3,'Testing product','Testing product. Testing product. Testing product. Testing product. Testing product. Testing product. Testing product. Testing product. ',23.00,'[{\"uid\": \"f85a2bf26359\", \"file\": {\"resized\": {\"key\": \"assets/site/products/36/images/16fa6a92-031e-48fa-a605-3f8558cb157c-1000x1000.png\", \"bucket\": \"zeerba-bucket-development\", \"region\": \"us-west-1\", \"baseUrl\": \"https://zeerba-bucket-development.s3.us-west-1.amazonaws.com\"}, \"original\": {\"key\": \"assets/site/products/36/images/bcf07d18-c83a-4bef-9fbd-bf6f77975991.png\", \"bucket\": \"zeerba-bucket-development\", \"region\": \"us-west-1\", \"baseUrl\": \"https://zeerba-bucket-development.s3.us-west-1.amazonaws.com\"}}, \"index\": 0, \"primary\": true}]','','2022-05-14 15:34:08','2022-05-25 13:52:54',1,5,3),(40,1,'Camper cup',NULL,33.00,'[{\"uid\": \"75ef93fbcd17\", \"file\": {\"resized\": {\"key\": \"assets/site/products/40/images/64e3574c-0b04-41de-89dd-bd98be113156-1000x1000.jpg\", \"bucket\": \"zeerba-bucket-development\", \"region\": \"us-west-1\", \"baseUrl\": \"https://zeerba-bucket-development.s3.us-west-1.amazonaws.com\"}, \"original\": {\"key\": \"assets/site/products/40/images/1362e893-519f-4f5d-b4d6-ba2748df4b71.jpg\", \"bucket\": \"zeerba-bucket-development\", \"region\": \"us-west-1\", \"baseUrl\": \"https://zeerba-bucket-development.s3.us-west-1.amazonaws.com\"}}, \"index\": 0, \"primary\": true}]','','2022-05-24 22:00:24','2022-05-24 22:00:26',1,5,2);
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_category`
--

DROP TABLE IF EXISTS `product_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_category` (
  `procat_id` int NOT NULL AUTO_INCREMENT,
  `procat_status` tinyint(1) NOT NULL,
  `procat_name` varchar(45) NOT NULL,
  `procat_created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `procat_updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`procat_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_category`
--

LOCK TABLES `product_category` WRITE;
/*!40000 ALTER TABLE `product_category` DISABLE KEYS */;
INSERT INTO `product_category` VALUES (1,1,'Dangle & Drop Earrings','2022-05-06 22:20:22','2022-05-06 22:20:22'),(2,3,'testing','2022-05-07 16:46:35','2022-05-09 18:48:12'),(3,1,'Printable product','2022-05-07 16:51:11','2022-05-09 16:29:56'),(4,3,'Testing','2022-05-10 13:27:34','2022-05-10 13:27:40'),(5,1,'Mugs..','2022-05-11 15:09:38','2022-05-11 15:09:38');
/*!40000 ALTER TABLE `product_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_category_option`
--

DROP TABLE IF EXISTS `product_category_option`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_category_option` (
  `procatopt_id` int NOT NULL AUTO_INCREMENT,
  `procatopt_status` tinyint(1) NOT NULL,
  `procatopt_name` varchar(45) NOT NULL,
  `procatopt_description` varchar(200) DEFAULT NULL,
  `procatopt_required` tinyint(1) DEFAULT NULL,
  `procatopt_options` json NOT NULL,
  `procat_id` int NOT NULL,
  `procatopt_created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `procatopt_updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`procatopt_id`),
  KEY `FK_procatopt_procat_id` (`procat_id`),
  CONSTRAINT `FK_procatopt_procat_id` FOREIGN KEY (`procat_id`) REFERENCES `product_category` (`procat_id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_category_option`
--

LOCK TABLES `product_category_option` WRITE;
/*!40000 ALTER TABLE `product_category_option` DISABLE KEYS */;
INSERT INTO `product_category_option` VALUES (26,1,'Primary Color','Primary and secondary color attributes are interchangeable so you can show shoppers that your item is multicolored. Skip secondary color if your item is only one color.',1,'[{\"uid\": \"65307deb98fb\", \"type\": \"select\", \"action\": \"update\", \"values\": [{\"uid\": \"b05b244cb84e\", \"value\": \"Red\", \"action\": \"update\"}, {\"uid\": \"1490d31c66bc\", \"value\": \"Orange\", \"action\": \"update\"}, {\"uid\": \"aabd0a1ced5e\", \"value\": \"Yellow\", \"action\": \"update\"}, {\"uid\": \"03f4997bb23e\", \"value\": \"Green\", \"action\": \"update\"}, {\"uid\": \"82ae9457cea7\", \"value\": \"Blue\", \"action\": \"update\"}]}]',1,'2022-05-09 21:00:20','2022-05-24 19:28:08'),(27,1,'Secondary Color',NULL,NULL,'[{\"uid\": \"430ebb84a9ec\", \"type\": \"select\", \"action\": \"update\", \"values\": [{\"uid\": \"58ad79321a6c\", \"value\": \"Golden\", \"action\": \"update\"}, {\"uid\": \"1db1bc0c24e6\", \"value\": \"Silver\", \"action\": \"update\"}]}]',1,'2022-05-09 21:13:41','2022-05-24 19:28:08'),(28,1,'Material',NULL,1,'[{\"uid\": \"5009cff5d523\", \"type\": \"checkbox\", \"action\": \"update\", \"values\": [{\"uid\": \"520cc391be2e\", \"value\": \"Ceramic\", \"action\": \"update\"}, {\"uid\": \"883ccf147384\", \"value\": \"Glass\", \"action\": \"update\"}, {\"uid\": \"bd9342cf4646\", \"value\": \"Metal\", \"action\": \"update\"}, {\"uid\": \"7092568a7b83\", \"value\": \"Plastic\", \"action\": \"update\"}, {\"uid\": \"91dbecb9b53c\", \"value\": \"Porcelain\", \"action\": \"update\"}, {\"uid\": \"fc25843ad89d\", \"value\": \"Stone\", \"action\": \"update\"}, {\"uid\": \"12426eff7861\", \"value\": \"Wood\", \"action\": \"update\"}]}]',5,'2022-05-11 15:09:38','2022-05-24 14:47:34'),(29,2,'Graphic',NULL,1,'[{\"uid\": \"bde792a7001e\", \"type\": \"select\", \"action\": \"update\", \"values\": [{\"uid\": \"19500f6deb49\", \"value\": \"Abstract & geometry\", \"action\": \"update\"}, {\"uid\": \"bc360031039f\", \"value\": \"Animal\", \"action\": \"update\"}, {\"uid\": \"e857469a6236\", \"value\": \"Anime & Cartoon\", \"action\": \"update\"}, {\"uid\": \"2b1a38fef6a8\", \"value\": \"Beach & tropical\", \"action\": \"update\"}]}]',5,'2022-05-11 15:09:38','2022-05-24 20:34:44'),(30,1,'Capacity',NULL,NULL,'[{\"uid\": \"31bca5e5e374\", \"type\": \"input\", \"action\": \"update\", \"values\": []}, {\"uid\": \"d9be3b863157\", \"type\": \"select\", \"action\": \"update\", \"values\": [{\"uid\": \"148be9f91207\", \"value\": \"Ounces\", \"action\": \"update\"}, {\"uid\": \"0e5e9986d65a\", \"value\": \"Liters\", \"action\": \"update\"}]}]',5,'2022-05-11 15:09:38','2022-05-20 13:14:53'),(31,1,'Handle',NULL,NULL,'[{\"uid\": \"b18b0556bcf0\", \"type\": \"radio\", \"action\": \"update\", \"values\": [{\"uid\": \"2fd8f3201a60\", \"value\": \"Yes\", \"action\": \"update\"}, {\"uid\": \"acc5fa652c86\", \"value\": \"No\", \"action\": \"update\"}]}]',5,'2022-05-11 15:09:38','2022-05-20 13:14:53');
/*!40000 ALTER TABLE `product_category_option` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_category_option_value`
--

DROP TABLE IF EXISTS `product_category_option_value`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_category_option_value` (
  `procatoptval_id` int NOT NULL AUTO_INCREMENT,
  `procatoptval_value` json NOT NULL,
  `procatoptval_created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `procatoptval_updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `procatopt_id` int NOT NULL,
  `pro_id` int NOT NULL,
  PRIMARY KEY (`procatoptval_id`),
  KEY `FK_procatoptval_procatopt_id` (`procatopt_id`),
  KEY `FK_procatoptval_pro_id` (`pro_id`),
  CONSTRAINT `FK_procatoptval_pro_id` FOREIGN KEY (`pro_id`) REFERENCES `product` (`pro_id`),
  CONSTRAINT `FK_procatoptval_procatopt_id` FOREIGN KEY (`procatopt_id`) REFERENCES `product_category_option` (`procatopt_id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_category_option_value`
--

LOCK TABLES `product_category_option_value` WRITE;
/*!40000 ALTER TABLE `product_category_option_value` DISABLE KEYS */;
INSERT INTO `product_category_option_value` VALUES (13,'{\"5009cff5d523\": {\"12426eff7861\": false, \"520cc391be2e\": true, \"7092568a7b83\": false, \"883ccf147384\": false, \"91dbecb9b53c\": false, \"bd9342cf4646\": false, \"fc25843ad89d\": true}}','2022-05-23 16:41:11','2022-05-24 22:28:28',28,23),(14,'{\"bde792a7001e\": \"19500f6deb49\"}','2022-05-23 16:41:11','2022-05-24 20:24:01',29,23),(15,'{\"31bca5e5e374\": \"\", \"d9be3b863157\": \"148be9f91207\"}','2022-05-23 16:41:11','2022-05-24 22:02:22',30,23),(16,'{\"b18b0556bcf0\": \"acc5fa652c86\"}','2022-05-23 16:41:11','2022-05-24 22:28:35',31,23),(18,'{\"65307deb98fb\": \"b05b244cb84e\"}','2022-05-24 20:14:45','2022-05-24 20:46:01',26,23),(19,'{\"430ebb84a9ec\": \"58ad79321a6c\"}','2022-05-24 20:14:45','2022-05-24 20:14:45',27,23),(23,'{\"5009cff5d523\": {\"12426eff7861\": true, \"520cc391be2e\": true, \"7092568a7b83\": false, \"883ccf147384\": false, \"91dbecb9b53c\": false, \"bd9342cf4646\": false, \"fc25843ad89d\": true}}','2022-05-24 22:00:26','2022-05-24 22:00:26',28,40),(24,'{\"31bca5e5e374\": \"\", \"d9be3b863157\": \"\"}','2022-05-24 22:00:26','2022-05-24 22:00:26',30,40),(25,'{\"b18b0556bcf0\": \"2fd8f3201a60\"}','2022-05-24 22:00:26','2022-05-24 22:00:26',31,40);
/*!40000 ALTER TABLE `product_category_option_value` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_sale`
--

DROP TABLE IF EXISTS `product_sale`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_sale` (
  `prosal_id` int NOT NULL AUTO_INCREMENT,
  `ord_id` int NOT NULL,
  `pro_id` int DEFAULT NULL,
  `prosal_price` decimal(45,2) NOT NULL,
  `prosal_created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`prosal_id`),
  KEY `FK_prosal_pro_id` (`pro_id`),
  KEY `FK_prosal_ord_id` (`ord_id`),
  CONSTRAINT `FK_prosal_ord_id` FOREIGN KEY (`ord_id`) REFERENCES `order` (`ord_id`),
  CONSTRAINT `FK_prosal_pro_id` FOREIGN KEY (`pro_id`) REFERENCES `product` (`pro_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_sale`
--

LOCK TABLES `product_sale` WRITE;
/*!40000 ALTER TABLE `product_sale` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_sale` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_tag`
--

DROP TABLE IF EXISTS `product_tag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_tag` (
  `protag_id` int NOT NULL AUTO_INCREMENT,
  `tag_id` int NOT NULL,
  `pro_id` int NOT NULL,
  PRIMARY KEY (`protag_id`),
  KEY `FK_protag_tag_id` (`tag_id`),
  KEY `FK_protag_pro_id` (`pro_id`),
  CONSTRAINT `FK_protag_pro_id` FOREIGN KEY (`pro_id`) REFERENCES `product` (`pro_id`),
  CONSTRAINT `FK_protag_tag_id` FOREIGN KEY (`tag_id`) REFERENCES `tag` (`tag_id`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_tag`
--

LOCK TABLES `product_tag` WRITE;
/*!40000 ALTER TABLE `product_tag` DISABLE KEYS */;
INSERT INTO `product_tag` VALUES (10,12,23),(13,15,23),(16,18,23),(17,19,23),(18,2,23),(22,1,2),(24,26,2),(25,27,2),(26,21,2),(42,43,32),(43,44,32),(44,45,32),(45,44,33),(46,43,33),(47,44,34),(48,43,34),(49,43,35),(50,43,36),(51,46,23),(61,1,40),(62,53,40),(63,54,40);
/*!40000 ALTER TABLE `product_tag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shopping_cart`
--

DROP TABLE IF EXISTS `shopping_cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shopping_cart` (
  `shocar_id` int NOT NULL,
  `shocar_status` tinyint(1) DEFAULT NULL,
  `shocar_information` longtext,
  `shocar_total` decimal(45,2) DEFAULT NULL,
  `shocar_ip` varchar(200) DEFAULT NULL,
  `shocar_browser` varchar(250) DEFAULT NULL,
  `shocar_platform` varchar(100) DEFAULT NULL,
  `shocar_discount` longtext,
  `shocar_created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `shocar_updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `use_id` int DEFAULT NULL,
  PRIMARY KEY (`shocar_id`),
  KEY `FK_shocar_use_id` (`use_id`),
  CONSTRAINT `FK_shocar_use_id` FOREIGN KEY (`use_id`) REFERENCES `user` (`use_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shopping_cart`
--

LOCK TABLES `shopping_cart` WRITE;
/*!40000 ALTER TABLE `shopping_cart` DISABLE KEYS */;
/*!40000 ALTER TABLE `shopping_cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tag`
--

DROP TABLE IF EXISTS `tag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tag` (
  `tag_id` int NOT NULL AUTO_INCREMENT,
  `tag_name` varchar(30) NOT NULL,
  `tag_created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `tag_updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`tag_id`),
  UNIQUE KEY `tag_name_UNIQUE` (`tag_name`),
  KEY `IND_tag_name` (`tag_name`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tag`
--

LOCK TABLES `tag` WRITE;
/*!40000 ALTER TABLE `tag` DISABLE KEYS */;
INSERT INTO `tag` VALUES (1,'mug','2022-05-11 21:41:14','2022-05-11 21:41:14'),(2,'cool','2022-05-11 21:41:14','2022-05-11 21:41:14'),(3,'set','2022-05-11 21:41:14','2022-05-11 21:41:14'),(12,'magic','2022-05-11 22:34:43','2022-05-11 22:34:43'),(13,'coated','2022-05-11 22:34:43','2022-05-11 22:34:43'),(14,'gloss','2022-05-11 22:34:43','2022-05-11 22:34:43'),(15,'black','2022-05-11 22:34:43','2022-05-11 22:34:43'),(18,'people','2022-05-12 20:59:39','2022-05-12 20:59:39'),(19,'must','2022-05-12 20:59:39','2022-05-12 20:59:39'),(20,'colombia','2022-05-12 21:07:15','2022-05-12 21:07:15'),(21,'bucaramanga','2022-05-12 21:22:04','2022-05-12 21:22:04'),(22,'santander','2022-05-12 21:22:04','2022-05-12 21:22:04'),(23,'buc','2022-05-12 21:22:52','2022-05-12 21:22:52'),(24,'san','2022-05-12 21:22:52','2022-05-12 21:22:52'),(25,'travel','2022-05-12 21:30:38','2022-05-12 21:30:38'),(26,'unique','2022-05-12 21:30:38','2022-05-12 21:30:38'),(27,'yoyo','2022-05-12 22:03:23','2022-05-12 22:03:23'),(43,'test','2022-05-13 22:51:01','2022-05-13 22:51:01'),(44,'product','2022-05-13 22:51:01','2022-05-13 22:51:01'),(45,'images','2022-05-13 22:51:01','2022-05-13 22:51:01'),(46,'red','2022-05-24 14:43:22','2022-05-24 14:43:22'),(53,'camper','2022-05-24 22:00:24','2022-05-24 22:00:24'),(54,'cup','2022-05-24 22:00:24','2022-05-24 22:00:24');
/*!40000 ALTER TABLE `tag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `use_id` int NOT NULL AUTO_INCREMENT,
  `use_status` tinyint(1) NOT NULL,
  `use_user` varchar(100) NOT NULL,
  `use_user_hash` varchar(100) NOT NULL,
  `use_name` varchar(100) NOT NULL,
  `use_email` varchar(100) NOT NULL,
  `use_email_hash` varchar(100) NOT NULL,
  `use_password` varchar(100) NOT NULL,
  `use_gender` varchar(1) NOT NULL,
  `use_photo` json DEFAULT NULL,
  `use_created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `use_updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`use_id`),
  UNIQUE KEY `UQ_use_user` (`use_user`) /*!80000 INVISIBLE */,
  UNIQUE KEY `UQ_use_user_hash` (`use_user_hash`),
  KEY `IND_use_user_hash` (`use_user_hash`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,2,'gerson','2e3746e131d178d04609038957bfa567','Gerson Oviedo','gerson.oviedo@gmail.com','a9b7b9e0d9d3eaafb0070ee93f009718','8a89ab039bb7430b0ce91faee1981953','m',NULL,'2022-05-07 16:18:49','2022-05-07 16:18:49'),(2,1,'josesanz','265065c8e83247e4eff9983df2bbe1b7','Jose Sanz','josesanz@artistshot.com','a7cbf1144dfe0280ea662f8eb328837e','b3562d637edbfa895002735ac6bb5b8c','m',NULL,'2022-05-10 20:50:01','2022-05-10 20:50:01'),(3,1,'jorgeortiz','de774e0a50145ef723aa8bdc5dae52f1','Jorge Ortiz','jorgeortiz@artistshot.com','bcf9ecb41dcd7a88cf4a0e4703ea2998','4c4714ff367fda0edf90ae2cd373216f','m',NULL,'2022-05-10 20:50:35','2022-05-10 20:50:35'),(4,2,'wilsoncarrillo','3af4efefeb271bdad7fcc95595ebedb2','Wilson Carrillo','wilsoncarrillo@artistshot.com','13ecb8a40645b133d9e333f75c75b665','48810c1f2aa4bacd22ee01a5bda6c282','m',NULL,'2022-05-10 20:51:03','2022-05-10 20:51:03');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_address`
--

DROP TABLE IF EXISTS `user_address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_address` (
  `useadd_id` int NOT NULL AUTO_INCREMENT,
  `useadd_status` tinyint(1) NOT NULL,
  `useadd_title` varchar(45) NOT NULL,
  `useadd_name` varchar(100) NOT NULL,
  `useadd_telephone` varchar(45) NOT NULL,
  `useadd_fax` varchar(45) DEFAULT NULL,
  `useadd_street` varchar(100) NOT NULL,
  `useadd_country` varchar(45) NOT NULL,
  `useadd_state` varchar(45) NOT NULL,
  `useadd_city` varchar(45) NOT NULL,
  `useadd_zipcode` varchar(45) DEFAULT NULL,
  `useadd_type` varchar(45) NOT NULL,
  `useadd_created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `useadd_updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `useadd_default` tinyint(1) DEFAULT NULL,
  `use_id` int DEFAULT NULL,
  PRIMARY KEY (`useadd_id`),
  KEY `FK_useadd_use_id` (`use_id`),
  CONSTRAINT `FK_useadd_use_id` FOREIGN KEY (`use_id`) REFERENCES `user` (`use_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_address`
--

LOCK TABLES `user_address` WRITE;
/*!40000 ALTER TABLE `user_address` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_address` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-12-21 15:51:30
