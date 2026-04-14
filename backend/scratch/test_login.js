const axios = require('axios');

async function testLogin() {
  const url = 'http://localhost:5000/api/auth/login/student';
  const credentials = {
    email: 'nithyapandiyan50@gmail.com',
    password: 'Student@123'
  };

  console.log('Testing student login...');
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

testLogin();
