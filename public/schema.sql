-- Users table (for all user types)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_type ENUM('client', 'staff', 'agency') NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Clients table
CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    company_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Agencies table
CREATE TABLE agencies (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    agency_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Staff table
CREATE TABLE staff (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    agency_id INTEGER REFERENCES agencies(id),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    skills TEXT[],
    certifications TEXT[],
    availability JSON,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Shifts table
CREATE TABLE shifts (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES clients(id),
    agency_id INTEGER REFERENCES agencies(id),
    position VARCHAR(100) NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    hourly_rate DECIMAL(10, 2) NOT NULL,
    status ENUM('open', 'assigned', 'in_progress', 'completed', 'cancelled') NOT NULL,
    location TEXT,
    requirements TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Shift assignments table
CREATE TABLE shift_assignments (
    id SERIAL PRIMARY KEY,
    shift_id INTEGER REFERENCES shifts(id),
    staff_id INTEGER REFERENCES staff(id),
    status ENUM('assigned', 'accepted', 'rejected', 'completed') NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Payments table
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    shift_id INTEGER REFERENCES shifts(id),
    amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'completed', 'failed') NOT NULL,
    payment_method VARCHAR(50),
    transaction_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Escrow table
CREATE TABLE escrow (
    id SERIAL PRIMARY KEY,
    shift_id INTEGER REFERENCES shifts(id),
    amount DECIMAL(10, 2) NOT NULL,
    status ENUM('held', 'released', 'refunded') NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Ratings table
CREATE TABLE ratings (
    id SERIAL PRIMARY KEY,
    shift_id INTEGER REFERENCES shifts(id),
    rater_id INTEGER REFERENCES users(id),
    ratee_id INTEGER REFERENCES users(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Disputes table
CREATE TABLE disputes (
    id SERIAL PRIMARY KEY,
    shift_id INTEGER REFERENCES shifts(id),
    complainant_id INTEGER REFERENCES users(id),
    respondent_id INTEGER REFERENCES users(id),
    issue TEXT NOT NULL,
    status ENUM('open', 'under_review', 'resolved', 'closed') NOT NULL,
    resolution TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Notifications table
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Documents table (for storing various documents like contracts, certifications, etc.)
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    document_type VARCHAR(50) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Transactions table (for financial tracking)
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    amount DECIMAL(10, 2) NOT NULL,
    transaction_type ENUM('deposit', 'withdrawal', 'fee', 'refund') NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for frequently queried columns
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_shifts_start_time ON shifts(start_time);
CREATE INDEX idx_shift_assignments_shift_id ON shift_assignments(shift_id);
CREATE INDEX idx_payments_shift_id ON payments(shift_id);
CREATE INDEX idx_ratings_shift_id ON ratings(shift_id);
CREATE INDEX idx_disputes_shift_id ON disputes(shift_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);

