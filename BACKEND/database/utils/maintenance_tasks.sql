DELIMITER //

-- Table Optimization Procedure
CREATE PROCEDURE optimize_database()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE tbl_name VARCHAR(255);
    DECLARE cur CURSOR FOR 
        SELECT TABLE_NAME 
        FROM information_schema.TABLES 
        WHERE TABLE_SCHEMA = 'extrastaff360';
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    OPEN cur;
    read_loop: LOOP
        FETCH cur INTO tbl_name;
        IF done THEN
            LEAVE read_loop;
        END IF;
        SET @sql = CONCAT('OPTIMIZE TABLE ', tbl_name);
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END LOOP;
    CLOSE cur;
END //

-- Database Health Check Procedure
CREATE PROCEDURE check_database_health()
BEGIN
    -- Check for fragmented tables
    SELECT 
        TABLE_NAME,
        DATA_FREE,
        DATA_LENGTH,
        INDEX_LENGTH
    FROM information_schema.TABLES
    WHERE TABLE_SCHEMA = 'extrastaff360'
    AND DATA_FREE > 0;

    -- Check for missing indexes on foreign keys
    SELECT 
        TABLE_NAME,
        COLUMN_NAME
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = 'extrastaff360'
    AND COLUMN_NAME LIKE '%_id'
    AND COLUMN_NAME NOT IN (
        SELECT COLUMN_NAME
        FROM information_schema.STATISTICS
        WHERE TABLE_SCHEMA = 'extrastaff360'
    );
END //

DELIMITER ;
