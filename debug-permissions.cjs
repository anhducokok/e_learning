const axios = require('axios');

async function debugDeletePermissions() {
  try {
    console.log('🔧 Debug Delete Permissions Test...\n');
    
    // Login as teacher
    const loginResponse = await axios.post('http://localhost:3212/auth/login', {
      email: 'teacher@example.com',
      password: 'password123'
    });
    
    const token = loginResponse.data.access_token;
    console.log('✅ Teacher login successful');
      // Use the newly created practice ID
    const practiceId = '8cfb9f6d-4b92-4da7-b618-d9794581aba0';
    const debugResponse = await axios.get(`http://localhost:3212/practices/${practiceId}/debug-permissions`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('🔍 Debug Information:');
    console.log(JSON.stringify(debugResponse.data, null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

debugDeletePermissions();
