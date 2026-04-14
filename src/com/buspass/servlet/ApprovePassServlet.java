package com.buspass.servlet;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.buspass.util.DBConnection;

public class ApprovePassServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String passId = request.getParameter("pass_id");
        String action = request.getParameter("action");
        String status = "Approve".equals(action) ? "Approved" : "Rejected";
        
        try (Connection con = DBConnection.getConnection()) {
            if (con == null) {
                response.sendRedirect("admin_dashboard.jsp?msg=Pass " + action + " (Mock mode)");
                return;
            }
            String query = "UPDATE BusPass SET status = ? WHERE pass_id = ?";
            PreparedStatement ps = con.prepareStatement(query);
            ps.setString(1, status);
            ps.setString(2, passId);
            ps.executeUpdate();
            
            response.sendRedirect("admin_dashboard.jsp?msg=Pass status updated to " + status);
        } catch(Exception e) {
            e.printStackTrace();
            response.sendRedirect("admin_dashboard.jsp?error=Update failed");
        }
    }
}
