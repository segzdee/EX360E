-- Active Shifts View
CREATE OR REPLACE VIEW active_shifts_view AS
SELECT 
    s.id,
    s.title,
    s.start_time,
    s.end_time,
    s.hourly_rate,
    c.name as client_name,
    COALESCE(sa.staff_id, 'Unassigned') as staff_id
FROM 
    shifts s
LEFT JOIN 
    users c ON s.client_id = c.id
LEFT JOIN 
    shift_assignments sa ON s.id = sa.shift_id
WHERE 
    s.status = 'open';

-- Financial Summary View
CREATE OR REPLACE VIEW financial_summary_view AS
SELECT 
    c.id as client_id,
    c.name as client_name,
    COUNT(s.id) as total_shifts,
    SUM(s.hourly_rate * TIMESTAMPDIFF(HOUR, s.start_time, s.end_time)) as total_amount,
    AVG(s.hourly_rate) as average_rate
FROM 
    users c
LEFT JOIN 
    shifts s ON c.id = s.client_id
GROUP BY 
    c.id, c.name;
