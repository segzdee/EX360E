DELIMITER //

CREATE PROCEDURE process_shift_payment(
    IN p_shift_assignment_id INT
)
BEGIN
    DECLARE v_amount DECIMAL(10,2);
    DECLARE v_commission_rate DECIMAL(4,2);
    DECLARE v_commission_amount DECIMAL(10,2);
    
    -- Calculate payment amount
    SELECT 
        (TIMESTAMPDIFF(HOUR, sa.clock_in_time, sa.clock_out_time) * s.pay_rate)
    INTO v_amount
    FROM shift_assignments sa
    JOIN shifts s ON sa.shift_id = s.id
    WHERE sa.id = p_shift_assignment_id;
    
    -- Get commission rate
    SELECT commission_rate INTO v_commission_rate
    FROM agencies a
    JOIN staff st ON st.agency_id = a.id
    JOIN shift_assignments sa ON sa.staff_id = st.id
    WHERE sa.id = p_shift_assignment_id;
    
    -- Calculate commission
    SET v_commission_amount = v_amount * (v_commission_rate / 100);
    
    -- Insert payment record
    INSERT INTO payments (
        shift_assignment_id,
        amount,
        commission_amount,
        payment_status,
        created_at
    ) VALUES (
        p_shift_assignment_id,
        v_amount,
        v_commission_amount,
        'pending',
        NOW()
    );
    
    -- Update shift assignment status
    UPDATE shift_assignments
    SET status = 'completed'
    WHERE id = p_shift_assignment_id;
END //

DELIMITER ;
