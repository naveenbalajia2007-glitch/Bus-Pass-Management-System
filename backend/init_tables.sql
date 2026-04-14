CREATE TABLE IF NOT EXISTS bus_passes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pass_number VARCHAR(50) UNIQUE,
    user_id INT,
    route_id INT,
    allocated_bus_id INT,
    suggested_bus_id INT,
    pass_type ENUM('monthly', 'quarterly', 'annual'),
    status ENUM('pending', 'approved', 'rejected', 'expired') DEFAULT 'pending',
    boarding_point VARCHAR(255),
    start_date DATE,
    end_date DATE,
    qr_code TEXT,
    qr_token VARCHAR(255),
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_by INT,
    approved_at DATETIME,
    rejection_note TEXT,
    is_renewed TINYINT(1) DEFAULT 0
);

CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    title VARCHAR(255),
    message TEXT,
    type ENUM('info', 'success', 'warning', 'danger') DEFAULT 'info',
    is_read TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    pass_id INT,
    amount DECIMAL(10,2),
    payment_method VARCHAR(50),
    payment_status VARCHAR(50) DEFAULT 'success',
    receipt_number VARCHAR(100) UNIQUE,
    transaction_id VARCHAR(255),
    paid_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
