-- triggers.sql
-- Error logging table
CREATE TABLE IF NOT EXISTS error_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    trigger_name VARCHAR(100),
    table_name VARCHAR(100),
    error_message TEXT,
    stack_trace TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DELIMITER //

-- =============================================
-- User Related Triggers
-- =============================================

CREATE TRIGGER before_user_update 
    BEFORE UPDATE ON users
    FOR EACH ROW 
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END//

CREATE TRIGGER after_user_status_change
    AFTER UPDATE ON users
    FOR EACH ROW 
BEGIN
    IF NEW.status != OLD.status THEN
        -- Update related staff status
        IF EXISTS (SELECT 1 FROM staff WHERE user_id = NEW.id) THEN
            UPDATE staff 
            SET account_status = CASE 
                WHEN NEW.status = 'active' THEN 'active'
                WHEN NEW.status = 'suspended' THEN 'suspended'
                ELSE 'inactive'
            END
            WHERE user_id = NEW.id;
        END IF;
        
        -- Update related agency status
        IF EXISTS (SELECT 1 FROM agencies WHERE user_id = NEW.id) THEN
            UPDATE agencies 
            SET status = CASE 
                WHEN NEW.status = 'active' THEN 'active'
                ELSE 'inactive'
            END
            WHERE user_id = NEW.id;
        END IF;
        
        -- Update related client status
        IF EXISTS (SELECT 1 FROM clients WHERE user_id = NEW.id) THEN
            UPDATE clients 
            SET status = CASE 
                WHEN NEW.status = 'active' THEN 'active'
                ELSE 'inactive'
            END
            WHERE user_id = NEW.id;
        END IF;
    END IF;
END//

-- =============================================
-- Shift Related Triggers
-- =============================================

CREATE TRIGGER before_shift_insert
    BEFORE INSERT ON shifts
    FOR EACH ROW 
BEGIN
    -- Validate minimum 4 hour notice
    IF NEW.start_time <= NOW() + INTERVAL 4 HOUR THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Shift must start at least 4 hours from now';
    END IF;
    
    -- Validate maximum 7 day advance posting
    IF NEW.start_time >= NOW() + INTERVAL 7 DAY THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Shift cannot be scheduled more than 7 days in advance';
    END IF;

    -- Validate minimum shift duration (4 hours)
    IF TIMESTAMPDIFF(HOUR, NEW.start_time, NEW.end_time) < 4 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Shift duration must be at least 4 hours';
    END IF;
    
    -- Validate required fields
    IF NEW.location IS NULL OR NEW.latitude IS NULL OR NEW.longitude IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Location details are required';
    END IF;
END//

CREATE TRIGGER before_shift_update
    BEFORE UPDATE ON shifts
    FOR EACH ROW 
