<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Profile Initialization - NexPass</title>
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
        <div class="auth-card" style="max-width: 700px;">
            <h2 class="header-title">Initialize Profile Core</h2>
            
            <% 
                if(request.getParameter("error") != null) { 
                    out.println("<div class='alert alert-danger'>" + request.getParameter("error") + "</div>");
                }
            %>

            <form action="RegisterServlet" method="POST">
                <div style="display: flex; gap: 20px;">
                    <div class="form-group" style="flex:1;">
                        <label>Enrollment Designation</label>
                        <input type="text" name="enrollment_no" class="form-control" placeholder="EX: 1011122" required>
                    </div>
                    <div class="form-group" style="flex:1;">
                        <label>Full Designation</label>
                        <input type="text" name="full_name" class="form-control" placeholder="Operative Name" required>
                    </div>
                </div>

                <div class="form-group">
                    <label>Communication Uplink (Email)</label>
                    <input type="email" name="email" class="form-control" placeholder="operative@nexus.edu" required>
                </div>

                <div style="display: flex; gap: 20px;">
                    <div class="form-group" style="flex:1;">
                        <label>Comms Frequency (Phone)</label>
                        <input type="text" name="phone" class="form-control" placeholder="Transmission Code" required>
                    </div>
                    <div class="form-group" style="flex:1;">
                        <label>Operational District</label>
                        <select id="district" class="form-control" required onchange="updateHubs()">
                            <option value="">-- Choose District --</option>
                            <!-- Districts will be populated by JS -->
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label>Academic Hub (Verified Institution)</label>
                    <select id="college_name" name="college_name" class="form-control" required disabled>
                        <option value="">-- Select District First --</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Encryption Key (Password)</label>
                    <input type="password" name="password" class="form-control" placeholder="Define secure cipher" required>
                </div>
                
                <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 20px; padding: 14px; font-size: 1.1rem; border-radius: 12px;">Establish Database Entry</button>
            </form>

            <script>
                // Data will be fetched from the database table 'institutions' via hidden element or JS variable
                const districts = [
                    'Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri', 'Dindigul', 'Erode', 
                    'Kallakurichi', 'Kanchipuram', 'Kanyakumari', 'Karur', 'Krishnagiri', 'Madurai', 'Mayiladuthurai', 
                    'Nagapattinam', 'Namakkal', 'Nilgiris', 'Perambalur', 'Pudukkottai', 'Ramanathapuram', 'Ranipet', 
                    'Salem', 'Sivagangai', 'Tenkasi', 'Thanjavur', 'Theni', 'Thoothukudi', 'Tiruchirappalli', 
                    'Tirunelveli', 'Tirupathur', 'Tiruppur', 'Tiruvallur', 'Tiruvannamalai', 'Tiruvarur', 
                    'Vellore', 'Viluppuram', 'Virudhunagar'
                ];

                const distSelect = document.getElementById('district');
                districts.forEach(d => {
                    const opt = document.createElement('option');
                    opt.value = d;
                    opt.textContent = d;
                    distSelect.appendChild(opt);
                });

                let institutionsData = [];

                async function loadInstitutions() {
                    try {
                        // We use a clean approach: fetch from the Institutions table
                        // For simplicity in this standalone JSP, we would ideally have an API
                        // But since we already have the Node backend running on 5000, we can fetch from there!
                        const res = await fetch('http://localhost:5000/api/institutions/all');
                        institutionsData = await res.json();
                    } catch(e) {
                        console.error("Failed to fetch institutions from Node API, using fallback data strategy.");
                    }
                }

                function updateHubs() {
                    const selectedDist = distSelect.value;
                    const hubSelect = document.getElementById('college_name');
                    hubSelect.innerHTML = '<option value="">-- Choose Hub --</option>';
                    
                    if (!selectedDist) {
                        hubSelect.disabled = true;
                        return;
                    }

                    const filtered = institutionsData.filter(i => i.district === selectedDist);
                    filtered.forEach(i => {
                        const opt = document.createElement('option');
                        opt.value = i.name;
                        opt.textContent = i.name;
                        hubSelect.appendChild(opt);
                    });
                    
                    hubSelect.disabled = false;
                }

                loadInstitutions();
            </script>
            
            <div style="text-align: center; margin-top: 25px;">
                <p style="color:var(--text-muted);">Existing core profile? <a href="login.jsp" style="color:var(--primary-color); font-weight: 500; text-decoration: none;">Authenticate</a></p>
            </div>
        </div>
    </div>
</body>
</html>
