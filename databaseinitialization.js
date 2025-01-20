-- EXTRASTAFF360 Database Initialization Script
-- Version: 1.0.0
-- Environment: Production
-- Database: extrastaff360

-- Set strict SQL mode for robust data integrity
SET GLOBAL sql_mode = 'STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS extrastaff360
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- Use the database
USE extrastaff360;

-- User Management
CREATE TABLE users (
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    user_type ENUM('client', 'staff', 'agency') NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    last_login TIMESTAMP NULL,
    INDEX idx_user_type (user_type),
    INDEX idx_email (email)
) ENGINE=InnoDB;

-- Client Profiles
CREATE TABLE client_profiles (
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    user_id BINARY(16) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    business_type VARCHAR(100) NOT NULL,
    contact_person VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address JSON NOT NULL,
    tax_information JSON,
    verification_status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_company_name (company_name)
) ENGINE=InnoDB;

-- Staff Profiles
CREATE TABLE staff_profiles (
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    user_id BINARY(16) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    skills JSON NOT NULL,
    certifications JSON,
    availability JSON,
    hourly_rate DECIMAL(10,2) NOT NULL,
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_hours INT DEFAULT 0,
    background_check_status ENUM('pending', 'passed', 'failed') DEFAULT 'pending',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_hourly_rate (hourly_rate),
    INDEX idx_rating (rating)
) ENGINE=InnoDB;

-- Agency Profiles
CREATE TABLE agency_profiles (
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    user_id BINARY(16) NOT NULL,
    agency_name VARCHAR(255) NOT NULL,
    license_number VARCHAR(100) UNIQUE,
    staff_count INT DEFAULT 0,
    service_areas JSON,
    commission_rate DECIMAL(4,2) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_agency_name (agency_name)
) ENGINE=InnoDB;

-- Shifts
CREATE TABLE shifts (
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    client_id BINARY(16) NOT NULL,
    status ENUM('open', 'assigned', 'in_progress', 'completed', 'cancelled') DEFAULT 'open',
    title VARCHAR(255) NOT NULL,
    description TEXT,
    requirements JSON NOT NULL,
    location JSON NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    hourly_rate DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES client_profiles(id),
    INDEX idx_status (status),
    INDEX idx_start_time (start_time),
    INDEX idx_hourly_rate (hourly_rate)
) ENGINE=InnoDB;

-- Shift Applications
CREATE TABLE shift_applications (
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    shift_id BINARY(16) NOT NULL,
    staff_id BINARY(16) NOT NULL,
    agency_id BINARY(16) NULL,
    status ENUM('pending', 'accepted', 'rejected', 'withdrawn') DEFAULT 'pending',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    response_at TIMESTAMP NULL,
    FOREIGN KEY (shift_id) REFERENCES shifts(id),
    FOREIGN KEY (staff_id) REFERENCES staff_profiles(id),
    FOREIGN KEY (agency_id) REFERENCES agency_profiles(id),
    UNIQUE KEY unique_application (shift_id, staff_id),
    INDEX idx_status (status)
) ENGINE=InnoDB;

-- Payments and Escrow
CREATE TABLE transactions (
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    shift_id BINARY(16) NOT NULL,
    client_id BINARY(16) NOT NULL,
    staff_id BINARY(16) NOT NULL,
    agency_id BINARY(16) NULL,
    amount DECIMAL(10,2) NOT NULL,
    platform_fee DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'held', 'released', 'refunded', 'disputed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (shift_id) REFERENCES shifts(id),
    FOREIGN KEY (client_id) REFERENCES client_profiles(id),
    FOREIGN KEY (staff_id) REFERENCES staff_profiles(id),
    FOREIGN KEY (agency_id) REFERENCES agency_profiles(id),
    INDEX idx_status (status)
) ENGINE=InnoDB;

-- Ratings and Reviews
CREATE TABLE reviews (
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    shift_id BINARY(16) NOT NULL,
    reviewer_id BINARY(16) NOT NULL,
    reviewee_id BINARY(16) NOT NULL,
    rating DECIMAL(3,2) NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (shift_id) REFERENCES shifts(id),
    FOREIGN KEY (reviewer_id) REFERENCES users(id),
    FOREIGN KEY (reviewee_id) REFERENCES users(id),
    INDEX idx_rating (rating)
) ENGINE=InnoDB;

-- Configure MySQL Performance Settings
SET GLOBAL innodb_buffer_pool_size = 4294967296; -- 4GB
SET GLOBAL innodb_log_file_size = 268435456; -- 256MB
SET GLOBAL innodb_flush_log_at_trx_commit = 1;
SET GLOBAL max_connections = 1000;

-- Create Application User and Grant Permissions
CREATE USER IF NOT EXISTS 'segzdee'@'127.0.0.1' 
IDENTIFIED BY 'kiyingi8844';

GRANT ALL PRIVILEGES ON extrastaff360.* TO 'segzdee'@'127.0.0.1';
FLUSH PRIVILEGES;

-- Create Event for Maintenance
CREATE EVENT clean_expired_sessions
ON SCHEDULE EVERY 1 DAY
DO
  DELETE FROM sessions WHERE expires_at < NOW();

-- Enable Binary Logging for Replication
SET GLOBAL server_id = 1;
SET GLOBAL log_bin = 'mysql-bin';
SET GLOBAL binlog_format = 'ROW';

-- Create Stored Procedures for Common Operations
DELIMITER //

CREATE PROCEDURE CalculateStaffMetrics(IN staff_id_param BINARY(16))
BEGIN
    SELECT 
        COUNT(*) as total_shifts,
        AVG(rating) as avg_rating,
        SUM(TIMESTAMPDIFF(HOUR, start_time, end_time)) as total_hours
    FROM shifts s
    JOIN shift_applications sa ON s.id = sa.shift_id
    LEFT JOIN reviews r ON s.id = r.shift_id
    WHERE sa.staff_id = staff_id_param
    AND s.status = 'completed';
END //

DELIMITER ;

-- Set Configuration Variables
SET GLOBAL max_allowed_packet = 67108864; -- 64MB
SET GLOBAL tmp_table_size = 134217728; -- 128MB
SET GLOBAL max_heap_table_size = 134217728; -- 128MB

-- Create Indexes for Performance
CREATE INDEX idx_shift_search 
ON shifts (status, start_time, hourly_rate);

CREATE INDEX idx_staff_matching 
ON staff_profiles (hourly_rate, rating);

-- Initialize System Configuration
INSERT INTO system_config (config_key, config_value) VALUES
('platform_fee_client', '8.00'),
('platform_fee_freelancer', '10.00'),
('platform_fee_agency', '6.00'),
('minimum_hourly_rate', '15.00'),
('matching_radius_km', '50'),
('auto_payment_release_hours', '24');

-- Output Success Message
SELECT 'EXTRASTAFF360 Database Initialization Complete' as 'Status';