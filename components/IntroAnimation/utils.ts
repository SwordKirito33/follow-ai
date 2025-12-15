/**
 * Check if intro has been seen
 */
export const hasSeenIntro = (): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('follow_intro_seen') === 'true';
};

/**
 * Mark intro as seen
 */
export const markIntroAsSeen = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('follow_intro_seen', 'true');
};

/**
 * Get viewport dimensions
 */
export const getViewportDimensions = () => {
  if (typeof window === 'undefined') {
    return { width: 1920, height: 1080 };
  }
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
};

