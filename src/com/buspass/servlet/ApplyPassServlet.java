package com.buspass.servlet;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.http.Part;
import com.buspass.util.DBConnection;

@MultipartConfig(fileSizeThreshold = 1024 * 1024 * 2, maxFileSize = 1024 * 1024 * 10, maxRequestSize = 1024 * 1024 * 50)
public class ApplyPassServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpSession session = request.getSession();
        if (session.getAttribute("student_id") == null) {
            response.sendRedirect("login.jsp");
            return;
        }
        int studentId = (Integer) session.getAttribute("student_id");
        String source = request.getParameter("source");
        String destination = request.getParameter("destination");
        String routeNo = request.getParameter("route_no");
        int duration = Integer.parseInt(request.getParameter("duration_months"));
        double amount = duration * 500.0; // Mock calculation

        try (Connection con = DBConnection.getConnection()) {
            if (con == null) {
                response.sendRedirect("payment.jsp?pass_id=99&amount=" + amount);
                return;
            }
            String query = "INSERT INTO BusPass (student_id, source, destination, route_no, duration_months, amount) VALUES (?, ?, ?, ?, ?, ?)";
            PreparedStatement ps = con.prepareStatement(query, PreparedStatement.RETURN_GENERATED_KEYS);
            ps.setInt(1, studentId);
            ps.setString(2, source);
            ps.setString(3, destination);
            ps.setString(4, routeNo);
            ps.setInt(5, duration);
            ps.setDouble(6, amount);
            ps.executeUpdate();

            java.sql.ResultSet rs = ps.getGeneratedKeys();
            int passId = 0;
            if (rs.next()) {
                passId = rs.getInt(1);
            }

            response.sendRedirect("payment.jsp?pass_id=" + passId + "&amount=" + amount);
        } catch (Exception e) {
            e.printStackTrace();
            response.sendRedirect("apply_pass.jsp?error=Error submitting pass");
        }
    }
}
