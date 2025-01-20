-- Staff Performance Analytics View
CREATE OR REPLACE VIEW staff_performance_analytics AS
SELECT 
    s.id as staff_id,
    u.first_name,
    u.last_name,
    COUNT(sa.shift_id) as total_shifts_completed,
    AVG(sp.rating) as average_rating,
    COUNT(DISTINCT c.id) as unique_clients_served,
    SUM(sh.hourly_rate * TIMESTAMPDIFF(HOUR, sh.start_time, sh.end_time)) as total_earnings,
    COUNT(CASE WHEN sa.status = 'completed' THEN 1 END) / COUNT(*) * 100 as completion_rate
FROM 
    users s
    JOIN user_roles ur ON s.role = ur.role_name
    LEFT JOIN shift_assignments sa ON s.id = sa.staff_id
    LEFT JOIN shifts sh ON sa.shift_id = sh.id
    LEFT JOIN staff_performance sp ON s.id = sp.staff_id
    LEFT JOIN users c ON sh.client_id = c.id
WHERE 
    ur.role_name = 'staff_member'
GROUP BY 
    s.id, u.first_name, u.last_name;

-- Financial Analytics View
CREATE OR REPLACE VIEW financial_analytics AS
SELECT 
    DATE_FORMAT(sh.start_time, '%Y-%m') as period,
    COUNT(sh.id) as total_shifts,
    SUM(sh.hourly_rate * TIMESTAMPDIFF(HOUR, sh.start_time, sh.end_time)) as gross_revenue,
    SUM(ea.client_fee_amount) as platform_fees,
    SUM(ea.staff_fee_amount) as staff_fees,
    SUM(ea.agency_fee_amount) as agency_fees,
    COUNT(DISTINCT sh.client_id) as active_clients,
    COUNT(DISTINCT sa.staff_id) as active_staff
FROM 
    shifts sh
    LEFT JOIN escrow_accounts ea ON sh.id = ea.shift_id
    LEFT JOIN shift_assignments sa ON sh.id = sa.shift_id
WHERE 
    sh.status = 'completed'
GROUP BY 
    DATE_FORMAT(sh.start_time, '%Y-%m')
ORDER BY 
    period DESC;
