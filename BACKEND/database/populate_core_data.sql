USE extrastaff360;

-- Populate user_roles table
INSERT INTO user_roles (role_name, description) VALUES
('system_administrator', 'Complete system access with full control over all features and settings'),
('client_administrator', 'Management access for client organization with control over shifts and staff'),
('staff_member', 'Access to view and apply for shifts, manage availability, and track earnings'),
('agency_administrator', 'Management access for agency operations, staff, and client relationships'),
('support_specialist', 'Access to handle customer support tickets and user assistance');

-- Populate user_role_permissions table
INSERT INTO user_role_permissions (role_id, permission) VALUES
-- System Administrator Permissions
((SELECT id FROM user_roles WHERE role_name = 'system_administrator'), 'manage_users'),
((SELECT id FROM user_roles WHERE role_name = 'system_administrator'), 'manage_roles'),
((SELECT id FROM user_roles WHERE role_name = 'system_administrator'), 'manage_system'),
((SELECT id FROM user_roles WHERE role_name = 'system_administrator'), 'view_analytics'),

-- Client Administrator Permissions
((SELECT id FROM user_roles WHERE role_name = 'client_administrator'), 'post_shifts'),
((SELECT id FROM user_roles WHERE role_name = 'client_administrator'), 'manage_staff'),
((SELECT id FROM user_roles WHERE role_name = 'client_administrator'), 'view_reports'),
((SELECT id FROM user_roles WHERE role_name = 'client_administrator'), 'manage_payments'),

-- Staff Member Permissions
((SELECT id FROM user_roles WHERE role_name = 'staff_member'), 'view_shifts'),
((SELECT id FROM user_roles WHERE role_name = 'staff_member'), 'apply_shifts'),
((SELECT id FROM user_roles WHERE role_name = 'staff_member'), 'track_earnings'),
((SELECT id FROM user_roles WHERE role_name = 'staff_member'), 'update_profile'),

-- Agency Administrator Permissions
((SELECT id FROM user_roles WHERE role_name = 'agency_administrator'), 'manage_agency_staff'),
((SELECT id FROM user_roles WHERE role_name = 'agency_administrator'), 'view_agency_reports'),
((SELECT id FROM user_roles WHERE role_name = 'agency_administrator'), 'manage_agency_shifts'),

-- Support Specialist Permissions
((SELECT id FROM user_roles WHERE role_name = 'support_specialist'), 'manage_tickets'),
((SELECT id FROM user_roles WHERE role_name = 'support_specialist'), 'view_user_data');

-- Populate skills table
INSERT INTO skills (skill_name, description) VALUES
('bartending', 'Expertise in cocktail preparation, wine service, and bar operations management'),
('food_service', 'Professional food service experience including table service and guest relations'),
('kitchen_operations', 'Knowledge of kitchen procedures, food preparation, and safety standards'),
('housekeeping', 'Proficiency in cleaning, room preparation, and maintaining facility standards'),
('front_desk', 'Experience in guest check-in/out, reservation management, and guest services'),
('event_management', 'Skills in coordinating and executing events, conferences, and functions'),
('security', 'Training in facility security, guest safety, and emergency procedures'),
('maintenance', 'Technical skills in facility maintenance and basic repairs'),
('concierge', 'Knowledge of local attractions, transportation, and guest assistance'),
('inventory_management', 'Experience in stock control, ordering, and supply management');

-- Populate training_modules table
INSERT INTO training_modules (name, description, content) VALUES
('Safety_Fundamentals', 'Essential workplace safety protocols and procedures', 'Comprehensive safety guidelines including emergency procedures, fire safety, and accident prevention'),
('Customer_Service_Excellence', 'Advanced customer service skills and standards', 'Detailed training on guest interaction, problem-solving, and service recovery techniques'),
('Food_Safety_Certification', 'Food handling and safety certification program', 'Complete food safety guidelines, hygiene standards, and certification requirements'),
('Hospitality_Systems', 'Training on hospitality management systems', 'Detailed instruction on POS systems, booking software, and management platforms'),
('Communication_Skills', 'Professional communication in hospitality', 'Training on effective communication, conflict resolution, and team collaboration');

-- Populate badges table
INSERT INTO badges (name, description, icon) VALUES
('Shift_Master', 'Completed 50 successful shifts', 'badge_shift_master.png'),
('Service_Star', 'Maintained 4.8+ rating for 3 months', 'badge_service_star.png'),
('Safety_Champion', 'Completed all safety training modules', 'badge_safety_champion.png'),
('Team_Leader', 'Successfully led team operations', 'badge_team_leader.png'),
('Perfect_Attendance', 'Zero shift cancellations in 6 months', 'badge_attendance.png'),
('Client_Favorite', 'Received excellent client feedback', 'badge_client_favorite.png'),
('Skills_Expert', 'Mastered multiple skill categories', 'badge_skills_expert.png'),
('Training_Achiever', 'Completed all training modules', 'badge_training.png'),
('Quick_Responder', 'Exceptional response time to shift requests', 'badge_responder.png'),
('Reliability_Star', 'Outstanding reliability rating', 'badge_reliability.png');
