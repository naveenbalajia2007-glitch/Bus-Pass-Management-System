CREATE TABLE IF NOT EXISTS buses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bus_number VARCHAR(50) UNIQUE,
    capacity INT DEFAULT 40,
    route_id INT,
    is_active TINYINT(1) DEFAULT 1,
    last_latitude DECIMAL(10,8),
    last_longitude DECIMAL(11,8),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT IGNORE INTO buses (bus_number, capacity, route_id) VALUES 
('TN-01-BP-1001', 40, 1),
('TN-01-BP-1002', 45, 1),
('TN-01-BP-1003', 40, 2),
('TN-37-BP-2001', 40, 3);