BEGIN
    -- Only allow status updates once shift is published
    IF OLD.status = 'draft' AND NEW.status != 'published' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Draft shifts must be published first';
    END IF;

    -- Prevent changes to published shifts
    IF OLD.status != 'draft' AND (
        OLD.start_time != NEW.start_time OR 
        OLD.end_time != NEW.end_time OR 
        OLD.location != NEW.location
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot modify core shift details after publishing';
    END IF;
    
    -- Validate status transitions
    IF NEW.status != OLD.status THEN
        CASE NEW.status
            WHEN 'completed' THEN
                IF OLD.status != 'in-progress' THEN
                    SIGNAL SQLSTATE '45000'
                    SET MESSAGE_TEXT = 'Shift must be in-progress before marking as completed';
                END IF;
            WHEN 'in-progress' THEN
                IF OLD.status != 'assigned' THEN
                    SIGNAL SQLSTATE '45000'
                    SET MESSAGE_TEXT = 'Shift must be assigned before marking as in-progress';
                END IF;
            WHEN 'cancelled' THEN
                IF OLD.status IN ('completed') THEN
                    SIGNAL SQLSTATE '45000'
                    SET MESSAGE_TEXT = 'Cannot cancel a completed shift';
                END IF;
        END CASE;
    END IF;
END//

-- =============================================
-- Staff Assignment Related Triggers
-- =============================================

CREATE TRIGGER before_shift_assignment
    BEFORE INSERT ON shift_assignments
    FOR EACH ROW 
BEGIN
    DECLARE staff_count INT;
    DECLARE shift_max_positions INT;
    DECLARE staff_lat DECIMAL(10,8);
    DECLARE staff_lon DECIMAL(10,8);
    DECLARE shift_lat DECIMAL(10,8);
    DECLARE shift_lon DECIMAL(10,8);
    DECLARE staff_max_distance INT;
    DECLARE distance DECIMAL(10,2);
    
    -- Check if shift is full
    SELECT COUNT(*), shifts.max_positions 
    INTO staff_count, shift_max_positions
    FROM shift_assignments 
    JOIN shifts ON shift_assignments.shift_id = shifts.id
    WHERE shift_assignments.shift_id = NEW.shift_id
    AND shift_assignments.status != 'cancelled';

    IF staff_count >= shift_max_positions THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Shift is already full';
    END IF;
    
    -- Get staff and shift locations
    SELECT latitude, longitude, max_travel_distance 
    INTO staff_lat, staff_lon, staff_max_distance
    FROM staff WHERE id = NEW.staff_id;
    
    SELECT latitude, longitude 
    INTO shift_lat, shift_lon
    FROM shifts WHERE id = NEW.shift_id;
    
    -- Calculate distance using haversine formula
    SET distance = (
        6371 * acos(
            cos(radians(staff_lat)) * 
            cos(radians(shift_lat)) * 
            cos(radians(shift_lon) - radians(staff_lon)) + 
            sin(radians(staff_lat)) * 
            sin(radians(shift_lat))
        )
    );
    
    IF distance > staff_max_distance THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Shift location is beyond staff member\'s maximum travel distance';
    END IF;
END//

-- =============================================
-- Clock In/Out Related Triggers
-- =============================================

CREATE TRIGGER before_clockin_update
    BEFORE UPDATE ON shift_assignments
    FOR EACH ROW 
BEGIN
    DECLARE shift_start DATETIME;
    DECLARE shift_end DATETIME;
    DECLARE max_early_minutes INT DEFAULT 15;
    DECLARE max_late_minutes INT DEFAULT 15;
    
    SELECT start_time, end_time 
    INTO shift_start, shift_end
    FROM shifts WHERE id = NEW.shift_id;

    -- Validate clock-in time
    IF NEW.clock_in_time IS NOT NULL AND OLD.clock_in_time IS NULL THEN
        IF NEW.clock_in_time < shift_start - INTERVAL max_early_minutes MINUTE THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Cannot clock in more than 15 minutes before shift start';
        END IF;
        
        -- Auto-update status to checked_in
        SET NEW.status = 'checked_in';
    END IF;

    -- Validate clock-out time
    IF NEW.clock_out_time IS NOT NULL AND OLD.clock_out_time IS NULL THEN
        IF NEW.clock_in_time IS NULL THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Cannot clock out without first clocking in';
        END IF;
        
        IF NEW.clock_out_time < NEW.clock_in_time THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Clock out time cannot be before clock in time';
        END IF;
        
        IF NEW.clock_out_time > shift_end + INTERVAL max_late_minutes MINUTE THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Cannot clock out more than 15 minutes after shift end';
        END IF;
        
        -- Calculate actual hours worked
        SET NEW.actual_hours_worked = TIMESTAMPDIFF(MINUTE, NEW.clock_in_time, NEW.clock_out_time) / 60.0;
        
        -- Auto-update status to checked_out
        SET NEW.status = 'checked_out';
    END IF;
END//

-- =============================================
-- Payment Related Triggers
-- =============================================

CREATE TRIGGER before_payment_insert
    BEFORE INSERT ON payments
    FOR EACH ROW 
BEGIN
    DECLARE shift_completed BOOLEAN;
    DECLARE total_hours DECIMAL(5,2);
    DECLARE hourly_rate DECIMAL(10,2);
    
    -- Check if shift is completed
    SELECT 
        status = 'completed',
        actual_hours_worked,
        s.pay_rate
    INTO 
        shift_completed,
        total_hours,
        hourly_rate
    FROM shift_assignments sa
    JOIN shifts s ON sa.shift_id = s.id
    WHERE sa.id = NEW.shift_assignment_id;

    IF NOT shift_completed THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot process payment before shift completion';
    END IF;
    
    -- Validate payment amount
    IF NEW.amount != (total_hours * hourly_rate) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Payment amount does not match hours worked';
    END IF;
END//

-- =============================================
-- Rating Related Triggers
-- =============================================

CREATE TRIGGER after_shift_rating
    AFTER UPDATE ON shift_assignments
    FOR EACH ROW 
BEGIN
    IF NEW.staff_rating IS NOT NULL AND NEW.staff_rating != OLD.staff_rating THEN
        -- Update staff average rating
        UPDATE staff 
        SET rating = (
            SELECT AVG(staff_rating)
            FROM shift_assignments
            WHERE staff_id = NEW.staff_id
            AND staff_rating IS NOT NULL
        )
        WHERE id = NEW.staff_id;
    END IF;
END//

-- =============================================
-- Qualification Related Triggers
-- =============================================

CREATE TRIGGER before_staff_qualification_insert
    BEFORE INSERT ON staff_qualifications
    FOR EACH ROW 
BEGIN
    DECLARE qual_validity INT;
    
    -- Get qualification validity period
    SELECT validity_period INTO qual_validity
    FROM qualifications
    WHERE id = NEW.qualification_id;
    
    -- Set expiry date if validity period exists
    IF qual_validity IS NOT NULL THEN
        SET NEW.expiry_date = DATE_ADD(NEW.issue_date, INTERVAL qual_validity MONTH);
    END IF;
END//

CREATE TRIGGER after_qualification_expiry
    AFTER UPDATE ON staff_qualifications
    FOR EACH ROW 
BEGIN
    -- If qualification has expired, update related shift assignments
    IF NEW.expiry_date < CURRENT_DATE AND OLD.expiry_date >= CURRENT_DATE THEN
        UPDATE shift_assignments sa
        JOIN shifts s ON sa.shift_id = s.id
        SET sa.status = 'cancelled'
        WHERE sa.staff_id = NEW.staff_id
        AND sa.status IN ('assigned', 'confirmed')
        AND s.start_time > CURRENT_TIMESTAMP
        AND JSON_CONTAINS(s.required_qualifications, CAST(NEW.qualification_id AS JSON), '$');
    END IF;
END//

-- =============================================
-- Cleanup and Maintenance Triggers
-- =============================================

CREATE TRIGGER after_shift_cancel
    AFTER UPDATE ON shifts
    FOR EACH ROW 
BEGIN
    IF NEW.status = 'cancelled' AND OLD.status != 'cancelled' THEN
        -- Cancel all related assignments
        UPDATE shift_assignments 
        SET status = 'cancelled'
        WHERE shift_id = NEW.id
        AND status NOT IN ('completed', 'cancelled');
        
        -- Cancel all pending applications
        UPDATE shift_applications
        SET status = 'withdrawn'
        WHERE shift_id = NEW.id
        AND status = 'pending';
    END IF;
END//

CREATE TRIGGER after_staff_deactivation
    AFTER UPDATE ON staff
    FOR EACH ROW 
BEGIN
    IF NEW.account_status != 'active' AND OLD.account_status = 'active' THEN
        -- Cancel future shift assignments
        UPDATE shift_assignments sa
        JOIN shifts s ON sa.shift_id = s.id
        SET sa.status = 'cancelled'
        WHERE sa.staff_id = NEW.id
        AND s.start_time > CURRENT_TIMESTAMP
        AND sa.status NOT IN ('completed', 'cancelled');
        
        -- Withdraw pending applications
        UPDATE shift_applications
        SET status = 'withdrawn'
        WHERE staff_id = NEW.id
        AND status = 'pending';
    END IF;
END//

-- Enhanced triggers.sql with dashboard separation and improved error handling

-- Error logging table with enhanced tracking
CREATE TABLE IF NOT EXISTS error_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    trigger_name VARCHAR(100),
    table_name VARCHAR(100),
    user_id INT,
    user_type ENUM('agency', 'client', 'staff'),
    error_code VARCHAR(10),
    error_message TEXT,
    stack_trace TEXT,
    old_data JSON,
    new_data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user (user_id, user_type),
    INDEX idx_error_code (error_code)
);

