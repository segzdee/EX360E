CREATE TABLE IF NOT EXISTS system_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    log_type ENUM('error', 'warning', 'info', 'debug') NOT NULL,
    component VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    stack_trace TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS performance_metrics (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    metric_name VARCHAR(255) NOT NULL,
    metric_value DECIMAL(10,2) NOT NULL,
    measured_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_metric_time (metric_name, measured_at)
);

DELIMITER //

CREATE PROCEDURE log_system_event(
    IN p_type VARCHAR(10),
    IN p_component VARCHAR(255),
    IN p_message TEXT,
    IN p_stack_trace TEXT
)
BEGIN
    INSERT INTO system_logs (log_type, component, message, stack_trace)
    VALUES (p_type, p_component, p_message, p_stack_trace);
END //

CREATE PROCEDURE record_performance_metric(
    IN p_metric_name VARCHAR(255),
    IN p_metric_value DECIMAL(10,2)
)
BEGIN
    INSERT INTO performance_metrics (metric_name, metric_value)
    VALUES (p_metric_name, p_metric_value);
END //

DELIMITER ;
