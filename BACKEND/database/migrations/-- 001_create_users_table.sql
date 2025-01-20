-- 001_create_users_table.sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    user_type ENUM('client', 'agency', 'staff') NOT NULL,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    last_login DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_status (status)
) ENGINE=InnoDB;

-- 002_create_agencies_table.sql
CREATE TABLE agencies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    business_registration_number VARCHAR(100),
    contact_person VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    service_radius INT NOT NULL COMMENT 'Service radius in kilometers',
    commission_rate DECIMAL(4,2) NOT NULL DEFAULT 10.00,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_location (latitude, longitude)
) ENGINE=InnoDB;

-- 003_create_clients_table.sql
CREATE TABLE clients (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    business_type VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_location (latitude, longitude)
) ENGINE=InnoDB;

-- 004_create_staff_table.sql
CREATE TABLE staff (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    agency_id INT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    max_travel_distance INT NOT NULL DEFAULT 20,
    hourly_rate DECIMAL(10,2),
    rating DECIMAL(3,2) DEFAULT 0.00,
    availability_status ENUM('available', 'unavailable', 'working') DEFAULT 'available',
    account_status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (agency_id) REFERENCES agencies(id) ON DELETE SET NULL,
    INDEX idx_location (latitude, longitude),
    INDEX idx_availability (availability_status),
    INDEX idx_name (first_name, last_name)
) ENGINE=InnoDB;

-- 005_create_qualifications_table.sql
CREATE TABLE qualifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    validity_period INT COMMENT 'Validity period in months',
    required_renewal BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE INDEX idx_name (name)
) ENGINE=InnoDB;

-- 006_create_staff_qualifications_table.sql
CREATE TABLE staff_qualifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    staff_id INT NOT NULL,
    qualification_id INT NOT NULL,
    certificate_number VARCHAR(100),
    issue_date DATE NOT NULL,
    expiry_date DATE,
    document_url VARCHAR(255),
    verification_status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE CASCADE,
    FOREIGN KEY (qualification_id) REFERENCES qualifications(id) ON DELETE RESTRICT,
    UNIQUE INDEX idx_staff_qual (staff_id, qualification_id)
) ENGINE=InnoDB;

-- 007_create_shifts_table.sql
CREATE TABLE shifts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    client_id INT,
    agency_id INT,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    break_duration INT DEFAULT 0 COMMENT 'Break duration in minutes',
    pay_rate DECIMAL(10,2) NOT NULL,
    positions_available INT NOT NULL DEFAULT 1,
    positions_filled INT NOT NULL DEFAULT 0,
    instant_approval BOOLEAN DEFAULT FALSE,
    required_qualifications TEXT COMMENT 'JSON array of qualification IDs',
    status ENUM('draft','published','assigned','in-progress','completed','cancelled') DEFAULT 'draft',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE RESTRICT,
    FOREIGN KEY (agency_id) REFERENCES agencies(id) ON DELETE RESTRICT,
    INDEX idx_location (latitude, longitude),
    INDEX idx_datetime (start_time, end_time),
    INDEX idx_status (status)
) ENGINE=InnoDB;

-- 008_create_shift_applications_table.sql
CREATE TABLE shift_applications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    shift_id INT NOT NULL,
    staff_id INT NOT NULL,
    status ENUM('pending', 'approved', 'rejected', 'withdrawn') DEFAULT 'pending',
    application_note TEXT,
    response_note TEXT,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    responded_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (shift_id) REFERENCES shifts(id) ON DELETE CASCADE,
    FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE CASCADE,
    UNIQUE INDEX idx_shift_staff (shift_id, staff_id)
) ENGINE=InnoDB;

-- 009_create_shift_assignments_table.sql
CREATE TABLE shift_assignments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    shift_id INT NOT NULL,
    staff_id INT NOT NULL,
    status ENUM('assigned', 'checked_in', 'checked_out', 'completed', 'no_show', 'cancelled') DEFAULT 'assigned',
    clock_in_time DATETIME,
    clock_out_time DATETIME,
    clock_in_location POINT,
    clock_out_location POINT,
    break_started DATETIME,
    break_ended DATETIME,
    actual_hours_worked DECIMAL(5,2),
    staff_rating DECIMAL(3,2),
    client_rating DECIMAL(3,2),
    staff_feedback TEXT,
    client_feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (shift_id) REFERENCES shifts(id) ON DELETE RESTRICT,
    FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE RESTRICT,
    UNIQUE INDEX idx_shift_staff (shift_id, staff_id),
    INDEX idx_status (status)
) ENGINE=InnoDB;

-- 010_create_payments_table.sql
CREATE TABLE payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    shift_assignment_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    commission_amount DECIMAL(10,2) NOT NULL,
    payment_status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
    payment_method VARCHAR(50),
    transaction_reference VARCHAR(100),
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (shift_assignment_id) REFERENCES shift_assignments(id) ON DELETE RESTRICT,
    INDEX idx_status (payment_status)
) ENGINE=InnoDB;