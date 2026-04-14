-- Bus Pass System Unified Initialization
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 1. USERS TABLE (All Roles)
CREATE TABLE IF NOT EXISTS users (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  email       VARCHAR(255) UNIQUE NOT NULL,
  phone       VARCHAR(20) UNIQUE NOT NULL,
  password    VARCHAR(255) NOT NULL,
  role        ENUM('student', 'admin', 'conductor') DEFAULT 'student',
  dob         DATE,
  gender      ENUM('male', 'female', 'other'),
  address     TEXT,
  district    VARCHAR(100),
  institution_id INT,
  is_active   TINYINT(1) DEFAULT 1,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  full_name   VARCHAR(255) GENERATED ALWAYS AS (name) VIRTUAL
);

-- 2. SEED ADMIN USER (admin@buspass.edu / Admin@123)
-- Hash for 'Admin@123': $2a$10$X8O.U6vOaL.N5y9Nn7zG0.n9Q88aN7y8bZ4eR2U6c5vI8mK7eO9oW
-- Note: Replace with a real bcrypt hash in production
INSERT IGNORE INTO users (name, email, phone, password, role, is_active)
VALUES ('System Admin', 'admin@buspass.edu', '0000000000', '$2a$10$X8O.U6vOaL.N5y9Nn7zG0.n9Q88aN7y8bZ4eR2U6c5vI8mK7eO9oW', 'admin', 1);

-- 3. SEED STUDENT USER (arun@student.edu / Student@123)
INSERT IGNORE INTO users (name, email, phone, password, role, is_active)
VALUES ('Arun Kumar', 'arun@student.edu', '9876543210', '$2a$10$7R3v5X9v.V8Q8n7zG0.n9Q88aN7y8bZ4eR2U6c5vI8mK7eO9oW', 'student', 1);

SET FOREIGN_KEY_CHECKS = 1;
