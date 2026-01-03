/**
 * Accessibility utilities for Follow.ai
 * Ensures WCAG 2.1 AA compliance
 */

// Focus management
export const focusManagement = {
  // Trap focus within an element (for modals)
  trapFocus: (element: HTMLElement): (() => void) => {
    const focusableElements = element.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable?.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable?.focus();
        }
      }
    };

    element.addEventListener('keydown', handleKeyDown);
    firstFocusable?.focus();

    return () => {
      element.removeEventListener('keydown', handleKeyDown);
    };
  },

  // Return focus to trigger element after modal closes
  returnFocus: (triggerElement: HTMLElement | null): void => {
    if (triggerElement && typeof triggerElement.focus === 'function') {
      triggerElement.focus();
    }
  },

  // Skip to main content
  skipToMain: (): void => {
    const main = document.querySelector('main') || document.querySelector('[role="main"]');
    if (main instanceof HTMLElement) {
      main.tabIndex = -1;
      main.focus();
    }
  },
};

// Screen reader announcements
export const announce = (message: string, priority: 'polite' | 'assertive' = 'polite'): void => {
  const announcer = document.createElement('div');
  announcer.setAttribute('role', 'status');
  announcer.setAttribute('aria-live', priority);
  announcer.setAttribute('aria-atomic', 'true');
  announcer.className = 'sr-only';
  announcer.style.cssText = `
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  `;

  document.body.appendChild(announcer);

  // Delay to ensure screen reader picks up the change
  setTimeout(() => {
    announcer.textContent = message;
  }, 100);

  // Clean up after announcement
  setTimeout(() => {
    document.body.removeChild(announcer);
  }, 1000);
};

// Color contrast checker
export const checkContrast = (foreground: string, background: string): {
  ratio: number;
  passesAA: boolean;
  passesAAA: boolean;
} => {
  const getLuminance = (color: string): number => {
    const rgb = hexToRgb(color);
    if (!rgb) return 0;

    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((c) => {
      c /= 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

  return {
    ratio: Math.round(ratio * 100) / 100,
    passesAA: ratio >= 4.5,
    passesAAA: ratio >= 7,
  };
};

// Helper to convert hex to RGB
const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

// Keyboard navigation helpers
export const keyboardNav = {
  // Handle arrow key navigation in lists
  handleListNavigation: (
    e: KeyboardEvent,
    items: HTMLElement[],
    currentIndex: number
  ): number => {
    let newIndex = currentIndex;

    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        e.preventDefault();
        newIndex = (currentIndex + 1) % items.length;
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        e.preventDefault();
        newIndex = (currentIndex - 1 + items.length) % items.length;
        break;
      case 'Home':
        e.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        newIndex = items.length - 1;
        break;
    }

    items[newIndex]?.focus();
    return newIndex;
  },

  // Handle typeahead in lists
  createTypeahead: (items: { label: string; element: HTMLElement }[]) => {
    let searchString = '';
    let searchTimeout: NodeJS.Timeout;

    return (e: KeyboardEvent): void => {
      if (e.key.length !== 1) return;

      clearTimeout(searchTimeout);
      searchString += e.key.toLowerCase();

      const match = items.find((item) =>
        item.label.toLowerCase().startsWith(searchString)
      );

      if (match) {
        match.element.focus();
      }

      searchTimeout = setTimeout(() => {
        searchString = '';
      }, 500);
    };
  },
};

// Reduced motion preference
export const prefersReducedMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// High contrast mode detection
export const prefersHighContrast = (): boolean => {
  return window.matchMedia('(prefers-contrast: more)').matches;
};

// Generate accessible ID
let idCounter = 0;
export const generateAccessibleId = (prefix: string = 'a11y'): string => {
  return `${prefix}-${++idCounter}`;
};

// ARIA helpers
export const aria = {
  // Set up live region
  createLiveRegion: (id: string, politeness: 'polite' | 'assertive' = 'polite'): HTMLElement => {
    let region = document.getElementById(id);
    if (!region) {
      region = document.createElement('div');
      region.id = id;
      region.setAttribute('role', 'status');
      region.setAttribute('aria-live', politeness);
      region.setAttribute('aria-atomic', 'true');
      region.className = 'sr-only';
      document.body.appendChild(region);
    }
    return region;
  },

  // Describe element
  describeElement: (element: HTMLElement, description: string): string => {
    const id = generateAccessibleId('desc');
    const descElement = document.createElement('span');
    descElement.id = id;
    descElement.className = 'sr-only';
    descElement.textContent = description;
    element.appendChild(descElement);
    element.setAttribute('aria-describedby', id);
    return id;
  },

  // Label element
  labelElement: (element: HTMLElement, label: string): string => {
    const id = generateAccessibleId('label');
    const labelElement = document.createElement('span');
    labelElement.id = id;
    labelElement.className = 'sr-only';
    labelElement.textContent = label;
    element.parentElement?.insertBefore(labelElement, element);
    element.setAttribute('aria-labelledby', id);
    return id;
  },
};

// Form accessibility
export const formA11y = {
  // Associate error with input
  setError: (inputId: string, errorMessage: string): void => {
    const input = document.getElementById(inputId);
    const errorId = `${inputId}-error`;
    
    let errorElement = document.getElementById(errorId);
    if (!errorElement) {
      errorElement = document.createElement('span');
      errorElement.id = errorId;
      errorElement.className = 'text-red-600 text-sm';
      input?.parentElement?.appendChild(errorElement);
    }

    errorElement.textContent = errorMessage;
    input?.setAttribute('aria-invalid', 'true');
    input?.setAttribute('aria-describedby', errorId);
  },

  // Clear error
  clearError: (inputId: string): void => {
    const input = document.getElementById(inputId);
    const errorId = `${inputId}-error`;
    const errorElement = document.getElementById(errorId);

    if (errorElement) {
      errorElement.textContent = '';
    }
    input?.removeAttribute('aria-invalid');
    input?.removeAttribute('aria-describedby');
  },

  // Mark required field
  markRequired: (inputId: string): void => {
    const input = document.getElementById(inputId);
    input?.setAttribute('aria-required', 'true');
  },
};

// Export all utilities
export default {
  focusManagement,
  announce,
  checkContrast,
  keyboardNav,
  prefersReducedMotion,
  prefersHighContrast,
  generateAccessibleId,
  aria,
  formA11y,
};
