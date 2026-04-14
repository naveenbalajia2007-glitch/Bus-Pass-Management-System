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
    <title>Renew Bus Pass</title>
    <link rel="stylesheet" href="css/style.css">
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
            <h3 class="header-title" style="text-align:left;">Renew Expired / Expiring Passes</h3>
            <p style="color: #555; margin-bottom: 20px;">You can seamlessly renew passes that are entirely expired or proactively expiring within the next 15 days without resubmitting document proofs.</p>
            
            <div class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Pass ID</th>
                            <th>Active Route</th>
                            <th>Valid Until Date</th>
                            <th>Renewal Setup Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <%
                            try(Connection con = DBConnection.getConnection()) {
                                if(con != null) {
                                    String query = "SELECT * FROM BusPass WHERE student_id = ? AND status='Approved' AND expiry_date <= DATE_ADD(CURRENT_DATE, INTERVAL 15 DAY) ORDER BY expiry_date ASC";
                                    PreparedStatement ps = con.prepareStatement(query);
                                    ps.setInt(1, studentId);
                                    ResultSet rs = ps.executeQuery();
                                    boolean found = false;
                                    while(rs.next()) {
                                        found = true;
                        %>
                        <tr>
                            <td style="font-weight: 500;">#<%= rs.getInt("pass_id") %></td>
                            <td><%= rs.getString("source") %> &rarr; <%= rs.getString("destination") %></td>
                            <td style="color:#d9534f; font-weight:600;"><%= rs.getDate("expiry_date") %> <br><small style="color:#777;">(Expiring Soon)</small></td>
                            <td>
                                <form action="RenewalServlet" method="POST" style="display:flex; gap: 10px; align-items: center;">
                                    <input type="hidden" name="pass_id" value="<%= rs.getInt("pass_id") %>">
                                    <select name="duration_months" required class="form-control" style="width: auto; padding: 8px;">
                                        <option value="1">1 Month Extension</option>
                                        <option value="3">3 Months Extension</option>
                                        <option value="6">6 Months Extension</option>
                                    </select>
                                    <button type="submit" class="btn btn-primary" style="padding: 8px 15px;">Quick Renew</button>
                                </form>
                            </td>
                        </tr>
                        <%
                                    }
                                    if(!found) {
                        %>
                        <tr><td colspan="4" style="text-align:center; padding: 40px; color:#777; font-size:1.1rem;">✅ Great! No passes are currently due for renewal right now.</td></tr>
                        <%
                                    }
                                } else {
                                    out.println("<tr><td colspan='4' style='text-align:center; color:red;'>Database offline.</td></tr>");
                                }
                            } catch(Exception e) { out.println("<tr><td colspan='4' style='color:red;'>DB Connection Error. Cannot load data.</td></tr>"); }
                        %>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</body>
</html>
