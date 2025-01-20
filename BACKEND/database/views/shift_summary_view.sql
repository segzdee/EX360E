CREATE OR REPLACE VIEW shift_summary_view AS
SELECT 
    s.id AS shift_id,
    s.title,
    s.description,
    s.location,
    s.start_time,
    s.end_time,
    s.pay_rate,
    s.status,
    c.company_name AS client_name,
    a.company_name AS agency_name,
    COUNT(DISTINCT sa.staff_id) AS assigned_staff_count,
    s.positions_available - COUNT(DISTINCT sa.staff_id) AS remaining_positions,
    GROUP_CONCAT(DISTINCT q.name) AS required_qualifications
FROM shifts s
LEFT JOIN clients c ON s.client_id = c.id
LEFT JOIN agencies a ON s.agency_id = a.id
LEFT JOIN shift_assignments sa ON s.id = sa.shift_id
LEFT JOIN JSON_TABLE(s.required_qualifications, '$[*]' COLUMNS (qual_id INT PATH '$')) AS rq
LEFT JOIN qualifications q ON rq.qual_id = q.id
GROUP BY s.id;
