import React, { useState, useEffect } from 'react';

interface OptimizedBackgroundProps {
  imageUrl: string;
  fallbackUrls?: string[];
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

const OptimizedBackground: React.FC<OptimizedBackgroundProps> = ({
  imageUrl,
  fallbackUrls = [],
  className = '',
  style = {},
  children
}) => {
  const [currentImageUrl, setCurrentImageUrl] = useState<string>(imageUrl);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const loadImage = async (url: string): Promise<string> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(url);
        img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
        img.src = url;
      });
    };

    const tryLoadImages = async () => {
      const urlsToTry = [imageUrl, ...fallbackUrls];
      
      for (const url of urlsToTry) {
        try {
          await loadImage(url);
          setCurrentImageUrl(url);
          setIsLoading(false);
          setHasError(false);
          return;
        } catch (error) {
          console.warn(`Failed to load image: ${url}`);
        }
      }
      
      // If all images fail to load
      setHasError(true);
      setIsLoading(false);
    };

    tryLoadImages();
  }, [imageUrl, fallbackUrls]);

  const backgroundStyle: React.CSSProperties = {
    ...style,
    backgroundImage: hasError ? 'none' : `url(${currentImageUrl})`,
    backgroundColor: hasError ? '#1a1a1a' : 'transparent',
  };

  return (
    <div
      className={`${className} ${isLoading ? 'animate-pulse' : ''}`}
      style={backgroundStyle}
    >
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-900 animate-pulse" />
      )}
      {hasError && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800" />
      )}
    </div>
  );
};

export default OptimizedBackground;
