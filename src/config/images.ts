// Image configuration for the application
// This centralizes image URLs and provides fallbacks

// Hero Section Background Images
export const HERO_BACKGROUNDS = {
  // Primary high-quality 4K image from Unsplash
  primary: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
  
  // Alternative high-quality images as fallbacks
  fallback1: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
  fallback2: 'https://images.unsplash.com/photo-1548919973-5cef591cdbc9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
  
  // Local fallback (in case external images fail to load)
  local: '/src/images/HeroBG.jpg'
};

// Function to get the best available hero background
export const getHeroBackground = (): string => {
  // You can add logic here to test image availability
  // For now, return the primary high-quality image
  return HERO_BACKGROUNDS.primary;
};

// Preload images for better performance
export const preloadHeroImages = (): void => {
  Object.values(HERO_BACKGROUNDS).forEach(url => {
    if (url.startsWith('http')) {
      const img = new Image();
      img.src = url;
    }
  });
};
