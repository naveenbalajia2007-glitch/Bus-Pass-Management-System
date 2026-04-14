<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
    if(session.getAttribute("student_id") == null) {
        response.sendRedirect("login.jsp");
        return;
    }
    String passId = request.getParameter("pass_id");
    String amount = request.getParameter("amount");
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Gateway</title>
    <link rel="stylesheet" href="css/style.css">
    <style>
        .payment-box {
            max-width: 450px;
            margin: 50px auto;
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.1);
            text-align: center;
            border-top: 5px solid var(--primary-color);
        }
        .amt { font-size: 3rem; color: #28a745; margin: 20px 0; font-weight: 700; letter-spacing: -1px; }
        .receipt-icon { font-size: 3rem; color: #aaa; margin-bottom: 20px; }
    </style>
</head>
<body>
    <div class="navbar">
        <h2><a href="index.jsp">🚌 Bus Pass Portal</a></h2>
        <div class="nav-links">
            <a href="index.jsp">Home</a>
            <a href="student_dashboard.jsp">Dashboard</a>
            <a href="login.jsp" class="btn btn-danger" style="margin-left: 10px; padding: 5px 15px;">Logout</a>
        </div>
    </div>
    
    <div class="container">
        <div class="payment-box">
            <div class="receipt-icon">💳</div>
            <h3 style="color:var(--text-color); font-size: 1.5rem; margin-bottom: 10px;">Secure Checkout</h3>
            <p style="font-size: 1.1rem;">Application Ref ID: <strong>#<%= passId %></strong></p>
            
            <div class="amt">₹<%= amount %></div>
            <p style="color:#666; margin-bottom: 30px; font-size: 0.95rem;">Please review your total amount. This is a secure mock payment sandbox to simulate the university gateway.</p>
            
            <form action="PaymentServlet" method="POST">
                <input type="hidden" name="pass_id" value="<%= passId %>">
                <input type="hidden" name="amount" value="<%= amount %>">
                <button type="submit" class="btn btn-success" style="width:100%; font-size:1.15rem; padding: 15px; border-radius: 8px;">💳 Simulate Pay Now &rarr;</button>
            </form>
            <div style="margin-top: 20px;">
                <a href="student_dashboard.jsp" style="color: #888; text-decoration: none; font-size: 0.9rem;">Cancel Payment</a>
            </div>
        </div>
    </div>
</body>
</html>
