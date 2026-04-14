package com.buspass.util;

import java.sql.Connection;
import java.sql.DriverManager;

public class DBConnection {
    public static Connection getConnection() {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            return DriverManager.getConnection("jdbc:mysql://localhost:3306/buspasssystem?useSSL=false&serverTimezone=UTC", "root", "Nithu@7726");
        } catch(Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
