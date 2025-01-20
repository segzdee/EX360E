-- Check if the table exists
DROP TABLE IF EXISTS escrow_accounts;

-- Escrow Management Table
CREATE TABLE escrow_accounts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    shift_id INT NOT NULL,
    client_id INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    client_fee_amount DECIMAL(10,2) NOT NULL,
    staff_fee_amount DECIMAL(10,2) NOT NULL,
    agency_fee_amount DECIMAL(10,2),
    status ENUM('held', 'processing', 'released', 'refunded') DEFAULT 'held',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (shift_id) REFERENCES shifts(id),
    FOREIGN KEY (client_id) REFERENCES clients(id),
    INDEX idx_status (status)
) ENGINE=InnoDB;

-- Check if the table exists
DROP TABLE IF EXISTS transaction_history;

-- Transaction History Table
CREATE TABLE transaction_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    escrow_id INT NOT NULL,
    transaction_type ENUM('deposit', 'fee_deduction', 'payment_release', 'refund') NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    recipient_type ENUM('platform', 'client', 'staff', 'agency') NOT NULL,
    recipient_id INT NOT NULL,
    status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    reference_number VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (escrow_id) REFERENCES escrow_accounts(id),
    INDEX idx_type_status (transaction_type, status)
) ENGINE=InnoDB;
