CREATE OR REPLACE VIEW financial_analytics_view AS
SELECT 
    DATE_FORMAT(s.start_time, '%Y-%m') AS period,
    c.company_name AS client_name,
    a.company_name AS agency_name,
    COUNT(DISTINCT s.id) AS total_shifts,
    SUM(s.pay_rate * TIMESTAMPDIFF(HOUR, s.start_time, s.end_time)) AS total_revenue,
    SUM(p.commission_amount) AS total_commission,
    AVG(sa.client_rating) AS average_client_satisfaction,
    COUNT(CASE WHEN sa.status = 'no_show' THEN 1 END) AS no_shows
FROM shifts s
LEFT JOIN clients c ON s.client_id = c.id
LEFT JOIN agencies a ON s.agency_id = a.id
LEFT JOIN shift_assignments sa ON s.id = sa.shift_id
LEFT JOIN payments p ON sa.id = p.shift_assignment_id
WHERE s.status = 'completed'
GROUP BY DATE_FORMAT(s.start_time, '%Y-%m'), c.company_name, a.company_name;
