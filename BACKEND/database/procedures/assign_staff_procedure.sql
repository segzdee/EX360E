DELIMITER //

CREATE PROCEDURE assign_staff_to_shift(
    IN p_shift_id INT,
    IN p_staff_id INT,
    IN p_status ENUM('assigned', 'checked_in', 'checked_out', 'completed', 'no_show', 'cancelled')
)
BEGIN
    DECLARE v_positions_filled INT;
    DECLARE v_positions_available INT;
    
    -- Check if shift exists and has available positions
    SELECT positions_filled, positions_available 
    INTO v_positions_filled, v_positions_available
    FROM shifts WHERE id = p_shift_id;
    
    IF v_positions_filled >= v_positions_available THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'No positions available for this shift';
    END IF;
    
    -- Insert assignment
    INSERT INTO shift_assignments (
        shift_id,
        staff_id,
        status,
        created_at
    ) VALUES (
        p_shift_id,
        p_staff_id,
        p_status,
        NOW()
    );
    
    -- Update shift positions filled
    UPDATE shifts 
    SET positions_filled = positions_filled + 1
    WHERE id = p_shift_id;
    
    -- Update staff availability
    UPDATE staff
    SET availability_status = 'working'
    WHERE id = p_staff_id;
END //

DELIMITER ;
