package com.buspass.servlet;

import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.buspass.util.DBConnection;

public class PaymentServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String passIdStr = request.getParameter("pass_id");
        String amountStr = request.getParameter("amount");
        
        try (Connection con = DBConnection.getConnection()) {
            if (con == null) {
                response.sendRedirect("student_dashboard.jsp?msg=Mock Payment Successful");
                return;
            }
            int passId = Integer.parseInt(passIdStr);
            double amount = Double.parseDouble(amountStr);
            int studentId = (Integer) request.getSession().getAttribute("student_id");
            
            String query = "INSERT INTO Payments (pass_id, student_id, amount, payment_status, transaction_id) VALUES (?, ?, ?, 'Success', ?)";
            PreparedStatement ps = con.prepareStatement(query);
            ps.setInt(1, passId);
            ps.setInt(2, studentId);
            ps.setDouble(3, amount);
            ps.setString(4, "TXN" + System.currentTimeMillis());
            ps.executeUpdate();
            
            response.sendRedirect("student_dashboard.jsp?msg=Payment Successful! Pass is under review.");
        } catch(Exception e) {
            e.printStackTrace();
            response.sendRedirect("payment.jsp?error=Payment Failed");
        }
    }
}
