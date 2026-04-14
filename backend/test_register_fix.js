const axios = require('axios');

async function testDuplicatePhone() {
  const url = 'http://localhost:5000/api/auth/register';
  
  // First, get an existing user's phone
  // Based on my previous check, Nithya Pandiyan has phone: "9384413455"
  
  const testData = {
    full_name: 'Test Duplicate',
    email: 'newtestemail@example.com',
    password: 'password123',
    phone: '9384413455', // Duplicate phone
    student_type: 'college',
    institution_id: 1329
  };

  try {
    console.log('Testing registration with duplicate phone...');
    // We need to send it as FormData because the backend uses upload.fields
    const FormData = require('form-data');
    const fd = new FormData();
    Object.entries(testData).forEach(([k, v]) => fd.append(k, v));
    
    // We also need some dummy files since they are usually expected, 
    // but the code allows null if not present in req.files
    // Actually, Multer might not mind if they are missing in the fields list
    
    const response = await axios.post(url, fd, {
      headers: fd.getHeaders()
    });
    console.log('Response:', response.data);
  } catch (error) {
    if (error.response) {
      console.log('Error Status:', error.response.status);
      console.log('Error Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testDuplicatePhone();