-- Audit trail table for tracking important changes
CREATE TABLE IF NOT EXISTS audit_trail (
    id INT PRIMARY KEY AUTO_INCREMENT,
    table_name VARCHAR(100),
    record_id INT,
    user_id INT,
    user_type ENUM('agency', 'client', 'staff'),
    action_type ENUM('INSERT', 'UPDATE', 'DELETE'),
    old_data JSON,
    new_data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_record (table_name, record_id)
);

DELIMITER //

-- Error handler procedure
CREATE PROCEDURE log_error(
    IN p_trigger_name VARCHAR(100),
    IN p_table_name VARCHAR(100),
    IN p_user_id INT,
    IN p_user_type VARCHAR(20),
    IN p_error_code VARCHAR(10),
    IN p_error_message TEXT,
    IN p_old_data JSON,
    IN p_new_data JSON
)
BEGIN
    INSERT INTO error_logs (
        trigger_name, table_name, user_id, user_type, 
        error_code, error_message, old_data, new_data
    ) VALUES (
        p_trigger_name, p_table_name, p_user_id, p_user_type,
        p_error_code, p_error_message, p_old_data, p_new_data
    );
END//

-- =============================================
-- Dashboard Access Control Triggers
-- =============================================

-- Agency Dashboard Access Control
CREATE TRIGGER before_agency_dashboard_access
    BEFORE UPDATE ON agencies
    FOR EACH ROW
