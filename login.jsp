<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>System Login - NexPass</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="navbar">
        <h2><a href="index.jsp">⚡ NexPass</a></h2>
        <div class="nav-links">
            <a href="index.jsp">Home</a>
            <a href="login.jsp">Login</a>
            <a href="register.jsp">Register</a>
            <a href="student_dashboard.jsp">Dashboard</a>
        </div>
    </div>
    
    <div class="container">
        <div class="auth-card">
            <h2 class="header-title">System Authentication</h2>
            
            <% 
                if(request.getParameter("error") != null) { 
                    out.println("<div class='alert alert-danger'>" + request.getParameter("error") + "</div>");
                }
                if(request.getParameter("msg") != null) { 
                    out.println("<div class='alert alert-success'>" + request.getParameter("msg") + "</div>");
                }
            %>

            <form action="LoginServlet" method="POST">
                <div class="form-group">
                    <label>Access Level</label>
                    <select name="role" class="form-control" required>
                        <option value="Student">Student Operative</option>
                        <option value="Admin">System Administrator</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label>Identification Matrix (Email)</label>
                    <input type="email" name="email" class="form-control" placeholder="Enter operative email" required>
                </div>
                
                <div class="form-group">
                    <label>Decryption Key (Password)</label>
                    <input type="password" name="password" class="form-control" placeholder="Enter secure key" required>
                </div>
                
                <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 15px; padding: 14px; font-size: 1.1rem; border-radius: 12px; letter-spacing: 0.5px;">Authenticate Session</button>
            </form>
            
            <div style="text-align: center; margin-top: 25px;">
                <p style="color:var(--text-muted);">Unregistered identity? <a href="register.jsp" style="color:var(--primary-color); font-weight: 500; text-decoration: none;">Initialize here</a></p>
            </div>
        </div>
    </div>
</body>
</html>
