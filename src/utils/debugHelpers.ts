// Script để enable debug mode trên production
// Chạy trong console browser: enableDebugMode()

declare global {
  interface Window {
    enableDebugMode: () => void;
    disableDebugMode: () => void;
    checkApiStatus: () => Promise<void>;
  }
}

window.enableDebugMode = () => {
  localStorage.setItem('debug_mode', 'true');
  console.log('🔧 Debug mode enabled. Reloading page...');
  window.location.reload();
};

window.disableDebugMode = () => {
  localStorage.removeItem('debug_mode');
  console.log('❌ Debug mode disabled. Reloading page...');
  window.location.reload();
};

window.checkApiStatus = async () => {
  const apiUrl = (window as any).__API_BASE_URL__ || 'API_URL_NOT_FOUND';
  console.log('🔍 Checking API status...');
  console.log('📡 API URL:', apiUrl);
  
  try {
    const response = await fetch(`${apiUrl}/health`);
    const data = await response.json();
    console.log('✅ API Status:', response.status, data);
  } catch (error) {
    console.error('❌ API Error:', error);
  }
};

// Log available debug functions
console.log(`
🔧 Debug Functions Available:
- enableDebugMode()  // Show debug info
- disableDebugMode() // Hide debug info  
- checkApiStatus()   // Test API connection

Current environment: ${import.meta.env.MODE}
Current API URL: ${import.meta.env.VITE_API_BASE_URL || 'NOT_SET'}
Production API URL: ${import.meta.env.VITE_API_BASE_URL_PRODUCTION || 'NOT_SET'}
`);

export {};
