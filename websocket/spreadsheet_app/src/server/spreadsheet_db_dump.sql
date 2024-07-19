-- MySQL dump 10.13  Distrib 8.0.37, for Linux (x86_64)
--
-- Host: localhost    Database: spreadsheet_db
-- ------------------------------------------------------
-- Server version	8.0.37-0ubuntu0.24.04.1

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
-- Table structure for table `Columns`
--

DROP TABLE IF EXISTS `Columns`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Columns` (
  `id` int NOT NULL AUTO_INCREMENT,
  `label` varchar(255) NOT NULL,
  `accessor` varchar(255) NOT NULL,
  `dataType` enum('text','select','number') NOT NULL,
  `options` json DEFAULT NULL,
  `minWidth` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Columns`
--

LOCK TABLES `Columns` WRITE;
/*!40000 ALTER TABLE `Columns` DISABLE KEYS */;
INSERT INTO `Columns` VALUES (1,'First Name','firstName','text','[]',100),(2,'Last Name','lastName','text','[]',100),(3,'Age','age','number','[]',80),(4,'E-Mail','email','text','[]',300),(5,'Music Preference','music','select','[\"rnb\", \"rock\"]',200);
/*!40000 ALTER TABLE `Columns` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Responses`
--

DROP TABLE IF EXISTS `Responses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Responses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `response` varchar(255) NOT NULL,
  `sheetColumnId` int NOT NULL,
  `rowId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sheetColumnId` (`sheetColumnId`),
  CONSTRAINT `Responses_ibfk_1` FOREIGN KEY (`sheetColumnId`) REFERENCES `SheetsColumns` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Responses`
--

LOCK TABLES `Responses` WRITE;
/*!40000 ALTER TABLE `Responses` DISABLE KEYS */;
INSERT INTO `Responses` VALUES (1,'jeremy',1,1),(2,'xu',2,1),(3,'rnb',3,1),(4,'John',1,2),(5,'Doe',2,2),(6,'Rachel',4,1),(7,'Wong',5,1);
/*!40000 ALTER TABLE `Responses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SequelizeMeta`
--

DROP TABLE IF EXISTS `SequelizeMeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SequelizeMeta` (
  `name` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SequelizeMeta`
--

LOCK TABLES `SequelizeMeta` WRITE;
/*!40000 ALTER TABLE `SequelizeMeta` DISABLE KEYS */;
INSERT INTO `SequelizeMeta` VALUES ('20240709005654-create-columns.js'),('20240709040522-create-sheets.js'),('20240709040532-create-sheets-columns.js'),('20240709040914-create-responses.js'),('20240711011332-updated-columns-schema.js'),('20240711011625-updated-columns-schema-2.js'),('20240711011633-updated-columns-schema-2.js'),('20240711011709-updated-columns-schema-3.js'),('20240711011729-updated-columns-schema-4.js');
/*!40000 ALTER TABLE `SequelizeMeta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Sheets`
--

DROP TABLE IF EXISTS `Sheets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Sheets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Sheets`
--

LOCK TABLES `Sheets` WRITE;
/*!40000 ALTER TABLE `Sheets` DISABLE KEYS */;
INSERT INTO `Sheets` VALUES (1,'Sendgrid',NULL),(2,'Hubspot',NULL);
/*!40000 ALTER TABLE `Sheets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SheetsColumns`
--

DROP TABLE IF EXISTS `SheetsColumns`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SheetsColumns` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sheetId` int DEFAULT NULL,
  `columnId` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SheetsColumns`
--

LOCK TABLES `SheetsColumns` WRITE;
/*!40000 ALTER TABLE `SheetsColumns` DISABLE KEYS */;
INSERT INTO `SheetsColumns` VALUES (1,1,1),(2,1,2),(3,1,5),(4,2,1),(5,2,2),(6,2,4),(7,2,5);
/*!40000 ALTER TABLE `SheetsColumns` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-07-19  8:46:11
