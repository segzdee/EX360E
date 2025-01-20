USE extrastaff360;

-- Create and populate establishment types
CREATE TABLE IF NOT EXISTS establishment_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    category ENUM('hotel', 'resort', 'alternative', 'specialty') NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO establishment_types (name, category) VALUES
('Full-Service Hotel', 'hotel'),
('Limited-Service Hotel', 'hotel'),
('Boutique Hotel', 'hotel'),
('Luxury Hotel', 'hotel'),
('Extended Stay Hotel', 'hotel'),
('Resort Hotel', 'hotel'),
('Beach Resort', 'resort'),
('Ski Resort', 'resort'),
('Golf Resort', 'resort'),
('Spa Resort', 'resort'),
('Casino Resort', 'resort'),
('Boutique Resort', 'resort'),
('Bed and Breakfast', 'alternative'),
('Hostel', 'alternative'),
('Vacation Rental', 'alternative'),
('Serviced Apartment', 'alternative'),
('Medical Tourism Hotel', 'specialty'),
('Business Hotel', 'specialty'),
('Airport Hotel', 'specialty'),
('Convention Hotel', 'specialty');

-- Create and populate job categories
CREATE TABLE IF NOT EXISTS job_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO job_categories (name, description) VALUES
('Hotel Operations', 'Core hotel management and operational roles'),
('Food and Beverage', 'Restaurant, bar, and catering positions'),
('Event Management', 'Event planning and coordination roles'),
('Travel and Tourism', 'Tourism and travel-related positions'),
('Support Functions', 'Administrative and operational support roles');

-- Create and populate job titles
CREATE TABLE IF NOT EXISTS job_titles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES job_categories(id)
) ENGINE=InnoDB;

-- Hotel Operations roles
INSERT INTO job_titles (category_id, title) SELECT id, 'Hotel General Manager' FROM job_categories WHERE name = 'Hotel Operations';
INSERT INTO job_titles (category_id, title) SELECT id, 'Front Office Manager' FROM job_categories WHERE name = 'Hotel Operations';
INSERT INTO job_titles (category_id, title) SELECT id, 'Housekeeping Manager' FROM job_categories WHERE name = 'Hotel Operations';
INSERT INTO job_titles (category_id, title) SELECT id, 'Concierge' FROM job_categories WHERE name = 'Hotel Operations';
INSERT INTO job_titles (category_id, title) SELECT id, 'Receptionist' FROM job_categories WHERE name = 'Hotel Operations';

-- Food and Beverage roles
INSERT INTO job_titles (category_id, title) SELECT id, 'Food and Beverage Director' FROM job_categories WHERE name = 'Food and Beverage';
INSERT INTO job_titles (category_id, title) SELECT id, 'Executive Chef' FROM job_categories WHERE name = 'Food and Beverage';
INSERT INTO job_titles (category_id, title) SELECT id, 'Sous Chef' FROM job_categories WHERE name = 'Food and Beverage';
INSERT INTO job_titles (category_id, title) SELECT id, 'Bartender' FROM job_categories WHERE name = 'Food and Beverage';
INSERT INTO job_titles (category_id, title) SELECT id, 'Server' FROM job_categories WHERE name = 'Food and Beverage';

-- Create and populate agency types
CREATE TABLE IF NOT EXISTS agency_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO agency_types (name, description) VALUES
('Staffing Agency', 'Provides temporary and permanent staffing solutions'),
('Recruitment Agency', 'Specializes in permanent placement'),
('Executive Search Firm', 'Focus on senior management positions'),
('Event Staffing Agency', 'Specializes in event personnel'),
('Hospitality Consulting Agency', 'Provides industry consulting services');

-- Create and populate staff categories
CREATE TABLE IF NOT EXISTS staff_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO staff_categories (name, description) VALUES
('Full-Time', 'Regular employees working standard hours'),
('Part-Time', 'Regular employees working reduced hours'),
('Casual', 'Flexible schedule workers'),
('Seasonal', 'Fixed-term workers for peak periods'),
('Contract', 'Fixed-term project-based workers'),
('Temporary', 'Short-term replacement workers'),
('On-Call', 'As-needed basis workers');

-- Add performance optimization indexes
ALTER TABLE establishment_types ADD INDEX idx_category (category);
ALTER TABLE job_titles ADD INDEX idx_category_id (category_id);
ALTER TABLE staff_categories ADD INDEX idx_name (name);

