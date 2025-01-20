DELIMITER //

CREATE PROCEDURE generate_client_report(
    IN p_client_id INT,
    IN p_start_date DATE,
    IN p_end_date DATE
)
BEGIN
    -- Client shift statistics
    WITH shift_stats AS (
        SELECT 
            COUNT(*) AS total_shifts,
            SUM(positions_available) AS total_positions,
            SUM(positions_filled) AS filled_positions,
            AVG(pay_rate) AS average_pay_rate
        FROM shifts 
        WHERE client_id = p_client_id
        AND start_time BETWEEN p_start_date AND p_end_date
    ),
    -- Staff performance metrics
    staff_metrics AS (
        SELECT 
            AVG(sa.client_rating) AS average_staff_rating,
            COUNT(DISTINCT sa.staff_id) AS unique_staff_count,
            SUM(CASE WHEN sa.status = 'no_show' THEN 1 ELSE 0 END) AS total_no_shows
        FROM shift_assignments sa
        JOIN shifts s ON sa.shift_id = s.id
        WHERE s.client_id = p_client_id
        AND s.start_time BETWEEN p_start_date AND p_end_date
    ),
    -- Financial summary
    financial_summary AS (
        SELECT 
            SUM(p.amount) AS total_spend,
            SUM(p.commission_amount) AS total_commission,
            COUNT(DISTINCT s.id) AS paid_shifts
        FROM payments p
        JOIN shift_assignments sa ON p.shift_assignment_id = sa.id
        JOIN shifts s ON sa.shift_id = s.id
        WHERE s.client_id = p_client_id
        AND s.start_time BETWEEN p_start_date AND p_end_date
    )
    
    SELECT 
        c.company_name,
        ss.total_shifts,
        ss.total_positions,
        ss.filled_positions,
        ss.average_pay_rate,
        sm.average_staff_rating,
        sm.unique_staff_count,
        sm.total_no_shows,
        fs.total_spend,
        fs.total_commission,
        fs.paid_shifts
    FROM clients c
    CROSS JOIN shift_stats ss
    CROSS JOIN staff_metrics sm
    CROSS JOIN financial_summary fs
    WHERE c.id = p_client_id;
END //

DELIMITER ;
