DELIMITER //

CREATE PROCEDURE track_agency_performance(
    IN p_agency_id INT,
    IN p_start_date DATE,
    IN p_end_date DATE
)
BEGIN
    -- Agency performance metrics
    SELECT 
        a.company_name AS agency_name,
        COUNT(DISTINCT s.id) AS total_shifts_managed,
        COUNT(DISTINCT s.client_id) AS unique_clients,
        COUNT(DISTINCT sa.staff_id) AS active_staff,
        AVG(sa.client_rating) AS average_client_satisfaction,
        SUM(p.amount) AS total_revenue,
        SUM(p.commission_amount) AS total_commission,
        (COUNT(CASE WHEN sa.status = 'completed' THEN 1 END) * 100.0 / COUNT(*)) AS completion_rate,
        (COUNT(CASE WHEN sa.status = 'no_show' THEN 1 END) * 100.0 / COUNT(*)) AS no_show_rate
    FROM agencies a
    LEFT JOIN shifts s ON a.id = s.agency_id
    LEFT JOIN shift_assignments sa ON s.id = sa.shift_id
    LEFT JOIN payments p ON sa.id = p.shift_assignment_id
    WHERE a.id = p_agency_id
    AND s.start_time BETWEEN p_start_date AND p_end_date
    GROUP BY a.company_name;
END //

DELIMITER ;
