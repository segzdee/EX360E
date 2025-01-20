USE extrastaff360;

-- Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create user_role_permissions table
CREATE TABLE IF NOT EXISTS user_role_permissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    role_id INT NOT NULL,
    permission VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES user_roles(id)
);

-- Create skills table
CREATE TABLE IF NOT EXISTS skills (
    id INT PRIMARY KEY AUTO_INCREMENT,
    skill_name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create training_modules table
CREATE TABLE IF NOT EXISTS training_modules (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create badges table
CREATE TABLE IF NOT EXISTS badges (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Now populate user_roles
INSERT INTO user_roles (role_name, description) VALUES
('system_administrator', 'Complete system access with full control over all features and settings'),
('client_administrator', 'Management access for client organization with control over shifts and staff'),
('staff_member', 'Access to view and apply for shifts, manage availability, and track earnings'),
('agency_administrator', 'Management access for agency operations, staff, and client relationships'),
('support_specialist', 'Access to handle customer support tickets and user assistance');

-- Populate user_role_permissions
INSERT INTO user_role_permissions (role_id, permission) VALUES
((SELECT id FROM user_roles WHERE role_name = 'system_administrator'), 'manage_users'),
((SELECT id FROM user_roles WHERE role_name = 'system_administrator'), 'manage_roles'),
((SELECT id FROM user_roles WHERE role_name = 'system_administrator'), 'manage_system'),
((SELECT id FROM user_roles WHERE role_name = 'system_administrator'), 'view_analytics'),
((SELECT id FROM user_roles WHERE role_name = 'client_administrator'), 'post_shifts'),
((SELECT id FROM user_roles WHERE role_name = 'client_administrator'), 'manage_staff'),
((SELECT id FROM user_roles WHERE role_name = 'client_administrator'), 'view_reports'),
((SELECT id FROM user_roles WHERE role_name = 'client_administrator'), 'manage_payments'),
((SELECT id FROM user_roles WHERE role_name = 'staff_member'), 'view_shifts'),
((SELECT id FROM user_roles WHERE role_name = 'staff_member'), 'apply_shifts'),
((SELECT id FROM user_roles WHERE role_name = 'staff_member'), 'track_earnings'),
((SELECT id FROM user_roles WHERE role_name = 'staff_member'), 'update_profile');

-- Populate skills
INSERT INTO skills (skill_name, description) VALUES
('bartending', 'Expertise in cocktail preparation, wine service, and bar operations management'),
('food_service', 'Professional food service experience including table service and guest relations'),
('kitchen_operations', 'Knowledge of kitchen procedures, food preparation, and safety standards'),
('housekeeping', 'Proficiency in cleaning, room preparation, and maintaining facility standards'),
('front_desk', 'Experience in guest check-in/out, reservation management, and guest services');

-- Populate training_modules
INSERT INTO training_modules (name, description, content) VALUES
('Safety_Fundamentals', 'Essential workplace safety protocols', 'Comprehensive safety guidelines including emergency procedures'),
('Customer_Service_Excellence', 'Advanced customer service skills', 'Detailed training on guest interaction and service recovery'),
('Food_Safety_Certification', 'Food handling certification', 'Complete food safety guidelines and certification requirements');

-- Populate badges
INSERT INTO badges (name, description, icon) VALUES
('Shift_Master', 'Completed 50 successful shifts', 'badge_shift_master.png'),
('Service_Star', 'Maintained 4.8+ rating for 3 months', 'badge_service_star.png'),
('Safety_Champion', 'Completed all safety training modules', 'badge_safety_champion.png');