BEGIN
    DECLARE current_user_type VARCHAR(20);
    
    -- Get current user type
    SELECT user_type INTO current_user_type 
    FROM users 
    WHERE id = NEW.user_id;
    
    -- Ensure only agency users can modify agency data
    IF current_user_type != 'agency' THEN
        CALL log_error(
            'before_agency_dashboard_access',
            'agencies',
            NEW.user_id,
            current_user_type,
            'AUTH001',
            'Unauthorized access to agency dashboard',
            JSON_OBJECT('id', OLD.id),
            JSON_OBJECT('id', NEW.id)
        );
        
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Unauthorized access to agency dashboard';
    END IF;
END//

-- Client Dashboard Access Control
CREATE TRIGGER before_client_dashboard_access
    BEFORE UPDATE ON clients
    FOR EACH ROW
BEGIN
    DECLARE current_user_type VARCHAR(20);
    
    SELECT user_type INTO current_user_type 
    FROM users 
    WHERE id = NEW.user_id;
    
    IF current_user_type != 'client' THEN
        CALL log_error(
            'before_client_dashboard_access',
            'clients',
            NEW.user_id,
            current_user_type,
            'AUTH002',
            'Unauthorized access to client dashboard',
            JSON_OBJECT('id', OLD.id),
            JSON_OBJECT('id', NEW.id)
        );
        
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Unauthorized access to client dashboard';
    END IF;
END//

-- Staff Dashboard Access Control
CREATE TRIGGER before_staff_dashboard_access
    BEFORE UPDATE ON staff
    FOR EACH ROW
BEGIN
    DECLARE current_user_type VARCHAR(20);
    
    SELECT user_type INTO current_user_type 
    FROM users 
    WHERE id = NEW.user_id;
    
    IF current_user_type != 'staff' THEN
        CALL log_error(
            'before_staff_dashboard_access',
            'staff',
            NEW.user_id,
            current_user_type,
            'AUTH003',
            'Unauthorized access to staff dashboard',
            JSON_OBJECT('id', OLD.id),
            JSON_OBJECT('id', NEW.id)
        );
        
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Unauthorized access to staff dashboard';
    END IF;
END//

-- =============================================
-- Enhanced Shift Management Triggers
-- =============================================

-- Agency-specific shift validation
CREATE TRIGGER before_agency_shift_insert
    BEFORE INSERT ON shifts
    FOR EACH ROW
