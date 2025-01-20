-- -----------------------------------------------------
-- Schema extrastaff360
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `extrastaff360`;
CREATE SCHEMA IF NOT EXISTS `extrastaff360` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ;
USE `extrastaff360` ;

-- -----------------------------------------------------
-- Table `extrastaff360`.`clients`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `extrastaff360`.`clients` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  -- ... other client details ...
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `extrastaff360`.`staff`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `extrastaff360`.`staff` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `first_name` VARCHAR(255) NOT NULL,
  `last_name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  -- ... other staff details ...
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `extrastaff360`.`agencies`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `extrastaff360`.`agencies` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  -- ... other agency details ...
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `extrastaff360`.`shifts`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `extrastaff360`.`shifts` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `client_id` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `location` VARCHAR(255) NOT NULL,
  `latitude` DECIMAL(10, 7) NOT NULL,
  `longitude` DECIMAL(10, 7) NOT NULL,
  `start_time` DATETIME NOT NULL,
  `end_time` DATETIME NOT NULL,
  `hourly_rate` DECIMAL(10, 2) NOT NULL,
  `status` ENUM('open', 'assigned', 'in_progress', 'completed', 'cancelled') DEFAULT 'open',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`client_id`) REFERENCES `extrastaff360`.`clients` (`id`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `extrastaff360`.`shift_assignments`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `extrastaff360`.`shift_assignments` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `shift_id` INT NOT NULL,
  `staff_id` INT NOT NULL,
  `agency_id` INT NULL,
  `status` ENUM('pending', 'accepted', 'rejected', 'completed') DEFAULT 'pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`shift_id`) REFERENCES `extrastaff360`.`shifts` (`id`),
  FOREIGN KEY (`staff_id`) REFERENCES `extrastaff360`.`staff` (`id`),
  FOREIGN KEY (`agency_id`) REFERENCES `extrastaff360`.`agencies` (`id`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `extrastaff360`.`escrow_accounts`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `extrastaff360`.`escrow_accounts` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `shift_id` INT NOT NULL,
  `client_id` INT NOT NULL,
  `total_amount` DECIMAL(10,2) NOT NULL,
  `client_fee_amount` DECIMAL(10,2) NOT NULL,
  `staff_fee_amount` DECIMAL(10,2) NOT NULL,
  `agency_fee_amount` DECIMAL(10,2) NULL,
  `status` ENUM('held', 'processing', 'released', 'refunded') DEFAULT 'held',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`shift_id`) REFERENCES `extrastaff360`.`shifts`(`id`),
  FOREIGN KEY (`client_id`) REFERENCES `extrastaff360`.`clients`(`id`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `extrastaff360`.`transaction_history`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `extrastaff360`.`transaction_history` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `escrow_id` INT NOT NULL,
  `transaction_type` ENUM('deposit', 'fee_deduction', 'payment_release', 'refund') NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `recipient_type` ENUM('platform', 'client', 'staff', 'agency') NOT NULL,
  `recipient_id` INT NOT NULL,
  `status` ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
  `reference_number` VARCHAR(100) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`escrow_id`) REFERENCES `extrastaff360`.`escrow_accounts` (`id`),
  INDEX `idx_type_status` (`transaction_type` ASC, `status` ASC)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `extrastaff360`.`staff_locations`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `extrastaff360`.`staff_locations` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `staff_id` INT NOT NULL,
  `latitude` DECIMAL(10, 7) NOT NULL,
  `longitude` DECIMAL(10, 7) NOT NULL,
  `timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`staff_id`) REFERENCES `extrastaff360`.`staff` (`id`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `extrastaff360`.`staff_availability`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `extrastaff360`.`staff_availability` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `staff_id` INT NOT NULL,
  `day_of_week` INT NOT NULL,  -- 0 for Sunday, 1 for Monday, etc.
  `start_time` TIME NOT NULL,
  `end_time` TIME NOT NULL,
  FOREIGN KEY (`staff_id`) REFERENCES `extrastaff360`.`staff` (`id`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `extrastaff360`.`staff_performance`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `extrastaff360`.`staff_performance` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `staff_id` INT NOT NULL,
  `shift_id` INT NOT NULL,
  `rating` DECIMAL(3, 2) NULL,  -- Allow for ratings like 4.5
  `feedback` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`staff_id`) REFERENCES `extrastaff360`.`staff` (`id`),
  FOREIGN KEY (`shift_id`) REFERENCES `extrastaff360`.`shifts` (`id`)
) ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `extrastaff360`.`agency_commissions`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `extrastaff360`.`agency_commissions` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `agency_id` INT NOT NULL,
  `shift_id` INT NOT NULL,
  `commission_amount` DECIMAL(10, 2) NOT NULL,
  `status` ENUM('pending', 'paid') DEFAULT 'pending',
  `paid_at` TIMESTAMP NULL,
  FOREIGN KEY (`agency_id`) REFERENCES `extrastaff360`.`agencies` (`id`),
  FOREIGN KEY (`shift_id`) REFERENCES `extrastaff360`.`shifts` (`id`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `extrastaff360`.`shift_reports`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `extrastaff360`.`shift_reports` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `client_id` INT NOT NULL,
  `shift_id` INT NOT NULL,
  `staff_id` INT NOT NULL,
  `start_time` TIMESTAMP NOT NULL,
  `end_time` TIMESTAMP NOT NULL,
  `total_hours` DECIMAL(5, 2) NOT NULL,
  `total_cost` DECIMAL(10, 2) NOT NULL,
  -- ... other relevant metrics ...
  FOREIGN KEY (`client_id`) REFERENCES `extrastaff360`.`clients` (`id`),
  FOREIGN KEY (`shift_id`) REFERENCES `extrastaff360`.`shifts` (`id`),
  FOREIGN KEY (`staff_id`) REFERENCES `extrastaff360`.`staff` (`id`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Stored Procedure `extrastaff360`.`process_escrow_payment`
-- -----------------------------------------------------
DELIMITER //
CREATE PROCEDURE `extrastaff360`.`process_escrow_payment`(
    IN p_shift_id INT,
    IN p_client_id INT,
    IN p_amount DECIMAL(10,2),
    IN p_agency_id INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Log the error (you'll need to implement a logging mechanism)
        -- Example: INSERT INTO error_logs (message) VALUES (CONCAT('Error in process_escrow_payment: ', SQL_MESSAGE()));
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'An error occurred during payment processing.';
    END;

    -- Validate input parameters
    IF p_amount <= 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid amount. Amount must be greater than zero.';
    END IF;

    -- Calculate fees
    DECLARE v_client_fee DECIMAL(10,2);
    DECLARE v_staff_fee DECIMAL(10,2);
    DECLARE v_agency_fee DECIMAL(10,2);
    DECLARE v_escrow_id INT;

    SET v_client_fee = p_amount * 0.08; -- 8% client fee
    SET v_staff_fee = p_amount * 0.10;  -- 10% staff fee
    
    -- Calculate agency fee if applicable
    IF p_agency_id IS NOT NULL THEN
        SET v_agency_fee = p_amount * 0.06; -- 6% agency fee
    ELSE
        SET v_agency_fee = 0;
    END IF;

    -- Start transaction
    START TRANSACTION;
    
    -- Create escrow account
    INSERT INTO `extrastaff360`.`escrow_accounts` (
        `shift_id`,
        `client_id`,
        `total_amount`,
        `client_fee_amount`,
        `staff_fee_amount`,
        `agency_fee_amount`,
        `status`
    ) VALUES (
        p_shift_id,
        p_client_id,
        p_amount,
        v_client_fee,
        v_staff_fee,
        v_agency_fee,
        'held'
    );

    SET v_escrow_id = LAST_INSERT_ID();

    -- Record initial deposit transaction
    INSERT INTO `extrastaff360`.`transaction_history` (
        `escrow_id`,
        `transaction_type`,
        `amount`,
        `recipient_type`,
        `recipient_id`,
        `status`
    ) VALUES (
        v_escrow_id,
        'deposit',
        p_amount + v_client_fee,
        'platform',
        1, -- Assuming platform ID is 1, replace with actual platform ID if different
        'completed'
    );

    COMMIT;
END //
DELIMITER ;

-- -----------------------------------------------------
-- Stored Procedure `extrastaff360`.`distribute_fees_and_payments`
-- -----------------------------------------------------
DELIMITER //
CREATE PROCEDURE `extrastaff360`.`distribute_fees_and_payments`(
    IN p_escrow_id INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Log the error (you'll need to implement a logging mechanism)
        -- Example: INSERT INTO error_logs (message) VALUES (CONCAT('Error in distribute_fees_and_payments: ', SQL_MESSAGE()));
        ROLLBACK;
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'An error occurred during payment distribution.';
    END;
    
    DECLARE v_total_amount DECIMAL(10,2);
    DECLARE v_client_fee DECIMAL(10,2);
    DECLARE v_staff_fee DECIMAL(10,2);
    DECLARE v_agency_fee DECIMAL(10,2);
    DECLARE v_staff_id INT;
    DECLARE v_agency_id INT;
    
    -- Get escrow details
    SELECT 
        `total_amount`,
        `client_fee_amount`,
        `staff_fee_amount`,
        `agency_fee_amount`,
        sa.`staff_id`,
        sa.`agency_id`
    INTO 
        v_total_amount,
        v_client_fee,
        v_staff_fee,
        v_agency_fee,
        v_staff_id,
        v_agency_id
    FROM `extrastaff360`.`escrow_accounts` ea
    JOIN `extrastaff360`.`shifts` s ON ea.`shift_id` = s.`id`
    JOIN `extrastaff360`.`shift_assignments` sa ON s.`id` = sa.`shift_id`
    WHERE ea.`id` = p_escrow_id;

    START TRANSACTION;
    
    -- Record platform fee collection
    INSERT INTO `extrastaff360`.`transaction_history` (
        `escrow_id`,
        `transaction_type`,
        `amount`,
        `recipient_type`,
        `recipient_id`,
        `status`
    ) VALUES
    (p_escrow_id, 'fee_deduction', v_client_fee, 'platform', 1, 'completed'); -- Assuming platform ID is 1

    -- Pay staff
    INSERT INTO `extrastaff360`.`transaction_history` (
        `escrow_id`,
        `transaction_type`,
        `amount`,
        `recipient_type`,
        `recipient_id`,
        `status`
    ) VALUES
    (p_escrow_id, 'payment_release', 
     v_total_amount - v_staff_fee - COALESCE(v_agency_fee, 0),
     'staff', v_staff_id, 'pending');

    -- Pay agency if involved
    IF v_agency_id IS NOT NULL THEN
        INSERT INTO `extrastaff360`.`transaction_history` (
            `escrow_id`,
            `transaction_type`,
            `amount`,
            `recipient_type`,
            `recipient_id`,
            `status`
        ) VALUES
        (p_escrow_id, 'payment_release',
         v_total_amount - v_agency_fee, 
         'agency', v_agency_id, 'pending');
    END IF;

    -- Update escrow status
    UPDATE `extrastaff360`.`escrow_accounts`
    SET `status` = 'processing'
    WHERE `id` = p_escrow_id;

    COMMIT;
END //
DELIMITER ;

-- -----------------------------------------------------
-- Schema extrastaff360
-- -----------------------------------------------------

DROP SCHEMA IF EXISTS `extrastaff360`;
CREATE SCHEMA IF NOT EXISTS `extrastaff360` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ;
USE `extrastaff360` ;

-- -----------------------------------------------------
-- Table `extrastaff360`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `extrastaff360`.`users` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `first_name` VARCHAR(255) NOT NULL,
  `last_name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('client', 'staff', 'agency', 'admin') NOT NULL DEFAULT 'client', 
  `phone_number` VARCHAR(20) NULL,
  `profile_picture` VARCHAR(255) NULL,
  -- ... other user details ...
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `extrastaff360`.`user_roles`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `extrastaff360`.`user_roles` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `role_name` VARCHAR(255) NOT NULL UNIQUE,
  `description` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `extrastaff360`.`user_role_permissions` 
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `extrastaff360`.`user_role_permissions` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `role_id` INT NOT NULL,
  `permission` VARCHAR(255) NOT NULL,  -- e.g., 'create_shift', 'apply_for_shift', 'manage_staff'
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`role_id`) REFERENCES `extrastaff360`.`user_roles` (`id`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `extrastaff360`.`password_resets`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `extrastaff360`.`password_resets` (
  `email` VARCHAR(255) NOT NULL,
  `token` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_email` (`email`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `extrastaff360`.`user_activity_logs`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `extrastaff360`.`user_activity_logs` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `action` VARCHAR(255) NOT NULL, -- e.g., 'login', 'create_shift', 'update_profile'
  `details` TEXT NULL,
  `ip_address` VARCHAR(45) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `extrastaff360`.`users` (`id`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `extrastaff360`.`skills`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `extrastaff360`.`skills` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `skill_name` VARCHAR(255) NOT NULL UNIQUE,
  `description` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `extrastaff360`.`shifts`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `extrastaff360`.`shifts` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `client_id` INT NOT NULL, 
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `location` VARCHAR(255) NOT NULL,
  `latitude` DECIMAL(10, 7) NOT NULL,
  `longitude` DECIMAL(10, 7) NOT NULL,
  `start_time` DATETIME NOT NULL,
  `end_time` DATETIME NOT NULL,
  `hourly_rate` DECIMAL(10, 2) NOT NULL,
  `status` ENUM('open', 'assigned', 'in_progress', 'completed', 'cancelled') DEFAULT 'open',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`client_id`) REFERENCES `extrastaff360`.`users` (`id`) -- Changed to users table
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `extrastaff360`.`shift_skills`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `extrastaff360`.`shift_skills` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `shift_id` INT NOT NULL,
  `skill_id` INT NOT NULL,
  FOREIGN KEY (`shift_id`) REFERENCES `extrastaff360`.`shifts` (`id`),
  FOREIGN KEY (`skill_id`) REFERENCES `extrastaff360`.`skills` (`id`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `extrastaff360`.`shift_applications`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `extrastaff360`.`shift_applications` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `shift_id` INT NOT NULL,
  `staff_id` INT NOT NULL,
  `status` ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
  `applied_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`shift_id`) REFERENCES `extrastaff360`.`shifts` (`id`),
  FOREIGN KEY (`staff_id`) REFERENCES `extrastaff360`.`users` (`id`)  -- Changed to users table
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `extrastaff360`.`shift_assignments`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `extrastaff360`.`shift_assignments` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `shift_id` INT NOT NULL,
  `staff_id` INT NOT NULL,
  `agency_id` INT NULL, 
  `status` ENUM('pending', 'accepted', 'rejected', 'completed') DEFAULT 'pending',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`shift_id`) REFERENCES `extrastaff360`.`shifts` (`id`),
  FOREIGN KEY (`staff_id`) REFERENCES `extrastaff360`.`users` (`id`),  -- Changed to users table
  FOREIGN KEY (`agency_id`) REFERENCES `extrastaff360`.`users` (`id`)  -- Changed to users table
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `extrastaff360`.`shift_feedback`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `extrastaff360`.`shift_feedback` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `shift_id` INT NOT NULL,
  `client_id` INT NOT NULL,  
  `feedback` TEXT NULL,
  `rating` DECIMAL(3,2) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`shift_id`) REFERENCES `extrastaff360`.`shifts` (`id`),
  FOREIGN KEY (`client_id`) REFERENCES `extrastaff360`.`users` (`id`) -- Changed to users table
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `extrastaff360`.`shift_messages`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `extrastaff360`.`shift_messages` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `shift_id` INT NOT NULL,
  `sender_id` INT NOT NULL,
  `recipient_id` INT NOT NULL,
  `message` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`shift_id`) REFERENCES `extrastaff360`.`shifts` (`id`),
  FOREIGN KEY (`sender_id`) REFERENCES `extrastaff360`.`users` (`id`),   -- Changed to users table
  FOREIGN KEY (`recipient_id`) REFERENCES `extrastaff360`.`users` (`id`)  -- Changed to users table
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `extrastaff360`.`escrow_accounts`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `extrastaff360`.`escrow_accounts` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `shift_id` INT NOT NULL,
  `client_id` INT NOT NULL, 
  `total_amount` DECIMAL(10,2) NOT NULL,
  `client_fee_amount` DECIMAL(10,2) NOT NULL,
  `staff_fee_amount` DECIMAL(10,2) NOT NULL,
  `agency_fee_amount` DECIMAL(10,2) NULL,
  `status` ENUM('held', 'processing', 'released', 'refunded') DEFAULT 'held',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`shift_id`) REFERENCES `extrastaff360`.`shifts`(`id`),
  FOREIGN KEY (`client_id`) REFERENCES `extrastaff360`.`users`(`id`)  -- Changed to users table
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `extrastaff360`.`transaction_history`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `extrastaff360`.`transaction_history` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `escrow_id` INT NOT NULL,
  `transaction_type` ENUM('deposit', 'fee_deduction', 'payment_release', 'refund') NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `recipient_type` ENUM('platform', 'client', 'staff', 'agency') NOT NULL,
  `recipient_id` INT NOT NULL,
  `status` ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
  `reference_number` VARCHAR(100) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`escrow_id`) REFERENCES `extrastaff360`.`escrow_accounts` (`id`)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `extrastaff360`.`payment_methods`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `extrastaff360`.`payment_methods` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `payment_type` ENUM('credit_card', 'bank_account', 'paypal') NOT NULL,
  `account_details` TEXT NOT NULL, -- Encrypted or tokenized payment details
  `is_default` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `extrastaff360`.`users` (`id`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `extrastaff360`.`invoices`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `extrastaff360`.`invoices` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `client_id` INT NOT NULL,
  `shift_id` INT NOT NULL,
  `invoice_number` VARCHAR(255) NOT NULL UNIQUE,
  `amount` DECIMAL(10,2) NOT NULL,
  `status` ENUM('pending', 'paid', 'overdue') DEFAULT 'pending',
  `due_date` DATE NOT NULL,
  `paid_at` TIMESTAMP NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`client_id`) REFERENCES `extrastaff360`.`users` (`id`),  -- Changed to users table
  FOREIGN KEY (`shift_id`) REFERENCES `extrastaff360`.`shifts` (`id`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `extrastaff360`.`payouts`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `extrastaff360`.`payouts` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `user_id` INT NOT NULL, -- Can be staff or agency
  `shift_id` INT NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `status` ENUM('pending', 'processed', 'failed') DEFAULT 'pending',
  `processed_at` TIMESTAMP NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `extrastaff360`.`users` (`id`),  -- Changed to users table
  FOREIGN KEY (`shift_id`) REFERENCES `extrastaff360`.`shifts` (`id`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `extrastaff360`.`notifications`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `extrastaff360`.`notifications` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `message` TEXT NOT NULL,
  `is_read` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `extrastaff360`.`users` (`id`)  -- Changed to users table
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `extrastaff360`.`messages`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `extrastaff360`.`messages` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `sender_id` INT NOT NULL,
  `recipient_id` INT NOT NULL,
  `message` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`sender_id`) REFERENCES `extrastaff360`.`users` (`id`),  -- Changed to users table
  FOREIGN KEY (`recipient_id`) REFERENCES `extrastaff360`.`users` (`id`) -- Changed to users table
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `extrastaff360`.`reviews`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `extrastaff360`.`reviews` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `reviewer_id` INT NOT NULL,
  `reviewee_id` INT NOT NULL,
  `rating` DECIMAL(3,2) NOT NULL,
  `comment` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`reviewer_id`) REFERENCES `extrastaff360`.`users` (`id`), -- Changed to users table
  FOREIGN KEY (`reviewee_id`) REFERENCES `extrastaff360`.`users` (`id`)  -- Changed to users table
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `extrastaff360`.`support_tickets`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `extrastaff360`.`support_tickets` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `subject` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `status` ENUM('open', 'closed', 'pending') DEFAULT 'open',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `extrastaff360`.`users` (`id`) -- Changed to users table
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `extrastaff360`.`settings`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `extrastaff360`.`settings` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `setting_name` VARCHAR(255) NOT NULL UNIQUE,
  `setting_value` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `extrastaff360`.`background_checks`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `extrastaff360`.`background_checks` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `staff_id` INT NOT NULL,
  `status` ENUM('pending', 'in_progress', 'completed', 'failed') DEFAULT 'pending',
  `result` ENUM('clear', 'flagged') NULL,
  `details` TEXT NULL,
  `checked_at` TIMESTAMP NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`staff_id`) REFERENCES `extrastaff360`.`users` (`id`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `extrastaff360`.`certifications`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `extrastaff360`.`certifications` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `staff_id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `issuing_authority` VARCHAR(255) NULL,
  `issue_date` DATE NULL,
  `expiry_date` DATE NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`staff_id`) REFERENCES `extrastaff360`.`users` (`id`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `extrastaff360`.`work_experiences`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `extrastaff360`.`work_experiences` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `staff_id` INT NOT NULL,
  `company_name` VARCHAR(255) NOT NULL,
  `job_title` VARCHAR(255) NOT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE NULL,
  `description` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`staff_id`) REFERENCES `extrastaff360`.`users` (`id`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `extrastaff360`.`contracts`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `extrastaff360`.`contracts` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `shift_id` INT NOT NULL,
  `client_id` INT NOT NULL,
  `staff_id` INT NOT NULL,
  `agency_id` INT NULL,
  `contract_details` TEXT NOT NULL, -- You might want to store the contract content or a link to it
  `status` ENUM('pending', 'signed', 'cancelled') DEFAULT 'pending',
  `signed_at` TIMESTAMP NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`shift_id`) REFERENCES `extrastaff360`.`shifts` (`id`),
  FOREIGN KEY (`client_id`) REFERENCES `extrastaff360`.`users` (`id`),
  FOREIGN KEY (`staff_id`) REFERENCES `extrastaff360`.`users` (`id`),
  FOREIGN KEY (`agency_id`) REFERENCES `extrastaff360`.`users` (`id`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `extrastaff360`.`training_modules`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `extrastaff360`.`training_modules` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `content` TEXT NULL, -- You might want to store the content or a link to it
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `extrastaff360`.`staff_training_progress`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `extrastaff360`.`staff_training_progress` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `staff_id` INT NOT NULL,
  `module_id` INT NOT NULL,
  `status` ENUM('not_started', 'in_progress', 'completed') DEFAULT 'not_started',
  `completed_at` TIMESTAMP NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`staff_id`) REFERENCES `extrastaff360`.`users` (`id`),
  FOREIGN KEY (`module_id`) REFERENCES `extrastaff360`.`training_modules` (`id`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `extrastaff360`.`badges`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `extrastaff360`.`badges` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL UNIQUE,
  `description` TEXT NULL,
  `icon` VARCHAR(255) NULL, -- You might want to store an icon or image for the badge
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `extrastaff360`.`user_badges`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `extrastaff360`.`user_badges` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `badge_id` INT NOT NULL,
  `awarded_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `extrastaff360`.`users` (`id`),
  FOREIGN KEY (`badge_id`) REFERENCES `extrastaff360`.`badges` (`id`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `extrastaff360`.`disputes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `extrastaff360`.`disputes` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `shift_id` INT NOT NULL,
  `initiator_id` INT NOT NULL, -- User who initiated the dispute
  `respondent_id` INT NOT NULL, -- Other party involved in the dispute
  `reason` TEXT NOT NULL,
  `status` ENUM('open', 'resolved', 'escalated') DEFAULT 'open',
  `resolution` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`shift_id`) REFERENCES `extrastaff360`.`shifts` (`id`),
  FOREIGN KEY (`initiator_id`) REFERENCES `extrastaff360`.`users` (`id`),
  FOREIGN KEY (`respondent_id`) REFERENCES `extrastaff360`.`users` (`id`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `extrastaff360`.`support_tickets`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `extrastaff360`.`support_tickets` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `subject` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `status` ENUM('open', 'closed', 'pending') DEFAULT 'open',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `extrastaff360`.`users` (`id`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `extrastaff360`.`settings`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `extrastaff360`.`settings` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `setting_name` VARCHAR(255) NOT NULL UNIQUE,
  `setting_value` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `extrastaff360`.`two_factor_auth`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `extrastaff360`.`two_factor_auth` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `user_id` INT NOT NULL UNIQUE,
  `secret_key` VARCHAR(255) NOT NULL, -- Store the 2FA secret key (encrypted)
  `recovery_codes` TEXT NULL, -- Store recovery codes (encrypted)
  `enabled` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `extrastaff360`.`users` (`id`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Add region column to `extrastaff360`.`payment_methods`
-- -----------------------------------------------------
ALTER TABLE `extrastaff360`.`payment_methods` 
ADD COLUMN `region` VARCHAR(255) NULL AFTER `is_default`; 

-- Remember to populate the `user_roles` and `user_role_permissions` tables with appropriate data.

-- Add indexes for performance
ALTER TABLE `extrastaff360`.`users` ADD INDEX `idx_email` (`email`);
ALTER TABLE `extrastaff360`.`shifts` ADD INDEX `idx_client_id` (`client_id`);
-- ... add other indexes as needed ...
-- Add new columns and indexes to users table
ALTER TABLE `extrastaff360`.`users` 
ADD COLUMN IF NOT EXISTS `status` ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
ADD COLUMN IF NOT EXISTS `last_login_at` TIMESTAMP NULL,
ADD COLUMN IF NOT EXISTS `email_verified_at` TIMESTAMP NULL,
ADD INDEX IF NOT EXISTS `idx_status_role` (`status`, `role`);

-- Add performance indexes to shifts table
ALTER TABLE `extrastaff360`.`shifts`
ADD INDEX IF NOT EXISTS `idx_status_start_time` (`status`, `start_time`),
ADD INDEX IF NOT EXISTS `idx_location` (`latitude`, `longitude`);

-- Add transaction history performance indexes
ALTER TABLE `extrastaff360`.`transaction_history`
ADD INDEX IF NOT EXISTS `idx_created_status_type` (`created_at`, `status`, `transaction_type`);

-- Add escrow accounts performance indexes
ALTER TABLE `extrastaff360`.`escrow_accounts`
ADD INDEX IF NOT EXISTS `idx_status_created` (`status`, `created_at`);

-- Add shift assignments performance indexes
ALTER TABLE `extrastaff360`.`shift_assignments`
ADD INDEX IF NOT EXISTS `idx_staff_status` (`staff_id`, `status`),
ADD INDEX IF NOT EXISTS `idx_agency_status` (`agency_id`, `status`);
