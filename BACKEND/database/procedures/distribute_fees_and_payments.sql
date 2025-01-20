-- Check if the procedure exists
DROP PROCEDURE IF EXISTS distribute_fees_and_payments;

DELIMITER //

CREATE PROCEDURE distribute_fees_and_payments(
    IN p_escrow_id INT
)
BEGIN
    DECLARE v_total_amount DECIMAL(10,2);
    DECLARE v_client_fee DECIMAL(10,2);
    DECLARE v_staff_fee DECIMAL(10,2);
    DECLARE v_agency_fee DECIMAL(10,2);
    DECLARE v_staff_id INT;
    DECLARE v_agency_id INT;
    
    -- Get escrow details
    SELECT 
        total_amount,
        client_fee_amount,
        staff_fee_amount,
        agency_fee_amount,
        sa.staff_id,
        s.agency_id
    INTO 
        v_total_amount,
        v_client_fee,
        v_staff_fee,
        v_agency_fee,
        v_staff_id,
        v_agency_id
    FROM escrow_accounts ea
    JOIN shifts s ON ea.shift_id = s.id
    JOIN shift_assignments sa ON s.id = sa.shift_id
    WHERE ea.id = p_escrow_id;

    START TRANSACTION;
    
    -- Record platform fee collection
    INSERT INTO transaction_history (
        escrow_id,
        transaction_type,
        amount,
        recipient_type,
        recipient_id,
        status
    ) VALUES
    (p_escrow_id, 'fee_deduction', v_client_fee, 'platform', 1, 'completed');

    -- Pay staff
    INSERT INTO transaction_history (
        escrow_id,
        transaction_type,
        amount,
        recipient_type,
        recipient_id,
        status
    ) VALUES
    (p_escrow_id, 'payment_release', 
     v_total_amount - v_staff_fee - COALESCE(v_agency_fee, 0),
     'staff', v_staff_id, 'pending');

    -- Pay agency if involved
    IF v_agency_id IS NOT NULL THEN
        INSERT INTO transaction_history (
            escrow_id,
            transaction_type,
            amount,
            recipient_type,
            recipient_id,
            status
        ) VALUES
        (p_escrow_id, 'payment_release',
         v_total_amount - v_agency_fee,
         'agency', v_agency_id, 'pending');
    END IF;

    -- Update escrow status
    UPDATE escrow_accounts
    SET status = 'processing'
    WHERE id = p_escrow_id;

    COMMIT;
END //

DELIMITER ;
