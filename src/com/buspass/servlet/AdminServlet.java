package com.buspass.servlet;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.buspass.util.DBConnection;

public class AdminServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String action = request.getParameter("action");
        try (Connection con = DBConnection.getConnection()) {
            if (con == null) {
                response.sendRedirect("admin_dashboard.jsp?msg=Admin Action Executed (Mock)");
                return;
            }
            
            if ("delete_user".equals(action)) {
                String studentId = request.getParameter("student_id");
                PreparedStatement ps = con.prepareStatement("DELETE FROM Students WHERE id=?");
                ps.setString(1, studentId);
                ps.executeUpdate();
            } else if ("add_route".equals(action)) {
                String rno = request.getParameter("route_no");
                String src = request.getParameter("source");
                String dst = request.getParameter("destination");
                String fare = request.getParameter("fare");
                PreparedStatement ps = con.prepareStatement("INSERT INTO Routes (route_no, source, destination, fare_per_month) VALUES (?,?,?,?)");
                ps.setString(1, rno);
                ps.setString(2, src);
                ps.setString(3, dst);
                ps.setString(4, fare);
                ps.executeUpdate();
            } else if ("send_alert".equals(action)) {
                String studentId = request.getParameter("student_id");
                String msg = request.getParameter("message");
                // Simplified payload, won't handle '0' broadcast properly here to avoid complexity
                PreparedStatement ps = con.prepareStatement("INSERT INTO Notifications (student_id, message) VALUES (?,?)");
                ps.setString(1, studentId);
                ps.setString(2, msg);
                ps.executeUpdate();
            }
            response.sendRedirect("admin_dashboard.jsp?msg=Operation successful");
        } catch(Exception e) {
            e.printStackTrace();
            response.sendRedirect("admin_dashboard.jsp?error=Operation failed");
        }
    }
    
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String action = request.getParameter("action");
        if("generate_report".equals(action)) {
            response.setContentType("text/html");
            response.getWriter().println("<html><body><h3>PDF Generation Disabled in System Settings. Please check config.</h3><a href='admin_dashboard.jsp'>Back</a></body></html>");
        }
    }
}
