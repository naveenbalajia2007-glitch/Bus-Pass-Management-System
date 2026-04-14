<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
    if(session.getAttribute("student_id") == null) {
        response.sendRedirect("login.jsp");
        return;
    }
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Apply for Bus Pass</title>
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
        <div class="card" style="max-width: 600px; margin: 20px auto;">
            <h3 class="header-title">Apply for New Bus Pass</h3>
            <p style="text-align:center; color:#555; margin-bottom: 25px;">Please provide accurate travel routing information to avoid rejection.</p>
            
            <form action="ApplyPassServlet" method="POST" enctype="multipart/form-data">
                
                <div style="display: flex; gap: 20px;">
                    <div class="form-group" style="flex:1;">
                        <label>Source / Stop Name</label>
                        <input type="text" name="source" class="form-control" placeholder="E.g. Central Station" required>
                    </div>
                    <div class="form-group" style="flex:1;">
                        <label>Destination (College)</label>
                        <input type="text" name="destination" class="form-control" required value="Main Campus">
                    </div>
                </div>

                <div style="display: flex; gap: 20px;">
                    <div class="form-group" style="flex:1;">
                        <label>Route Number</label>
                        <input type="text" name="route_no" class="form-control" placeholder="E.g. Route 42" required>
                    </div>
                    <div class="form-group" style="flex:1;">
                        <label>Duration of Pass</label>
                        <select name="duration_months" class="form-control" required>
                            <option value="1">1 Month (₹500)</option>
                            <option value="3">3 Months (₹1500)</option>
                            <option value="6">6 Months (₹3000)</option>
                            <option value="12">12 Months (₹6000)</option>
                        </select>
                    </div>
                </div>

                <h4 style="margin-top:20px; font-size: 1.1rem; color: var(--primary-color);">Upload Documents</h4>
                <hr style="margin: 10px 0 20px 0; border:0; border-top: 1px solid #ddd;">
                
                <div class="form-group">
                    <label>ID Proof (Aadhar/College ID Image)</label>
                    <input type="file" name="id_proof" class="form-control" accept="image/*" required style="padding: 9px;">
                </div>
                
                <div class="form-group">
                    <label>Student Photo</label>
                    <input type="file" name="photo" class="form-control" accept="image/*" required style="padding: 9px;">
                </div>
                
                <button type="submit" class="btn btn-primary" style="width: 100%; margin-top:20px; padding: 12px; font-size: 1.1rem;">Proceed to Payment gateway</button>
            </form>
        </div>
    </div>
</body>
</html>