BEGIN
    DECLARE agency_status VARCHAR(20);
    DECLARE agency_service_radius INT;
    
    IF NEW.agency_id IS NOT NULL THEN
        -- Check agency status
        SELECT status, service_radius 
        INTO agency_status, agency_service_radius
        FROM agencies 
        WHERE id = NEW.agency_id;
        
        IF agency_status != 'active' THEN
            CALL log_error(
                'before_agency_shift_insert',
                'shifts',
                NEW.created_by,
                'agency',
                'SHIFT001',
                'Inactive agency cannot create shifts',
                NULL,
                JSON_OBJECT('shift_id', NEW.id)
            );
            
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Inactive agency cannot create shifts';
        END IF;
        
        -- Validate shift location within agency service radius
        IF ST_Distance_Sphere(
            POINT(NEW.longitude, NEW.latitude),
            (SELECT POINT(longitude, latitude) FROM agencies WHERE id = NEW.agency_id)
        ) > (agency_service_radius * 1000) THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Shift location outside agency service radius';
        END IF;
    END IF;
END//

-- Client-specific shift validation
CREATE TRIGGER before_client_shift_insert
    BEFORE INSERT ON shifts
    FOR EACH ROW
BEGIN
    DECLARE client_status VARCHAR(20);
    
    IF NEW.client_id IS NOT NULL THEN
        -- Check client status
        SELECT status INTO client_status
        FROM clients 
        WHERE id = NEW.client_id;
        
        IF client_status != 'active' THEN
            CALL log_error(
                'before_client_shift_insert',
                'shifts',
                NEW.created_by,
                'client',
                'SHIFT002',
                'Inactive client cannot create shifts',
                NULL,
                JSON_OBJECT('shift_id', NEW.id)
            );
            
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Inactive client cannot create shifts';
        END IF;
    END IF;
END//

-- =============================================
-- Enhanced Staff Assignment Validation
-- =============================================

CREATE TRIGGER before_staff_shift_assignment
    BEFORE INSERT ON shift_assignments
    FOR EACH ROW
BEGIN
    DECLARE shift_creator_type VARCHAR(20);
    DECLARE staff_agency_id INT;
    DECLARE shift_agency_id INT;
    
    -- Get shift creator type and agency
    SELECT 
        creator_type,
        agency_id
    INTO 
        shift_creator_type,
        shift_agency_id
    FROM shifts 
    WHERE id = NEW.shift_id;
    
    -- Get staff's agency
    SELECT agency_id INTO staff_agency_id
    FROM staff 
    WHERE id = NEW.staff_id;
    
    -- Agency-created shifts can only be assigned to their own staff
    IF shift_creator_type = 'agency' 
       AND shift_agency_id IS NOT NULL 
       AND staff_agency_id != shift_agency_id THEN
        CALL log_error(
            'before_staff_shift_assignment',
            'shift_assignments',
            NEW.staff_id,
            'staff',
            'ASSIGN001',
            'Staff can only be assigned to shifts from their agency',
            NULL,
            JSON_OBJECT('assignment_id', NEW.id)
        );
        
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Staff can only be assigned to shifts from their agency';
    END IF;
END//

-- =============================================
-- Enhanced Payment Processing
-- =============================================

CREATE TRIGGER before_payment_processing
    BEFORE INSERT ON payments
    FOR EACH ROW
BEGIN
    DECLARE shift_type VARCHAR(20);
    DECLARE agency_commission DECIMAL(4,2);
    DECLARE base_amount DECIMAL(10,2);
    
    -- Get shift type and calculate commission
    SELECT 
        s.creator_type,
        COALESCE(a.commission_rate, 0)
    INTO 
        shift_type,
        agency_commission
    FROM shift_assignments sa
    JOIN shifts s ON sa.shift_id = s.id
    LEFT JOIN agencies a ON s.agency_id = a.id
    WHERE sa.id = NEW.shift_assignment_id;
    
    -- Calculate base amount
    SET base_amount = NEW.amount;
    
    -- Apply commission based on shift type
    IF shift_type = 'agency' THEN
        SET NEW.commission_amount = base_amount * (agency_commission / 100);
    ELSE
        SET NEW.commission_amount = base_amount * 0.05; -- 5% platform fee for direct client bookings
    END IF;
    
    -- Validate payment amount
    IF NEW.amount <= 0 THEN
        CALL log_error(
            'before_payment_processing',
            'payments',
            NEW.staff_id,
            'payment',
            'PAY001',
            'Invalid payment amount',
            NULL,
            JSON_OBJECT('payment_id', NEW.id)
        );
        
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Invalid payment amount';
    END IF;
END//

