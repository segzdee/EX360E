-- Performance optimization indexes
CREATE INDEX idx_shift_status_date ON shifts(status, start_time);
CREATE INDEX idx_user_role_email ON users(role, email);
CREATE INDEX idx_transaction_status ON transaction_history(status, created_at);
CREATE INDEX idx_assignment_status ON shift_assignments(status, created_at);
