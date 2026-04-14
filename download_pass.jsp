<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.sql.*, com.buspass.util.DBConnection" %>
<%
    if(session.getAttribute("student_id") == null) {
        response.sendRedirect("login.jsp");
        return;
    }
    String passId = request.getParameter("pass_id");
    boolean isValid = false;
    String rSource = "", rDest = "", amount = "", expire = "";
    try(Connection con = DBConnection.getConnection()) {
        String query = "SELECT * FROM BusPass WHERE pass_id = ? AND student_id = ? AND status='Approved'";
        PreparedStatement ps = con.prepareStatement(query);
        ps.setInt(1, Integer.parseInt(passId));
        ps.setInt(2, (Integer)session.getAttribute("student_id"));
        ResultSet rs = ps.executeQuery();
        if(rs.next()) {
            isValid = true;
            rSource = rs.getString("source");
            rDest = rs.getString("destination");
            amount = rs.getString("amount");
            expire = rs.getString("expiry_date");
        }
    } catch(Exception e) { e.printStackTrace(); }
    
    if(!isValid) {
        response.sendRedirect("status.jsp?error=Invalid Pass ID or Not Approved");
        return;
    }
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Download Pass</title>
    <link rel="stylesheet" href="css/style.css">
    <style>
        .pass-card {
            border: 2px solid #0056b3;
            border-radius: 12px;
            padding: 30px;
            max-width: 500px;
            margin: 30px auto;
            position: relative;
            background: linear-gradient(to right bottom, #ffffff, #f1f8ff);
        }
        .qr-placeholder {
            width: 150px;
            height: 150px;
            background: #eee;
            margin: 20px auto;
            border: 1px dashed #ccc;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    </style>
</head>
<body>
    <div class="navbar">
        <h2>🚌 Bus Pass Portal</h2>
        <div>
            <a href="status.jsp" class="btn btn-light" style="padding: 5px 15px; text-decoration: none;">Back</a>
        </div>
    </div>
    
    <div class="container text-center">
        <h3>Your Digital Pass Preview</h3>
        <div class="pass-card">
            <h2>🚌 STUDENT BUS PASS</h2>
            <hr>
            <p><strong>Pass ID:</strong> #<%= passId %></p>
            <p><strong>From:</strong> <%= rSource %> &nbsp; <strong>To:</strong> <%= rDest %></p>
            <p><strong>Valid Until:</strong> <%= expire %></p>
            <!-- QR Generation Temporarily Disabled 
            <div class="qr-placeholder">
                <img src="DownloadPassServlet?pass_id=<%= passId %>&type=qr" alt="QR Code" style="width:100%; height:100%;">
            </div>
            -->
            <div class="qr-placeholder" style="border: none; background: transparent;">
                <p style="color: red; font-size: 0.9rem;">QR Code generation temporarily disabled</p>
            </div>
            <p>Scan to verify authenticity</p>
        </div>
        
        <!-- PDF Download Temporarily Disabled
        <form action="DownloadPassServlet" method="GET">
            <input type="hidden" name="pass_id" value="<%= passId %>">
            <input type="hidden" name="type" value="pdf">
            <button type="submit" class="btn btn-primary" style="padding: 15px 30px; font-size: 1.1rem;">Download Official PDF</button>
        </form>
        -->
        <form onSubmit="event.preventDefault(); alert('PDF download is temporarily disabled.');">
            <button type="submit" class="btn btn-primary" style="padding: 15px 30px; font-size: 1.1rem; background-color: #ccc; cursor: not-allowed;" disabled>Download Official PDF (Disabled)</button>
        </form>
    </div>
</body>
</html>
