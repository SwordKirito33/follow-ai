// Theme configuration for Follow.ai
// Supports multiple color schemes and customization

export interface ThemeColors {
  primary: string;
  primaryHover: string;
  secondary: string;
  secondaryHover: string;
  accent: string;
  background: string;
  backgroundSecondary: string;
  surface: string;
  surfaceHover: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  borderHover: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  colors: {
    light: ThemeColors;
    dark: ThemeColors;
  };
  fonts: {
    heading: string;
    body: string;
    mono: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

export const defaultTheme: Theme = {
  id: 'default',
  name: 'Default',
  description: 'The default Follow.ai theme',
  colors: {
    light: {
      primary: '#3B82F6',
      primaryHover: '#2563EB',
      secondary: '#8B5CF6',
      secondaryHover: '#7C3AED',
      accent: '#EC4899',
      background: '#F9FAFB',
      backgroundSecondary: '#F3F4F6',
      surface: '#FFFFFF',
      surfaceHover: '#F9FAFB',
      text: '#111827',
      textSecondary: '#4B5563',
      textMuted: '#9CA3AF',
      border: '#E5E7EB',
      borderHover: '#D1D5DB',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    },
    dark: {
      primary: '#60A5FA',
      primaryHover: '#3B82F6',
      secondary: '#A78BFA',
      secondaryHover: '#8B5CF6',
      accent: '#F472B6',
      background: '#030712',
      backgroundSecondary: '#111827',
      surface: '#1F2937',
      surfaceHover: '#374151',
      text: '#F9FAFB',
      textSecondary: '#D1D5DB',
      textMuted: '#6B7280',
      border: '#374151',
      borderHover: '#4B5563',
      success: '#34D399',
      warning: '#FBBF24',
      error: '#F87171',
      info: '#60A5FA',
    },
  },
  fonts: {
    heading: 'Inter, system-ui, sans-serif',
    body: 'Inter, system-ui, sans-serif',
    mono: 'JetBrains Mono, monospace',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },
};

export const oceanTheme: Theme = {
  ...defaultTheme,
  id: 'ocean',
  name: 'Ocean',
  description: 'A calming blue ocean theme',
  colors: {
    light: {
      ...defaultTheme.colors.light,
      primary: '#0EA5E9',
      primaryHover: '#0284C7',
      secondary: '#06B6D4',
      secondaryHover: '#0891B2',
      accent: '#14B8A6',
      background: '#F0F9FF',
      backgroundSecondary: '#E0F2FE',
    },
    dark: {
      ...defaultTheme.colors.dark,
      primary: '#38BDF8',
      primaryHover: '#0EA5E9',
      secondary: '#22D3EE',
      secondaryHover: '#06B6D4',
      accent: '#2DD4BF',
      background: '#0C1929',
      backgroundSecondary: '#0F2942',
    },
  },
};

export const forestTheme: Theme = {
  ...defaultTheme,
  id: 'forest',
  name: 'Forest',
  description: 'A natural green forest theme',
  colors: {
    light: {
      ...defaultTheme.colors.light,
      primary: '#22C55E',
      primaryHover: '#16A34A',
      secondary: '#84CC16',
      secondaryHover: '#65A30D',
      accent: '#10B981',
      background: '#F0FDF4',
      backgroundSecondary: '#DCFCE7',
    },
    dark: {
      ...defaultTheme.colors.dark,
      primary: '#4ADE80',
      primaryHover: '#22C55E',
      secondary: '#A3E635',
      secondaryHover: '#84CC16',
      accent: '#34D399',
      background: '#052E16',
      backgroundSecondary: '#14532D',
    },
  },
};

export const sunsetTheme: Theme = {
  ...defaultTheme,
  id: 'sunset',
  name: 'Sunset',
  description: 'A warm sunset gradient theme',
  colors: {
    light: {
      ...defaultTheme.colors.light,
      primary: '#F97316',
      primaryHover: '#EA580C',
      secondary: '#EF4444',
      secondaryHover: '#DC2626',
      accent: '#F59E0B',
      background: '#FFFBEB',
      backgroundSecondary: '#FEF3C7',
    },
    dark: {
      ...defaultTheme.colors.dark,
      primary: '#FB923C',
      primaryHover: '#F97316',
      secondary: '#F87171',
      secondaryHover: '#EF4444',
      accent: '#FBBF24',
      background: '#1C1917',
      backgroundSecondary: '#292524',
    },
  },
};

export const purpleHazeTheme: Theme = {
  ...defaultTheme,
  id: 'purple-haze',
  name: 'Purple Haze',
  description: 'A mystical purple theme',
  colors: {
    light: {
      ...defaultTheme.colors.light,
      primary: '#8B5CF6',
      primaryHover: '#7C3AED',
      secondary: '#A855F7',
      secondaryHover: '#9333EA',
      accent: '#EC4899',
      background: '#FAF5FF',
      backgroundSecondary: '#F3E8FF',
    },
    dark: {
      ...defaultTheme.colors.dark,
      primary: '#A78BFA',
      primaryHover: '#8B5CF6',
      secondary: '#C084FC',
      secondaryHover: '#A855F7',
      accent: '#F472B6',
      background: '#1E1B2E',
      backgroundSecondary: '#2D2A3E',
    },
  },
};

export const roseGoldTheme: Theme = {
  ...defaultTheme,
  id: 'rose-gold',
  name: 'Rose Gold',
  description: 'An elegant rose gold theme',
  colors: {
    light: {
      ...defaultTheme.colors.light,
      primary: '#EC4899',
      primaryHover: '#DB2777',
      secondary: '#F472B6',
      secondaryHover: '#EC4899',
      accent: '#F59E0B',
      background: '#FDF2F8',
      backgroundSecondary: '#FCE7F3',
    },
    dark: {
      ...defaultTheme.colors.dark,
      primary: '#F472B6',
      primaryHover: '#EC4899',
      secondary: '#F9A8D4',
      secondaryHover: '#F472B6',
      accent: '#FBBF24',
      background: '#1F1318',
      backgroundSecondary: '#2D1D25',
    },
  },
};

export const midnightTheme: Theme = {
  ...defaultTheme,
  id: 'midnight',
  name: 'Midnight',
  description: 'A deep dark midnight theme',
  colors: {
    light: {
      ...defaultTheme.colors.light,
      primary: '#6366F1',
      primaryHover: '#4F46E5',
      secondary: '#8B5CF6',
      secondaryHover: '#7C3AED',
      accent: '#06B6D4',
      background: '#F8FAFC',
      backgroundSecondary: '#F1F5F9',
    },
    dark: {
      ...defaultTheme.colors.dark,
      primary: '#818CF8',
      primaryHover: '#6366F1',
      secondary: '#A78BFA',
      secondaryHover: '#8B5CF6',
      accent: '#22D3EE',
      background: '#020617',
      backgroundSecondary: '#0F172A',
      surface: '#1E293B',
      surfaceHover: '#334155',
    },
  },
};

export const themes: Theme[] = [
  defaultTheme,
  oceanTheme,
  forestTheme,
  sunsetTheme,
  purpleHazeTheme,
  roseGoldTheme,
  midnightTheme,
];

export const getThemeById = (id: string): Theme => {
  return themes.find((t) => t.id === id) || defaultTheme;
};

export const applyTheme = (theme: Theme, mode: 'light' | 'dark') => {
  const colors = theme.colors[mode];
  const root = document.documentElement;

  // Apply colors as CSS variables
  Object.entries(colors).forEach(([key, value]) => {
    const cssVarName = `--color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
    root.style.setProperty(cssVarName, value);
  });

  // Apply fonts
  root.style.setProperty('--font-heading', theme.fonts.heading);
  root.style.setProperty('--font-body', theme.fonts.body);
  root.style.setProperty('--font-mono', theme.fonts.mono);

  // Apply border radius
  Object.entries(theme.borderRadius).forEach(([key, value]) => {
    root.style.setProperty(`--radius-${key}`, value);
  });

  // Apply shadows
  Object.entries(theme.shadows).forEach(([key, value]) => {
    root.style.setProperty(`--shadow-${key}`, value);
  });
};

export default themes;
