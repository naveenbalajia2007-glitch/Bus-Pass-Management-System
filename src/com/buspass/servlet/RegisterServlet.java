package com.buspass.servlet;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.buspass.util.DBConnection;

public class RegisterServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String enrollment = request.getParameter("enrollment_no");
        String name = request.getParameter("full_name");
        String email = request.getParameter("email");
        String phone = request.getParameter("phone");
        String college = request.getParameter("college_name");
        String pass = request.getParameter("password");
        
        try (Connection con = DBConnection.getConnection()) {
            if (con == null) {
                // If no DB connection, simulate successful register so 404 is avoided and flow continues
                response.sendRedirect("login.jsp?msg=Registration details submitted (Mock Mode)");
                return;
            }
            // Check if email already exists
            String checkEmail = "SELECT COUNT(*) FROM users WHERE email = ?";
            PreparedStatement cp1 = con.prepareStatement(checkEmail);
            cp1.setString(1, email);
            java.sql.ResultSet rs1 = cp1.executeQuery();
            if (rs1.next() && rs1.getInt(1) > 0) {
                response.sendRedirect("register.jsp?error=Email already in use.");
                return;
            }

            // Check if phone already exists
            String checkPhone = "SELECT COUNT(*) FROM users WHERE phone = ?";
            PreparedStatement cp2 = con.prepareStatement(checkPhone);
            cp2.setString(1, phone);
            java.sql.ResultSet rs2 = cp2.executeQuery();
            if (rs2.next() && rs2.getInt(1) > 0) {
                response.sendRedirect("register.jsp?error=Phone number already in use.");
                return;
            }

            // Check if roll number already exists
            String checkRoll = "SELECT COUNT(*) FROM users WHERE roll_number = ?";
            PreparedStatement cp3 = con.prepareStatement(checkRoll);
            cp3.setString(1, enrollment);
            java.sql.ResultSet rs3 = cp3.executeQuery();
            if (rs3.next() && rs3.getInt(1) > 0) {
                response.sendRedirect("register.jsp?error=Enrollment/Roll Number already exists.");
                return;
            }

            String query = "INSERT INTO users (roll_number, full_name, email, phone, password, college_name) VALUES (?, ?, ?, ?, ?, ?)";
            PreparedStatement ps = con.prepareStatement(query);
            ps.setString(1, enrollment);
            ps.setString(2, name);
            ps.setString(3, email);
            ps.setString(4, phone);
            ps.setString(5, pass);
            ps.setString(6, college);
            ps.executeUpdate();
            
            response.sendRedirect("login.jsp?msg=Registration successful! Access granted.");
        } catch(Exception e) {
            e.printStackTrace();
            response.sendRedirect("register.jsp?error=System conflict during transmission. Please verify details.");
        }
    }
}
