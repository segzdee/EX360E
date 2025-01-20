DELIMITER //

-- User Authentication Procedure
CREATE PROCEDURE authenticate_user(
    IN p_email VARCHAR(255),
    IN p_password VARCHAR(255)
)
BEGIN
    SELECT id, role_name, email 
    FROM users 
    WHERE email = p_email AND password = p_password;
END //

-- User Registration Procedure
CREATE PROCEDURE register_user(
    IN p_email VARCHAR(255),
    IN p_password VARCHAR(255),
    IN p_role VARCHAR(50)
)
BEGIN
    INSERT INTO users (email, password, role)
    VALUES (p_email, p_password, p_role);
END //

DELIMITER ;
