DELIMITER //

CREATE TRIGGER before_user_update
BEFORE UPDATE ON users
FOR EACH ROW
BEGIN
    INSERT INTO audit_logs (user_id, action, details)
    VALUES (NEW.id, 'UPDATE', CONCAT('User updated: ', OLD.email, ' -> ', NEW.email));
END //

DELIMITER ;
