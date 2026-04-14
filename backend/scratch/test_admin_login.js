const axios = require('axios');

async function testAdminLogin() {
  const url = 'http://localhost:5000/api/auth/login/admin';
  const credentials = {
    email: 'admin@buspass.edu',
    password: 'Admin@123'
  };

  console.log('Testing admin login...');
  console.log('URL:', url);
  console.log('Email:', credentials.email);

  try {
    const response = await axios.post(url, credentials);
    console.log('Response Status:', response.status);
    console.log('Response Data:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    if (error.response) {
      console.error('Login Failed with Status:', error.response.status);
      console.error('Error Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Error Message:', error.message);
    }
  }
}

testAdminLogin();
