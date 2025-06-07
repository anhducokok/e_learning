// Authentication debug script
console.log('🔍 Authentication Debug Script');

// Function to check if we have a stored authentication token
function checkStoredAuth() {
  console.log('Checking localStorage for authentication data...');
  
  const token = localStorage.getItem('auth_token');
  console.log('auth_token in localStorage:', token ? `${token.substring(0, 20)}...` : 'Not found');
  
  // Check all localStorage keys
  console.log('\nAll localStorage items:');
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    let value = localStorage.getItem(key);
    
    // Don't show full tokens in console
    if (key.toLowerCase().includes('token') && value && value.length > 40) {
      value = value.substring(0, 20) + '...';
    }
    
    console.log(`${key}: ${value}`);
  }
}

// Test login function
async function testLogin(email, password) {
  console.log(`\nAttempting login with ${email}...`);
  
  try {
    const API_BASE = 'http://localhost:3212';
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    console.log('Login response:', data);
    
    if (data.success && data.data?.access_token) {
      console.log('Login successful! Saving token to localStorage...');
      localStorage.setItem('auth_token', data.data.access_token);
      
      if (data.data.user) {
        localStorage.setItem('user_data', JSON.stringify(data.data.user));
      }
      
      checkStoredAuth();
      return true;
    } else {
      console.error('Login failed:', data.message);
      return false;
    }
  } catch (error) {
    console.error('Login attempt failed with error:', error);
    return false;
  }
}

// Simulate a fetch to lessons endpoint
async function testFetchLessons(courseId) {
  console.log(`\nTesting fetch lessons for course ${courseId}...`);
  
  try {
    const API_BASE = 'http://localhost:3212';
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      console.error('No auth token found! Cannot fetch lessons.');
      return;
    }
    
    const response = await fetch(`${API_BASE}/lessons/course/${courseId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const result = await response.json();
    console.log('Lessons response status:', response.status);
    console.log('Lessons response:', result);
    
    if (result.success && Array.isArray(result.data)) {
      console.log(`Found ${result.data.length} lessons`);
      
      // Check if lessons have video URLs
      const withVideo = result.data.filter(l => l.videoUrl).length;
      console.log(`Lessons with video: ${withVideo}`);
      
      // Show first lesson details
      if (result.data.length > 0) {
        const first = result.data[0];
        console.log('First lesson:', {
          id: first.id,
          title: first.title,
          videoUrl: first.videoUrl,
          orderIndex: first.orderIndex
        });
      }
    } else {
      console.error('Failed to get lessons or empty array');
    }
  } catch (error) {
    console.error('Error fetching lessons:', error);
  }
}

// Function to log out
function logout() {
  console.log('\nLogging out (removing authentication data)...');
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_data');
  checkStoredAuth();
}

// Export functions to window for console access
window.checkStoredAuth = checkStoredAuth;
window.testLogin = testLogin;
window.testFetchLessons = testFetchLessons;
window.logout = logout;

// Initial check on script load
checkStoredAuth();

console.log('\n🧪 Auth debug utilities loaded! You can run:');
console.log('- checkStoredAuth() - Check current auth state');
console.log('- testLogin("teacher@example.com", "11042004") - Test login');
console.log('- testFetchLessons("d6c8556b-0c3d-44a3-b8e7-b8a24234a866") - Test fetching lessons');
console.log('- logout() - Clear auth data');
