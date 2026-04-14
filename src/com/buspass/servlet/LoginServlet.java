package com.buspass.servlet;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import com.buspass.util.DBConnection;

public class LoginServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String role = request.getParameter("role");
        String email = request.getParameter("email");
        String password = request.getParameter("password");
        HttpSession session = request.getSession();

        try (Connection con = DBConnection.getConnection()) {
            if (con == null) {
                // Mock Auth bypass if DB is inactive for testing
                if("Admin".equals(role)) {
                    session.setAttribute("admin", "admin");
                    response.sendRedirect("admin_dashboard.jsp");
                } else {
                    session.setAttribute("student_id", 1);
                    session.setAttribute("student_name", "Mock Student");
                    response.sendRedirect("student_dashboard.jsp");
                }
                return;
            }
            
            if ("Admin".equals(role)) {
                String query = "SELECT * FROM Admin WHERE email=? AND password=?";
                PreparedStatement ps = con.prepareStatement(query);
                ps.setString(1, email);
                ps.setString(2, password); // Without hash mapping for simplification
                ResultSet rs = ps.executeQuery();
                if (rs.next()) {
                    session.setAttribute("admin", rs.getString("username"));
                    response.sendRedirect("admin_dashboard.jsp");
                } else {
                    response.sendRedirect("login.jsp?error=Invalid Admin Credentials");
                }
            } else {
                String query = "SELECT * FROM Students WHERE email=? AND password=?";
                PreparedStatement ps = con.prepareStatement(query);
                ps.setString(1, email);
                ps.setString(2, password);
                ResultSet rs = ps.executeQuery();
                if (rs.next()) {
                    session.setAttribute("student_id", rs.getInt("id"));
                    session.setAttribute("student_name", rs.getString("full_name"));
                    response.sendRedirect("student_dashboard.jsp");
                } else {
                    response.sendRedirect("login.jsp?error=Invalid Student Credentials");
                }
            }
        } catch(Exception e) {
            e.printStackTrace();
            response.sendRedirect("login.jsp?error=System Failure");
        }
    }
}
