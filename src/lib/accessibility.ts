/**
 * Accessibility utilities for WCAG 2.2 compliance
 */

/**
 * Check color contrast ratio
 * @param foreground Foreground color (hex)
 * @param background Background color (hex)
 * @returns Contrast ratio
 */
export function getContrastRatio(foreground: string, background: string): number {
  const fgLum = getRelativeLuminance(foreground);
  const bgLum = getRelativeLuminance(background);
  
  const lighter = Math.max(fgLum, bgLum);
  const darker = Math.min(fgLum, bgLum);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Get relative luminance of a color
 * @param color Hex color
 * @returns Relative luminance value
 */
function getRelativeLuminance(color: string): number {
  const rgb = hexToRgb(color);
  if (!rgb) return 0;
  
  const [r, g, b] = rgb.map(val => {
    const v = val / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex: string): [number, number, number] | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16),
  ] : null;
}

/**
 * Check if contrast ratio meets WCAG standards
 * @param ratio Contrast ratio
 * @param level WCAG level (AA or AAA)
 * @param largeText Is text large (18pt+)
 * @returns true if meets standard
 */
export function meetsWCAGStandard(
  ratio: number,
  level: 'AA' | 'AAA' = 'AA',
  largeText: boolean = false
): boolean {
  if (level === 'AAA') {
    return largeText ? ratio >= 4.5 : ratio >= 7;
  }
  // AA level
  return largeText ? ratio >= 3 : ratio >= 4.5;
}

/**
 * Validate focus management
 */
export function validateFocusManagement(): {
  hasFocusableElements: boolean;
  focusOrder: string[];
  issues: string[];
} {
  const focusableElements = document.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const issues: string[] = [];
  
  // Check for focus trap
  if (focusableElements.length === 0) {
    issues.push('No focusable elements found');
  }
  
  // Check for visible focus indicator
  const firstFocusable = focusableElements[0] as HTMLElement;
  if (firstFocusable) {
    firstFocusable.focus();
    const computed = window.getComputedStyle(firstFocusable, ':focus');
    if (!computed.outline && !computed.boxShadow) {
      issues.push('No visible focus indicator');
    }
  }
  
  return {
    hasFocusableElements: focusableElements.length > 0,
    focusOrder: Array.from(focusableElements).map((el) => el.tagName),
    issues,
  };
}

/**
 * Validate semantic HTML
 */
export function validateSemanticHTML(): {
  headings: number;
  landmarks: number;
  issues: string[];
} {
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const landmarks = document.querySelectorAll('main, nav, header, footer, aside, [role="main"]');
  
  const issues: string[] = [];
  
  // Check for h1
  const h1Count = document.querySelectorAll('h1').length;
  if (h1Count === 0) {
    issues.push('No h1 found on page');
  } else if (h1Count > 1) {
    issues.push('Multiple h1 elements found');
  }
  
  // Check for main landmark
  if (landmarks.length === 0) {
    issues.push('No main landmark found');
  }
  
  return {
    headings: headings.length,
    landmarks: landmarks.length,
    issues,
  };
}

/**
 * Validate ARIA attributes
 */
export function validateARIA(): {
  ariaElements: number;
  issues: string[];
} {
  const ariaElements = document.querySelectorAll('[role], [aria-label], [aria-labelledby]');
  const issues: string[] = [];
  
  // Check for invalid ARIA roles
  const invalidRoles = new Set<string>();
  ariaElements.forEach((el) => {
    const role = el.getAttribute('role');
    if (role && !isValidARIARole(role)) {
      invalidRoles.add(role);
    }
  });
  
  if (invalidRoles.size > 0) {
    issues.push(`Invalid ARIA roles found: ${Array.from(invalidRoles).join(', ')}`);
  }
  
  return {
    ariaElements: ariaElements.length,
    issues,
  };
}

/**
 * Check if ARIA role is valid
 */
function isValidARIARole(role: string): boolean {
  const validRoles = [
    'alert', 'alertdialog', 'application', 'article', 'banner',
    'button', 'checkbox', 'columnheader', 'combobox', 'complementary',
    'contentinfo', 'definition', 'dialog', 'directory', 'document',
    'feed', 'figure', 'form', 'grid', 'gridcell', 'group', 'heading',
    'img', 'link', 'list', 'listbox', 'listitem', 'log', 'main',
    'marquee', 'math', 'menu', 'menubar', 'menuitem', 'menuitemcheckbox',
    'menuitemradio', 'navigation', 'none', 'note', 'option', 'presentation',
    'progressbar', 'radio', 'radiogroup', 'region', 'row', 'rowgroup',
    'rowheader', 'scrollbar', 'search', 'searchbox', 'separator', 'slider',
    'spinbutton', 'status', 'switch', 'tab', 'tablist', 'tabpanel', 'term',
    'textbox', 'timer', 'toolbar', 'tooltip', 'tree', 'treegrid', 'treeitem',
  ];
  
  return validRoles.includes(role.toLowerCase());
}

/**
 * Run comprehensive accessibility audit
 */
export function runAccessibilityAudit() {
  return {
    focus: validateFocusManagement(),
    semantic: validateSemanticHTML(),
    aria: validateARIA(),
    timestamp: new Date().toISOString(),
  };
}
