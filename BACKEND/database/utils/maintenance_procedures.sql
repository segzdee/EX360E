DELIMITER //

-- Database Maintenance Procedures
CREATE PROCEDURE cleanup_old_records()
BEGIN
    DELETE FROM audit_logs WHERE created_at < DATE_SUB(NOW(), INTERVAL 6 MONTH);
    DELETE FROM staff_location_tracking WHERE timestamp < DATE_SUB(NOW(), INTERVAL 3 MONTH);
END //

CREATE PROCEDURE optimize_tables()
BEGIN
    OPTIMIZE TABLE users, shifts, transaction_history, shift_assignments;
END //

DELIMITER ;
