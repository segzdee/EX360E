CREATE OR REPLACE VIEW staff_availability_view AS
SELECT 
    s.id AS staff_id,
    s.first_name,
    s.last_name,
    s.availability_status,
    s.max_travel_distance,
    s.hourly_rate,
    s.rating,
    GROUP_CONCAT(DISTINCT sq.qualification_id) AS qualifications,
    s.latitude,
    s.longitude,
    a.id AS agency_id,
    a.company_name AS agency_name
FROM staff s
LEFT JOIN staff_qualifications sq ON s.id = sq.staff_id
LEFT JOIN agencies a ON s.agency_id = a.id
WHERE s.account_status = 'active'
GROUP BY s.id;
