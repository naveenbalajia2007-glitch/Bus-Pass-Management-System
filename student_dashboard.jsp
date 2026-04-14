<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
    if(session.getAttribute("student_id") == null) {
        response.sendRedirect("login.jsp");
        return;
    }
    String studentName = (String) session.getAttribute("student_name");
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Command Center - NexPass</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="navbar">
        <h2><a href="index.jsp">⚡ NexPass</a></h2>
        <div class="nav-links">
            <a href="index.jsp">Home</a>
            <a href="student_dashboard.jsp">Dashboard</a>
            <span style="color:var(--primary-color); font-weight: 600; margin-left: 10px; padding-left: 15px; border-left: 1px solid var(--card-border);">Welcome, <%= studentName %>!</span>
            <a href="login.jsp" class="btn btn-danger" style="margin-left: 15px; padding: 6px 18px;">Terminate Session</a>
        </div>
    </div>
    
    <div class="container">
        <% 
            if(request.getParameter("error") != null) out.println("<div class='alert alert-danger'>" + request.getParameter("error") + "</div>");
            if(request.getParameter("msg") != null) out.println("<div class='alert alert-success'>" + request.getParameter("msg") + "</div>");
        %>
        
        <div class="dashboard-header" style="margin-bottom: 40px;">
            <h2 style="font-size: 2.5rem; font-weight: 800; background: linear-gradient(to right, #00e5ff, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Operative Command Center</h2>
            <p style="color: var(--text-muted); font-size: 1.1rem; margin-top: 10px;">Monitor, deploy, and manage your transit credentials across the grid.</p>
        </div>
        
        <div class="grid-menu">
            <a href="apply_pass.jsp" class="menu-card">
                <img src="images/apply_pass.png" alt="Apply" class="card-image">
                <div class="card-content">
                    <h3><span>📝</span> Initialize Pass</h3>
                    <p>Subpoena a fresh academic transit credential for the impending cyclical period.</p>
                </div>
            </a>
            
            <a href="status.jsp" class="menu-card">
                <img src="images/check_status.png" alt="Status" class="card-image">
                <div class="card-content">
                    <h3><span>🔍</span> Surveillance Tracker</h3>
                    <p>Observe the algorithmic approval status of your submitted transit manifests.</p>
                </div>
            </a>
            
            <a href="renewal.jsp" class="menu-card">
                <img src="images/renewal.png" alt="Renewal" class="card-image">
                <div class="card-content">
                    <h3><span>⏳</span> Lifecycle Extension</h3>
                    <p>Chronologically expand the viability matrix of currently decaying credentials.</p>
                </div>
            </a>
        </div>
        
        <div class="notifications">
            <h4><span>🔔</span> Real-Time System Telemetry</h4>
            <%@ page import="java.sql.*, com.buspass.util.DBConnection" %>
            <%
                try(Connection con = DBConnection.getConnection()) {
                    String q = "SELECT message, created_at FROM Notifications WHERE student_id = ? ORDER BY created_at DESC LIMIT 5";
                    PreparedStatement ps = con.prepareStatement(q);
                    ps.setInt(1, (Integer)session.getAttribute("student_id"));
                    ResultSet rs = ps.executeQuery();
                    boolean hasAlerts = false;
                    while(rs.next()) {
                        hasAlerts = true;
                        out.println("<p style='margin:12px 0; border-bottom: 1px dashed rgba(253, 224, 71, 0.3); padding-bottom: 8px;'><strong style='color:#facc15;'>" + rs.getTimestamp("created_at") + "</strong> <span style='color:var(--text-muted); margin: 0 10px;'>|</span> " + rs.getString("message") + "</p>");
                    }
                    if(!hasAlerts) out.println("<p style='color:var(--text-muted);'>No anomaly detections or administrative directives logged.</p>");
                } catch(Exception e) { out.println("<p style='color:#ef4444;'>Telemetry link severed. Matrix offline.</p>"); }
            %>
        </div>
    </div>
</body>
</html>
