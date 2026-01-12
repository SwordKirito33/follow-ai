import { describe, it, expect, beforeEach } from 'vitest';
import {
  getContrastRatio,
  meetsWCAGStandard,
  validateFocusManagement,
  validateSemanticHTML,
  validateARIA,
  runAccessibilityAudit,
} from './accessibility';

describe('accessibility utilities', () => {
  describe('getContrastRatio', () => {
    it('should calculate contrast ratio for black and white', () => {
      const ratio = getContrastRatio('#000000', '#FFFFFF');
      expect(ratio).toBeCloseTo(21, 0);
    });

    it('should calculate contrast ratio for same colors', () => {
      const ratio = getContrastRatio('#000000', '#000000');
      expect(ratio).toBe(1);
    });

    it('should calculate contrast ratio for gray colors', () => {
      const ratio = getContrastRatio('#777777', '#FFFFFF');
      expect(ratio).toBeGreaterThan(1);
      expect(ratio).toBeLessThan(21);
    });

    it('should handle colors without # prefix', () => {
      const ratio = getContrastRatio('000000', 'FFFFFF');
      expect(ratio).toBeCloseTo(21, 0);
    });

    it('should handle lowercase hex colors', () => {
      const ratio = getContrastRatio('#ffffff', '#000000');
      expect(ratio).toBeCloseTo(21, 0);
    });

    it('should handle invalid hex colors', () => {
      const ratio = getContrastRatio('invalid', '#FFFFFF');
      expect(ratio).toBeDefined();
    });
  });

  describe('meetsWCAGStandard', () => {
    it('should pass AA standard for normal text with ratio 4.5', () => {
      expect(meetsWCAGStandard(4.5, 'AA', false)).toBe(true);
    });

    it('should fail AA standard for normal text with ratio 4.4', () => {
      expect(meetsWCAGStandard(4.4, 'AA', false)).toBe(false);
    });

    it('should pass AA standard for large text with ratio 3', () => {
      expect(meetsWCAGStandard(3, 'AA', true)).toBe(true);
    });

    it('should fail AA standard for large text with ratio 2.9', () => {
      expect(meetsWCAGStandard(2.9, 'AA', true)).toBe(false);
    });

    it('should pass AAA standard for normal text with ratio 7', () => {
      expect(meetsWCAGStandard(7, 'AAA', false)).toBe(true);
    });

    it('should fail AAA standard for normal text with ratio 6.9', () => {
      expect(meetsWCAGStandard(6.9, 'AAA', false)).toBe(false);
    });

    it('should pass AAA standard for large text with ratio 4.5', () => {
      expect(meetsWCAGStandard(4.5, 'AAA', true)).toBe(true);
    });

    it('should fail AAA standard for large text with ratio 4.4', () => {
      expect(meetsWCAGStandard(4.4, 'AAA', true)).toBe(false);
    });

    it('should default to AA level', () => {
      expect(meetsWCAGStandard(4.5)).toBe(true);
      expect(meetsWCAGStandard(4.4)).toBe(false);
    });

    it('should default to normal text', () => {
      expect(meetsWCAGStandard(4.5, 'AA')).toBe(true);
      expect(meetsWCAGStandard(3, 'AA')).toBe(false);
    });
  });

  describe('validateFocusManagement', () => {
    beforeEach(() => {
      document.body.innerHTML = '';
    });

    it('should detect no focusable elements', () => {
      const result = validateFocusManagement();
      expect(result.hasFocusableElements).toBe(false);
      expect(result.focusOrder).toHaveLength(0);
      expect(result.issues).toContain('No focusable elements found');
    });

    it('should detect focusable buttons', () => {
      document.body.innerHTML = '<button>Click me</button>';
      const result = validateFocusManagement();
      expect(result.hasFocusableElements).toBe(true);
      expect(result.focusOrder).toContain('BUTTON');
    });

    it('should detect focusable links', () => {
      document.body.innerHTML = '<a href="#">Link</a>';
      const result = validateFocusManagement();
      expect(result.hasFocusableElements).toBe(true);
      expect(result.focusOrder).toContain('A');
    });

    it('should detect focusable inputs', () => {
      document.body.innerHTML = '<input type="text" />';
      const result = validateFocusManagement();
      expect(result.hasFocusableElements).toBe(true);
      expect(result.focusOrder).toContain('INPUT');
    });

    it('should detect focusable selects', () => {
      document.body.innerHTML = '<select><option>Option</option></select>';
      const result = validateFocusManagement();
      expect(result.hasFocusableElements).toBe(true);
      expect(result.focusOrder).toContain('SELECT');
    });

    it('should detect focusable textareas', () => {
      document.body.innerHTML = '<textarea></textarea>';
      const result = validateFocusManagement();
      expect(result.hasFocusableElements).toBe(true);
      expect(result.focusOrder).toContain('TEXTAREA');
    });

    it('should detect elements with tabindex', () => {
      document.body.innerHTML = '<div tabindex="0">Focusable div</div>';
      const result = validateFocusManagement();
      expect(result.hasFocusableElements).toBe(true);
      expect(result.focusOrder).toContain('DIV');
    });

    it('should ignore elements with tabindex="-1"', () => {
      document.body.innerHTML = '<div tabindex="-1">Not focusable</div>';
      const result = validateFocusManagement();
      expect(result.hasFocusableElements).toBe(false);
    });

    it('should detect multiple focusable elements', () => {
      document.body.innerHTML = `
        <button>Button 1</button>
        <a href="#">Link</a>
        <input type="text" />
      `;
      const result = validateFocusManagement();
      expect(result.hasFocusableElements).toBe(true);
      expect(result.focusOrder).toHaveLength(3);
    });
  });

  describe('validateSemanticHTML', () => {
    beforeEach(() => {
      document.body.innerHTML = '';
    });

    it('should detect missing h1', () => {
      document.body.innerHTML = '<h2>Heading 2</h2>';
      const result = validateSemanticHTML();
      expect(result.issues).toContain('No h1 found on page');
    });

    it('should detect single h1', () => {
      document.body.innerHTML = '<h1>Heading 1</h1>';
      const result = validateSemanticHTML();
      expect(result.headings).toBe(1);
      expect(result.issues).not.toContain('No h1 found on page');
      expect(result.issues).not.toContain('Multiple h1 elements found');
    });

    it('should detect multiple h1 elements', () => {
      document.body.innerHTML = '<h1>Heading 1</h1><h1>Another H1</h1>';
      const result = validateSemanticHTML();
      expect(result.issues).toContain('Multiple h1 elements found');
    });

    it('should count all heading levels', () => {
      document.body.innerHTML = `
        <h1>H1</h1>
        <h2>H2</h2>
        <h3>H3</h3>
        <h4>H4</h4>
        <h5>H5</h5>
        <h6>H6</h6>
      `;
      const result = validateSemanticHTML();
      expect(result.headings).toBe(6);
    });

    it('should detect missing main landmark', () => {
      document.body.innerHTML = '<div>Content</div>';
      const result = validateSemanticHTML();
      expect(result.landmarks).toBe(0);
      expect(result.issues).toContain('No main landmark found');
    });

    it('should detect main landmark', () => {
      document.body.innerHTML = '<main>Main content</main>';
      const result = validateSemanticHTML();
      expect(result.landmarks).toBe(1);
      expect(result.issues).not.toContain('No main landmark found');
    });

    it('should detect nav landmark', () => {
      document.body.innerHTML = '<nav>Navigation</nav>';
      const result = validateSemanticHTML();
      expect(result.landmarks).toBe(1);
    });

    it('should detect header landmark', () => {
      document.body.innerHTML = '<header>Header</header>';
      const result = validateSemanticHTML();
      expect(result.landmarks).toBe(1);
    });

    it('should detect footer landmark', () => {
      document.body.innerHTML = '<footer>Footer</footer>';
      const result = validateSemanticHTML();
      expect(result.landmarks).toBe(1);
    });

    it('should detect aside landmark', () => {
      document.body.innerHTML = '<aside>Sidebar</aside>';
      const result = validateSemanticHTML();
      expect(result.landmarks).toBe(1);
    });

    it('should detect role="main"', () => {
      document.body.innerHTML = '<div role="main">Main content</div>';
      const result = validateSemanticHTML();
      expect(result.landmarks).toBe(1);
    });

    it('should count multiple landmarks', () => {
      document.body.innerHTML = `
        <header>Header</header>
        <nav>Nav</nav>
        <main>Main</main>
        <aside>Aside</aside>
        <footer>Footer</footer>
      `;
      const result = validateSemanticHTML();
      expect(result.landmarks).toBe(5);
    });
  });

  describe('validateARIA', () => {
    beforeEach(() => {
      document.body.innerHTML = '';
    });

    it('should detect no ARIA elements', () => {
      document.body.innerHTML = '<div>Content</div>';
      const result = validateARIA();
      expect(result.ariaElements).toBe(0);
      expect(result.issues).toHaveLength(0);
    });

    it('should detect elements with role attribute', () => {
      document.body.innerHTML = '<div role="button">Button</div>';
      const result = validateARIA();
      expect(result.ariaElements).toBe(1);
      expect(result.issues).toHaveLength(0);
    });

    it('should detect elements with aria-label', () => {
      document.body.innerHTML = '<button aria-label="Close">X</button>';
      const result = validateARIA();
      expect(result.ariaElements).toBe(1);
      expect(result.issues).toHaveLength(0);
    });

    it('should detect elements with aria-labelledby', () => {
      document.body.innerHTML = `
        <div id="label">Label</div>
        <button aria-labelledby="label">Button</button>
      `;
      const result = validateARIA();
      expect(result.ariaElements).toBe(1);
      expect(result.issues).toHaveLength(0);
    });

    it('should detect invalid ARIA roles', () => {
      document.body.innerHTML = '<div role="invalid-role">Content</div>';
      const result = validateARIA();
      expect(result.ariaElements).toBe(1);
      expect(result.issues.length).toBeGreaterThan(0);
      expect(result.issues[0]).toContain('Invalid ARIA roles found');
    });

    it('should accept valid ARIA roles', () => {
      const validRoles = ['alert', 'button', 'dialog', 'navigation', 'main', 'search'];
      validRoles.forEach(role => {
        document.body.innerHTML = `<div role="${role}">Content</div>`;
        const result = validateARIA();
        expect(result.issues).toHaveLength(0);
      });
    });

    it('should accept case-insensitive ARIA roles', () => {
      document.body.innerHTML = '<div role="BUTTON">Content</div>';
      const result = validateARIA();
      expect(result.issues).toHaveLength(0);
    });

    it('should detect multiple ARIA elements', () => {
      document.body.innerHTML = `
        <div role="button">Button</div>
        <button aria-label="Close">X</button>
        <div aria-labelledby="label">Content</div>
      `;
      const result = validateARIA();
      expect(result.ariaElements).toBe(3);
    });

    it('should detect multiple invalid roles', () => {
      document.body.innerHTML = `
        <div role="invalid1">Content 1</div>
        <div role="invalid2">Content 2</div>
      `;
      const result = validateARIA();
      expect(result.issues.length).toBeGreaterThan(0);
      expect(result.issues[0]).toContain('invalid1');
      expect(result.issues[0]).toContain('invalid2');
    });
  });

  describe('runAccessibilityAudit', () => {
    beforeEach(() => {
      document.body.innerHTML = '';
    });

    it('should run comprehensive audit', () => {
      document.body.innerHTML = `
        <h1>Title</h1>
        <main>
          <button>Click me</button>
          <div role="navigation">Nav</div>
        </main>
      `;
      const result = runAccessibilityAudit();
      
      expect(result.focus).toBeDefined();
      expect(result.semantic).toBeDefined();
      expect(result.aria).toBeDefined();
      expect(result.timestamp).toBeDefined();
    });

    it('should include focus validation results', () => {
      document.body.innerHTML = '<button>Click me</button>';
      const result = runAccessibilityAudit();
      
      expect(result.focus.hasFocusableElements).toBe(true);
      expect(result.focus.focusOrder).toContain('BUTTON');
    });

    it('should include semantic validation results', () => {
      document.body.innerHTML = '<h1>Title</h1><main>Content</main>';
      const result = runAccessibilityAudit();
      
      expect(result.semantic.headings).toBe(1);
      expect(result.semantic.landmarks).toBe(1);
    });

    it('should include ARIA validation results', () => {
      document.body.innerHTML = '<div role="button">Button</div>';
      const result = runAccessibilityAudit();
      
      expect(result.aria.ariaElements).toBe(1);
    });

    it('should include timestamp', () => {
      const result = runAccessibilityAudit();
      const timestamp = new Date(result.timestamp);
      
      expect(timestamp).toBeInstanceOf(Date);
      expect(timestamp.getTime()).toBeLessThanOrEqual(Date.now());
    });

    it('should detect all issues in comprehensive audit', () => {
      document.body.innerHTML = '<div>No semantic HTML</div>';
      const result = runAccessibilityAudit();
      
      expect(result.focus.issues.length).toBeGreaterThan(0);
      expect(result.semantic.issues.length).toBeGreaterThan(0);
    });
  });
});