-- =============================================
-- Enhanced Rating System
-- =============================================

CREATE TRIGGER before_rating_insert
    BEFORE UPDATE ON shift_assignments
    FOR EACH ROW
BEGIN
    -- Validate rating range
    IF NEW.staff_rating IS NOT NULL AND (NEW.staff_rating < 1 OR NEW.staff_rating > 5) THEN
        CALL log_error(
            'before_rating_insert',
            'shift_assignments',
            NEW.staff_id,
            'rating',
            'RATE001',
            'Invalid rating value',
            JSON_OBJECT('old_rating', OLD.staff_rating),
            JSON_OBJECT('new_rating', NEW.staff_rating)
        );
        
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Rating must be between 1 and 5';
    END IF;
    
    -- Ensure shift is completed before rating
    IF NEW.staff_rating IS NOT NULL AND NEW.status != 'completed' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot rate incomplete shift';
    END IF;
END//

-- =============================================
-- System Maintenance Triggers
-- =============================================

-- Automatic status updates for expired shifts
CREATE EVENT hourly_shift_status_update
    ON SCHEDULE EVERY 1 HOUR
    DO
    BEGIN
        -- Update overdue shifts
        UPDATE shifts 
        SET status = 'cancelled'
        WHERE status IN ('draft', 'published') 
        AND start_time < NOW();
        
        -- Mark no-shows
        UPDATE shift_assignments sa
        JOIN shifts s ON sa.shift_id = s.id
        SET sa.status = 'no_show'
        WHERE sa.status = 'assigned'
        AND s.start_time < NOW() - INTERVAL 30 MINUTE
        AND sa.clock_in_time IS NULL;
    END//

    -- Enhanced triggers.sql with dashboard separation and improved error handling

-- Error logging table with enhanced tracking
CREATE TABLE IF NOT EXISTS error_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    trigger_name VARCHAR(100),
    table_name VARCHAR(100),
    user_id INT,
    user_type ENUM('agency', 'client', 'staff'),
    error_code VARCHAR(10),
    error_message TEXT,
    stack_trace TEXT,
    old_data JSON,
    new_data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user (user_id, user_type),
    INDEX idx_error_code (error_code)
);

-- Audit trail table for tracking important changes
CREATE TABLE IF NOT EXISTS audit_trail (
    id INT PRIMARY KEY AUTO_INCREMENT,
    table_name VARCHAR(100),
    record_id INT,
    user_id INT,
    user_type ENUM('agency', 'client', 'staff'),
    action_type ENUM('INSERT', 'UPDATE', 'DELETE'),
    old_data JSON,
    new_data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_record (table_name, record_id)
);

DELIMITER //

-- Error handler procedure
CREATE PROCEDURE log_error(
    IN p_trigger_name VARCHAR(100),
    IN p_table_name VARCHAR(100),
    IN p_user_id INT,
    IN p_user_type VARCHAR(20),
    IN p_error_code VARCHAR(10),
    IN p_error_message TEXT,
    IN p_old_data JSON,
    IN p_new_data JSON
)
BEGIN
    INSERT INTO error_logs (
        trigger_name, table_name, user_id, user_type, 
        error_code, error_message, old_data, new_data
    ) VALUES (
        p_trigger_name, p_table_name, p_user_id, p_user_type,
        p_error_code, p_error_message, p_old_data, p_new_data
    );
END//

-- =============================================
-- Dashboard Access Control Triggers
-- =============================================

-- Agency Dashboard Access Control
CREATE TRIGGER before_agency_dashboard_access
    BEFORE UPDATE ON agencies
    FOR EACH ROW
BEGIN
    DECLARE current_user_type VARCHAR(20);
    
    -- Get current user type
    SELECT user_type INTO current_user_type 
    FROM users 
    WHERE id = NEW.user_id;
    
    -- Ensure only agency users can modify agency data
    IF current_user_type != 'agency' THEN
        CALL log_error(
            'before_agency_dashboard_access',
            'agencies',
            NEW.user_id,
            current_user_type,
            'AUTH001',
            'Unauthorized access to agency dashboard',
            JSON_OBJECT('id', OLD.id),
            JSON_OBJECT('id', NEW.id)
        );
        
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Unauthorized access to agency dashboard';
    END IF;
