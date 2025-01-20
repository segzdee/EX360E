-- Check if the procedure exists
DROP PROCEDURE IF EXISTS process_escrow_payment;

DELIMITER //

CREATE PROCEDURE process_escrow_payment(
    IN p_shift_id INT,
    IN p_client_id INT,
    IN p_amount DECIMAL(10,2),
    IN p_agency_id INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        -- Log the error (you'll need to implement a logging mechanism)
        SELECT "An error occurred in process_escrow_payment";
        ROLLBACK;
    END;

    -- Validate p_amount
    IF p_amount <= 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid amount. Amount must be greater than zero.';
    END IF;

    -- Calculate fees
    DECLARE v_client_fee DECIMAL(10,2);
    DECLARE v_staff_fee DECIMAL(10,2);
    DECLARE v_agency_fee DECIMAL(10,2);
    DECLARE v_escrow_id INT;

    -- Calculate fees
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
    INSERT INTO escrow_accounts (
        shift_id,
        client_id,
        total_amount,
        client_fee_amount,
        staff_fee_amount,
        agency_fee_amount,
        status
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
    INSERT INTO transaction_history (
        escrow_id,
        transaction_type,
        amount,
        recipient_type,
        recipient_id,
        status
    ) VALUES (
        v_escrow_id,
        'deposit',
        p_amount + v_client_fee,
        'platform',
        1,
        'completed'
    );

    COMMIT;
END //

DELIMITER ;
