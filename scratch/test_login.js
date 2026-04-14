const http = require('http');

const data = JSON.stringify({
  email: 'arun@student.edu',
  password: 'Student@123'
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/login/student',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, res => {
  console.log(`statusCode: ${res.statusCode}`);
  res.on('data', d => {
    process.stdout.write(d);
  });
});

req.on('error', error => {
  console.error(error);
});

req.write(data);
req.end();
