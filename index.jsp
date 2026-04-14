<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NexPass | Futuristic Bus Pass System</title>
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
        <div class="hero">
            <h1>The Future of <br><span style="background: linear-gradient(to right, #00e5ff, #ff00ea); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Campus Transit</span></h1>
            <p>Experience seamless, completely digital bus pass issuance and renewal. Fast, secure, and effortlessly beautiful.</p>
            <div style="display: flex; gap: 20px; justify-content: center; align-items: center; flex-wrap: wrap;">
                <a href="login.jsp" class="btn btn-primary" style="padding: 15px 40px; font-size: 1.1rem; border-radius: 30px;">Access Portal</a>
                <a href="register.jsp" class="btn btn-outline" style="padding: 15px 40px; font-size: 1.1rem; border-radius: 30px;">Initialize Profile</a>
            </div>
        </div>
        
        <div class="features-grid">
            <div class="card">
                <h3>🚀 Neural Speed</h3>
                <p style="color:var(--text-muted); line-height:1.6; margin-top:10px;">Instantaneous processing. Get your digital pass verified within milliseconds instead of days.</p>
            </div>
            <div class="card">
                <h3>📱 Holographic Passes</h3>
                <p style="color:var(--text-muted); line-height:1.6; margin-top:10px;">Carry your secure, cryptographic mobile-friendly pass wherever you go entirely on your device.</p>
            </div>
            <div class="card">
                <h3>🛡️ Quantum Security</h3>
                <p style="color:var(--text-muted); line-height:1.6; margin-top:10px;">State-of-the-art administrative verification dashboards to keep out unauthorized riders safely.</p>
            </div>
        </div>
    </div>
</body>
</html>