END//

-- Client Dashboard Access Control
CREATE TRIGGER before_client_dashboard_access
    BEFORE UPDATE ON clients
    FOR EACH ROW
BEGIN
    DECLARE current_user_type VARCHAR(20);
    
    SELECT user_type INTO current_user_type 
    FROM users 
    WHERE id = NEW.user_id;
    
    IF current_user_type != 'client' THEN
        CALL log_error(
            'before_client_dashboard_access',
            'clients',
            NEW.user_id,
            current_user_type,
            'AUTH002',
            'Unauthorized access to client dashboard',
            JSON_OBJECT('id', OLD.id),
            JSON_OBJECT('id', NEW.id)
        );
        
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Unauthorized access to client dashboard';
    END IF;
END//

-- Staff Dashboard Access Control
CREATE TRIGGER before_staff_dashboard_access
    BEFORE UPDATE ON staff
    FOR EACH ROW
BEGIN
    DECLARE current_user_type VARCHAR(20);
    
    SELECT user_type INTO current_user_type 
    FROM users 
    WHERE id = NEW.user_id;
    
    IF current_user_type != 'staff' THEN
        CALL log_error(
            'before_staff_dashboard_access',
            'staff',
            NEW.user_id,
            current_user_type,
            'AUTH003',
            'Unauthorized access to staff dashboard',
            JSON_OBJECT('id', OLD.id),
            JSON_OBJECT('id', NEW.id)
        );
        
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Unauthorized access to staff dashboard';
    END IF;
END//

-- =============================================
-- Enhanced Shift Management Triggers
-- =============================================

-- Agency-specific shift validation
CREATE TRIGGER before_agency_shift_insert
    BEFORE INSERT ON shifts
    FOR EACH ROW
BEGIN
    DECLARE agency_status VARCHAR(20);
    DECLARE agency_service_radius INT;
    
    IF NEW.agency_id IS NOT NULL THEN
        -- Check agency status
        SELECT status, service_radius 
        INTO agency_status, agency_service_radius
        FROM agencies 
        WHERE id = NEW.agency_id;
        
        IF agency_status != 'active' THEN
            CALL log_error(
                'before_agency_shift_insert',
                'shifts',
                NEW.created_by,
                'agency',
                'SHIFT001',
                'Inactive agency cannot create shifts',
                NULL,
                JSON_OBJECT('shift_id', NEW.id)
            );
            
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Inactive agency cannot create shifts';
        END IF;
        
        -- Validate shift location within agency service radius
        IF ST_Distance_Sphere(
            POINT(NEW.longitude, NEW.latitude),
            (SELECT POINT(longitude, latitude) FROM agencies WHERE id = NEW.agency_id)
        ) > (agency_service_radius * 1000) THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Shift location outside agency service radius';
        END IF;
    END IF;
END//

-- Client-specific shift validation
CREATE TRIGGER before_client_shift_insert
    BEFORE INSERT ON shifts
    FOR EACH ROW
BEGIN
    DECLARE client_status VARCHAR(20);
    
    IF NEW.client_id IS NOT NULL THEN
        -- Check client status
        SELECT status INTO client_status
        FROM clients 
        WHERE id = NEW.client_id;
        
        IF client_status != 'active' THEN
            CALL log_error(
                'before_client_shift_insert',
                'shifts',
                NEW.created_by,
                'client',
                'SHIFT002',
                'Inactive client cannot create shifts',
                NULL,
                JSON_OBJECT('shift_id', NEW.id)
            );
            
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Inactive client cannot create shifts';
        END IF;
    END IF;
END//

-- =============================================
-- Enhanced Staff Assignment Validation
-- =============================================

CREATE TRIGGER before_staff_shift_assignment
    BEFORE INSERT ON shift_assignments
    FOR EACH ROW
