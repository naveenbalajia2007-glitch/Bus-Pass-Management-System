<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.sql.*, com.buspass.util.DBConnection" %>
<%
    if(session.getAttribute("student_id") == null) {
        response.sendRedirect("login.jsp");
        return;
    }
    int studentId = session.getAttribute("student_id") != null ? (Integer) session.getAttribute("student_id") : 0;
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Application Status</title>
    <link rel="stylesheet" href="css/style.css">
    <style>
        .status-badge { padding: 5px 12px; border-radius: 20px; font-weight: 600; font-size: 0.9rem; color: white; display: inline-block; letter-spacing: 0.5px; }
        .bg-pending { background-color: #ffc107; color: #856404; }
        .bg-approved { background-color: #28a745; }
        .bg-rejected { background-color: #dc3545; }
        .bg-expired { background-color: #6c757d; }
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
        <div class="card" style="margin-top: 30px;">
            <h3 class="header-title" style="text-align: left;">My Application Status List</h3>
            <p style="color: #666; margin-bottom: 20px;">Review your past and pending applications. Click download pass for approved applications.</p>
            
            <div class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Pass ID</th>
                            <th>Route</th>
                            <th>Applied Date</th>
                            <th>Status Phase</th>
                            <th>Action & Documents</th>
                        </tr>
                    </thead>
                    <tbody>
                        <%
                            try(Connection con = DBConnection.getConnection()) {
                                if(con != null) {
                                    String query = "SELECT * FROM BusPass WHERE student_id = ? ORDER BY pass_id DESC";
                                    PreparedStatement ps = con.prepareStatement(query);
                                    ps.setInt(1, studentId);
                                    ResultSet rs = ps.executeQuery();
                                    boolean hasRecords = false;
                                    while(rs.next()) {
                                        hasRecords = true;
                                        String status = rs.getString("status");
                                        String badgeClass = "bg-pending";
                                        if("Approved".equals(status)) badgeClass = "bg-approved";
                                        if("Rejected".equals(status)) badgeClass = "bg-rejected";
                                        if("Expired".equals(status)) badgeClass = "bg-expired";
                        %>
                        <tr>
                            <td style="font-weight: 500;">#<%= rs.getInt("pass_id") %></td>
                            <td><%= rs.getString("source") %> &rarr; <%= rs.getString("destination") %></td>
                            <td><%= rs.getDate("applied_date") %></td>
                            <td><span class="status-badge <%= badgeClass %>"><%= status %></span></td>
                            <td>
                                <% if("Approved".equals(status)) { %>
                                    <a href="download_pass.jsp?pass_id=<%= rs.getInt("pass_id") %>" class="btn btn-primary" style="padding: 6px 12px; font-size: 0.9rem;">View &amp; Download Pass</a>
                                <% } else { %>
                                    <span style="color:#999; font-size: 0.9rem; font-style: italic;">No active pass</span>
                                <% } %>
                            </td>
                        </tr>
                        <%
                                    }
                                    if(!hasRecords) out.println("<tr><td colspan='5' style='text-align:center; padding: 30px; color: #777;'>You have not submitted any applications yet.</td></tr>");
                                } else {
                                    out.println("<tr><td colspan='5' style='text-align:center; color: red;'>Database configuration active but data unavailable.</td></tr>");
                                }
                            } catch(Exception e) { out.println("<tr><td colspan='5' style='color:red;'>Could not load data. Ensure DB is connected.</td></tr>"); }
                        %>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</body>
</html>
