<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.sql.*, com.buspass.util.DBConnection" %>
<%
    if(session.getAttribute("admin") == null) {
        response.sendRedirect("login.jsp");
        return;
    }
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard Framework</title>
    <link rel="stylesheet" href="css/style.css">
    <style>
        .admin-nav { display:flex; gap: 15px; margin-bottom: 30px; flex-wrap: wrap; }
        .admin-nav a { padding: 12px 25px; background: #e9ecef; color: #495057; text-decoration: none; border-radius: 8px; font-weight: 600; transition: all 0.3s; }
        .admin-nav a:hover, .admin-nav a.active-tab { background: var(--primary-color); color: white; transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
        .section-box { display: none; animation: fadeIn 0.4s ease-in-out; }
        .section-box.active { display: block; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    </style>
    <script>
        function showSection(id, element) {
            document.querySelectorAll('.section-box').forEach(el => el.classList.remove('active'));
            document.querySelectorAll('.admin-nav a').forEach(el => el.classList.remove('active-tab'));
            document.getElementById(id).classList.add('active');
            if(element) element.classList.add('active-tab');
        }
    </script>
</head>
<body>
    <div class="navbar" style="background-color: #1a1a1a;">
        <h2><a href="index.jsp">🛡️ Admin Console</a></h2>
        <div class="nav-links">
            <span style="color:white; margin-right: 15px; font-weight: 500;">Master Control</span>
            <a href="login.jsp" class="btn btn-danger" style="text-decoration:none; padding: 5px 15px;">Logout Securely</a>
        </div>
    </div>
    
    <div class="container">
        <% 
            if(request.getParameter("error") != null) out.println("<div class='alert alert-danger'>" + request.getParameter("error") + "</div>");
            if(request.getParameter("msg") != null) out.println("<div class='alert alert-success'>" + request.getParameter("msg") + "</div>");
        %>
        
        <h2 style="margin-top: 20px; color: var(--text-color); margin-bottom: 25px;">System Administrator Panel</h2>
        
        <div class="admin-nav">
            <a href="javascript:void(0);" onclick="showSection('applications', this)" class="active-tab">📋 Applications Approval</a>
            <a href="javascript:void(0);" onclick="showSection('users', this)">👥 Manage Students</a>
            <a href="javascript:void(0);" onclick="showSection('fares', this)">💰 Manage Fares</a>
            <a href="javascript:void(0);" onclick="showSection('notifications', this)">🔔 Broadcast Alerts</a>
            <a href="javascript:void(0);" onclick="showSection('reports', this)">📊 System Reports</a>
        </div>
        
        <!-- Applications Section -->
        <div id="applications" class="card section-box active">
            <h3 class="header-title" style="text-align: left;">Pending Applications &amp; Manual Verification</h3>
            <div class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Pass ID</th>
                            <th>Student Profile</th>
                            <th>Route Detail</th>
                            <th>Duration / Cost</th>
                            <th>Compliance Docs</th>
                            <th>Auth Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <%
                            try(Connection con = DBConnection.getConnection()) {
                                if(con != null) {
                                    String query = "SELECT bp.*, s.full_name, s.enrollment_no, d.id_proof_path, d.photo_path " +
                                                   "FROM BusPass bp JOIN Students s ON bp.student_id = s.id " +
                                                   "LEFT JOIN Documents d ON s.id = d.student_id WHERE bp.status='Pending'";
                                    PreparedStatement ps = con.prepareStatement(query);
                                    ResultSet rs = ps.executeQuery();
                                    boolean found = false;
                                    while(rs.next()) {
                                        found = true;
                        %>
                        <tr>
                            <td style="font-weight:bold;">#<%= rs.getInt("pass_id") %></td>
                            <td><strong><%= rs.getString("full_name") %></strong> <br><small style="color:#777;"><%= rs.getString("enrollment_no") %></small></td>
                            <td><%= rs.getString("source") %> &rarr; <%= rs.getString("destination") %></td>
                            <td><%= rs.getInt("duration_months") %>M @ <span style="color:#28a745; font-weight:bold;">₹<%= rs.getDouble("amount") %></span></td>
                            <td>
                                <% if(rs.getString("id_proof_path") != null) { %>
                                    <a href="UploadServlet?file=<%= rs.getString("id_proof_path") %>" target="_blank" style="color:var(--primary-color);">ID</a> |
                                    <a href="UploadServlet?file=<%= rs.getString("photo_path") %>" target="_blank" style="color:var(--primary-color);">Img</a>
                                <% } else { out.print("<span style='color:#999'>N/A</span>"); } %>
                            </td>
                            <td>
                                <form action="ApprovePassServlet" method="post" style="display:inline; margin-right: 5px;">
                                    <input type="hidden" name="pass_id" value="<%= rs.getInt("pass_id") %>">
                                    <input type="hidden" name="action" value="Approve">
                                    <button type="submit" class="btn btn-success" style="padding: 6px 12px; font-size: 0.9rem;">Approve</button>
                                </form>
                                <form action="ApprovePassServlet" method="post" style="display:inline;">
                                    <input type="hidden" name="pass_id" value="<%= rs.getInt("pass_id") %>">
                                    <input type="hidden" name="action" value="Reject">
                                    <button type="submit" class="btn btn-danger" style="padding: 6px 12px; font-size: 0.9rem;">Reject</button>
                                </form>
                            </td>
                        </tr>
                        <%
                                    }
                                    if(!found) out.println("<tr><td colspan='6' style='text-align:center; padding: 40px; color:#aaa; font-style: italic;'>Queue is empty. No pending applications inside the system.</td></tr>");
                                } else {
                                    out.println("<tr><td colspan='6' style='text-align:center; color:red;'>Database offline!</td></tr>");
                                }
                            } catch(Exception e) { out.println("<tr><td colspan='6' style='color:red;'>Could not load database records.</td></tr>"); }
                        %>
                    </tbody>
                </table>
            </div>
        </div>
        
        <!-- Users Management -->
        <div id="users" class="card section-box">
            <h3 class="header-title" style="text-align: left;">Manage Core System Users</h3>
            <div class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Enrollment No.</th>
                            <th>Full Name</th>
                            <th>Danger Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <%
                            try(Connection con = DBConnection.getConnection()) {
                                if(con != null) {
                                    String query = "SELECT * FROM Students ORDER BY id DESC LIMIT 50";
                                    PreparedStatement ps = con.prepareStatement(query);
                                    ResultSet rs = ps.executeQuery();
                                    while(rs.next()) {
                        %>
                        <tr>
                            <td><%= rs.getInt("id") %></td>
                            <td><%= rs.getString("enrollment_no") %></td>
                            <td><strong><%= rs.getString("full_name") %></strong></td>
                            <td>
                                <form action="AdminServlet" method="post" onsubmit="return confirm('WARNING: Are you absolutely sure? This will delete the user and cascade erase all their associated passes and payments.');">
                                    <input type="hidden" name="action" value="delete_user">
                                    <input type="hidden" name="student_id" value="<%= rs.getInt("id") %>">
                                    <button type="submit" class="btn btn-danger" style="padding: 5px 10px; font-size: 0.85rem;">Permanently Delete</button>
                                </form>
                            </td>
                        </tr>
                        <%      }
                                }
                            } catch(Exception e) { out.println("<tr><td colspan='4'>DB Error</td></tr>"); }
                        %>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Fare Management -->
        <div id="fares" class="card section-box">
            <h3 class="header-title" style="text-align: left;">Configure Global Route Fares</h3>
            <p style="color:#666; margin-bottom: 20px;">Use this sandbox tool to inject new route grids into the active deployment.</p>
            <form action="AdminServlet" method="POST" style="max-width: 500px;">
                <input type="hidden" name="action" value="add_route">
                
                <div class="form-group">
                    <label>Route Number / System Code</label>
                    <input type="text" name="route_no" class="form-control" placeholder="E.g. RT-101" required>
                </div>
                
                <div style="display: flex; gap: 20px;">
                    <div class="form-group" style="flex:1;">
                        <label>Source Board</label>
                        <input type="text" name="source" class="form-control" required>
                    </div>
                    <div class="form-group" style="flex:1;">
                        <label>Destination Drop</label>
                        <input type="text" name="destination" class="form-control" required>
                    </div>
                </div>
                
                <div class="form-group">
                    <label>Base Tariff Fare per Month (₹)</label>
                    <input type="number" name="fare" class="form-control" placeholder="Integer value only" required>
                </div>
                <button type="submit" class="btn btn-primary" style="padding: 12px; font-size: 1.05rem;">Inject Route Pricing Node</button>
            </form>
        </div>

        <!-- Send Notifications -->
        <div id="notifications" class="card section-box">
            <h3 class="header-title" style="text-align: left;">Broadcast Push Notification</h3>
            <p style="color:#666; margin-bottom: 20px;">Push a critical alert directly to student dashboards.</p>
            <form action="AdminServlet" method="POST" style="max-width: 500px;">
                <input type="hidden" name="action" value="send_alert">
                
                <div class="form-group">
                    <label>Target Student ID Hash</label>
                    <input type="number" name="student_id" class="form-control" value="0" required>
                    <small style="color:#888;">Use '0' to blindly target the entire cluster grid globally.</small>
                </div>
                
                <div class="form-group">
                    <label>Payload Message</label>
                    <textarea name="message" class="form-control" rows="4" placeholder="Enter critical payload message format..." required></textarea>
                </div>
                
                <button type="submit" class="btn btn-success" style="padding: 12px; font-size: 1.05rem;">Push Broadcast Alert ⚡</button>
            </form>
        </div>

        <!-- Reports -->
        <div id="reports" class="card section-box">
            <h3 class="header-title" style="text-align: left;">Financial Output Data Reports</h3>
            <p style="color:#555; margin-bottom: 20px;">Automatically pull down summary metrics and generate compliant legacy PDF exports securely from the primary database cluster node.</p>
            <form action="AdminServlet" method="GET">
                <input type="hidden" name="action" value="generate_report">
                <button type="submit" class="btn btn-primary" style="padding: 12px 20px;">Download Financial Auditing Report (PDF)</button>
            </form>
        </div>
    </div>
</body>
</html>
