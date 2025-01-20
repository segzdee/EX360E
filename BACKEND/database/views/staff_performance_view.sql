CREATE OR REPLACE VIEW staff_performance_view AS
SELECT 
    st.id AS staff_id,
    st.first_name,
    st.last_name,
    a.company_name AS agency_name,
    COUNT(sa.id) AS total_shifts_completed,
    AVG(sa.client_rating) AS average_rating,
    SUM(CASE WHEN sa.status = 'no_show' THEN 1 ELSE 0 END) AS no_show_count,
    AVG(TIMESTAMPDIFF(MINUTE, s.start_time, sa.clock_in_time)) AS average_arrival_time,
    SUM(p.amount) AS total_earnings,
    COUNT(DISTINCT c.id) AS unique_clients_served
FROM staff st
LEFT JOIN agencies a ON st.agency_id = a.id
LEFT JOIN shift_assignments sa ON st.id = sa.staff_id
LEFT JOIN shifts s ON sa.shift_id = s.id
LEFT JOIN payments p ON sa.id = p.shift_assignment_id
LEFT JOIN clients c ON s.client_id = c.id
WHERE sa.status = 'completed'
GROUP BY st.id, st.first_name, st.last_name, a.company_name;
