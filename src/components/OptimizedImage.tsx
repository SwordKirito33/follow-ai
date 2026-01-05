/**
 * Optimized Image Component
 * Provides WebP support, lazy loading, and responsive images
 */

import React, { useState, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  srcSet?: string;
  fallback?: string;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Check if browser supports WebP
 */
let webpSupport: boolean | null = null;

function supportsWebP(): boolean {
  if (webpSupport !== null) return webpSupport;

  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    webpSupport = canvas.toDataURL('image/webp').indexOf('image/webp') === 5;
  } catch (error) {
    webpSupport = false;
  }

  return webpSupport;
}

/**
 * Convert image URL to WebP if supported
 */
function getOptimizedSrc(src: string): string {
  if (!supportsWebP()) return src;

  // If already WebP, return as is
  if (src.endsWith('.webp')) return src;

  // Convert common formats to WebP
  if (src.match(/\.(jpg|jpeg|png)$/i)) {
    return src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  }

  return src;
}

/**
 * Optimized Image Component
 * Features:
 * - WebP support with fallback
 * - Lazy loading
 * - Responsive images
 * - Error handling
 * - Loading state
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  sizes,
  srcSet,
  fallback,
  onLoad,
  onError,
}) => {
  const [isLoading, setIsLoading] = useState(!priority);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);

  // Optimize image source
  useEffect(() => {
    setImageSrc(getOptimizedSrc(src));
  }, [src]);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    onError?.();

    // Try fallback if available
    if (fallback && imageSrc !== fallback) {
      setImageSrc(fallback);
      setHasError(false);
    }
  };

  // Use fallback image if error occurred
  const displaySrc = hasError && fallback ? fallback : imageSrc;

  return (
    <picture>
      {/* WebP source */}
      {!hasError && supportsWebP() && (
        <source
          srcSet={srcSet || getOptimizedSrc(src)}
          type="image/webp"
          sizes={sizes}
        />
      )}

      {/* Fallback image */}
      <img
        src={displaySrc}
        alt={alt}
        width={width}
        height={height}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        sizes={sizes}
        srcSet={srcSet}
      />

      {/* Loading skeleton */}
      {isLoading && (
        <div
          className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"
          style={{
            width: width ? `${width}px` : '100%',
            height: height ? `${height}px` : '100%',
          }}
        />
      )}
    </picture>
  );
};

/**
 * Responsive Image Component
 * Automatically generates srcSet for different screen sizes
 */
interface ResponsiveImageProps extends Omit<OptimizedImageProps, 'srcSet'> {
  breakpoints?: number[];
}

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  breakpoints = [320, 640, 960, 1280],
  ...props
}) => {
  // Generate srcSet for different breakpoints
  const generateSrcSet = (imageSrc: string): string => {
    return breakpoints
      .map((bp) => {
        const optimized = getOptimizedSrc(imageSrc);
        // Add breakpoint to filename if possible
        const withBreakpoint = optimized.replace(
          /(\.[^.]+)$/,
          `-${bp}$1`
        );
        return `${withBreakpoint} ${bp}w`;
      })
      .join(', ');
  };

  // Generate sizes attribute
  const sizes = `(max-width: 640px) 100vw, (max-width: 1024px) 75vw, 50vw`;

  return (
    <OptimizedImage
      {...props}
      src={src}
      srcSet={generateSrcSet(src)}
      sizes={sizes}
    />
  );
};

/**
 * Image with Blur-up Effect
 * Shows a blurred placeholder while loading
 */
interface BlurImageProps extends OptimizedImageProps {
  blurDataUrl?: string;
}

export const BlurImage: React.FC<BlurImageProps> = ({
  blurDataUrl,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative overflow-hidden">
      {/* Blur placeholder */}
      {blurDataUrl && !isLoaded && (
        <img
          src={blurDataUrl}
          alt={props.alt}
          className={`${props.className} blur-lg absolute inset-0`}
          style={{
            width: props.width ? `${props.width}px` : '100%',
            height: props.height ? `${props.height}px` : '100%',
          }}
        />
      )}

      {/* Actual image */}
      <OptimizedImage
        {...props}
        onLoad={() => {
          setIsLoaded(true);
          props.onLoad?.();
        }}
      />
    </div>
  );
};

export default OptimizedImage;