BEGIN
    DECLARE shift_creator_type VARCHAR(20);
    DECLARE staff_agency_id INT;
    DECLARE shift_agency_id INT;
    
    -- Get shift creator type and agency
    SELECT 
        creator_type,
        agency_id
    INTO 
        shift_creator_type,
        shift_agency_id
    FROM shifts 
    WHERE id = NEW.shift_id;
    
    -- Get staff's agency
    SELECT agency_id INTO staff_agency_id
    FROM staff 
    WHERE id = NEW.staff_id;
    
    -- Agency-created shifts can only be assigned to their own staff
    IF shift_creator_type = 'agency' 
       AND shift_agency_id IS NOT NULL 
       AND staff_agency_id != shift_agency_id THEN
        CALL log_error(
            'before_staff_shift_assignment',
            'shift_assignments',
            NEW.staff_id,
            'staff',
            'ASSIGN001',
            'Staff can only be assigned to shifts from their agency',
            NULL,
            JSON_OBJECT('assignment_id', NEW.id)
        );
        
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Staff can only be assigned to shifts from their agency';
    END IF;
END//

-- =============================================
-- Enhanced Payment Processing
-- =============================================

CREATE TRIGGER before_payment_processing
    BEFORE INSERT ON payments
    FOR EACH ROW
BEGIN
    DECLARE shift_type VARCHAR(20);
    DECLARE agency_commission DECIMAL(4,2);
    DECLARE base_amount DECIMAL(10,2);
    
    -- Get shift type and calculate commission
    SELECT 
        s.creator_type,
        COALESCE(a.commission_rate, 0)
    INTO 
        shift_type,
        agency_commission
    FROM shift_assignments sa
    JOIN shifts s ON sa.shift_id = s.id
    LEFT JOIN agencies a ON s.agency_id = a.id
    WHERE sa.id = NEW.shift_assignment_id;
    
    -- Calculate base amount
    SET base_amount = NEW.amount;
    
    -- Apply commission based on shift type
    IF shift_type = 'agency' THEN
        SET NEW.commission_amount = base_amount * (agency_commission / 100);
    ELSE
        SET NEW.commission_amount = base_amount * 0.05; -- 5% platform fee for direct client bookings
    END IF;
    
    -- Validate payment amount
    IF NEW.amount <= 0 THEN
        CALL log_error(
            'before_payment_processing',
            'payments',
            NEW.staff_id,
            'payment',
            'PAY001',
            'Invalid payment amount',
            NULL,
            JSON_OBJECT('payment_id', NEW.id)
        );
        
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Invalid payment amount';
    END IF;
END//

-- =============================================
-- Enhanced Rating System
-- =============================================

CREATE TRIGGER before_rating_insert
    BEFORE UPDATE ON shift_assignments
    FOR EACH ROW
BEGIN
    -- Validate rating range
    IF NEW.staff_rating IS NOT NULL AND (NEW.staff_rating < 1 OR NEW.staff_rating > 5) THEN
        CALL log_error(
            'before_rating_insert',
            'shift_assignments',
            NEW.staff_id,
            'rating',
            'RATE001',
            'Invalid rating value',
            JSON_OBJECT('old_rating', OLD.staff_rating),
            JSON_OBJECT('new_rating', NEW.staff_rating)
        );
        
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Rating must be between 1 and 5';
    END IF;
    
    -- Ensure shift is completed before rating
    IF NEW.staff_rating IS NOT NULL AND NEW.status != 'completed' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot rate incomplete shift';
    END IF;
END//

-- =============================================
-- System Maintenance Triggers
-- =============================================

-- Automatic status updates for expired shifts
CREATE EVENT hourly_shift_status_update
    ON SCHEDULE EVERY 1 HOUR
    DO
    BEGIN
        -- Update overdue shifts
        UPDATE shifts 
        SET status = 'cancelled'
        WHERE status IN ('draft', 'published') 
        AND start_time < NOW();
        
        -- Mark no-shows
        UPDATE shift_assignments sa
        JOIN shifts s ON sa.shift_id = s.id
        SET sa.status = 'no_show'
        WHERE sa.status = 'assigned'
        AND s.start_time < NOW() - INTERVAL 30 MINUTE
        AND sa.clock_in_time IS NULL;
    END//

DELIMITER ;

-- Add indexes for performance
CREATE INDEX idx_shift_assignments_status ON shift_assignments(status);
CREATE INDEX idx_shifts_datetime ON shifts(start_time, end_time);
CREATE INDEX idx_staff_location ON staff(latitude, longitude);
CREATE SPATIAL INDEX idx_shift_location ON shifts(POINT(longitude, latitude));
