package com.buspass.servlet;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.buspass.util.DBConnection;

public class RenewalServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String passId = request.getParameter("pass_id");
        String duration = request.getParameter("duration_months");
        
        try (Connection con = DBConnection.getConnection()) {
            if (con == null) {
                response.sendRedirect("renewal.jsp?msg=Pass Renewed (Mock)");
                return;
            }
            String query = "UPDATE BusPass SET duration_months = duration_months + ?, amount = amount + ? WHERE pass_id = ?";
            PreparedStatement ps = con.prepareStatement(query);
            ps.setInt(1, Integer.parseInt(duration));
            ps.setDouble(2, Integer.parseInt(duration) * 500.0);
            ps.setString(3, passId);
            ps.executeUpdate();
            
            response.sendRedirect("status.jsp?msg=Pass Extended Successfully");
        } catch(Exception e) {
            e.printStackTrace();
            response.sendRedirect("renewal.jsp?error=Failed to renew pass");
        }
    }
}
