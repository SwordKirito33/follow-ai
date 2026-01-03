import { useEffect, useCallback } from 'react';

interface ShortcutConfig {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  action: () => void;
  description?: string;
}

interface UseKeyboardShortcutsOptions {
  enabled?: boolean;
  preventDefault?: boolean;
}

export const useKeyboardShortcuts = (
  shortcuts: ShortcutConfig[],
  options: UseKeyboardShortcutsOptions = {}
) => {
  const { enabled = true, preventDefault = true } = options;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // Don't trigger shortcuts when typing in input fields
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      for (const shortcut of shortcuts) {
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = shortcut.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
        const altMatch = shortcut.alt ? event.altKey : !event.altKey;

        if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
          if (preventDefault) {
            event.preventDefault();
          }
          shortcut.action();
          break;
        }
      }
    },
    [shortcuts, enabled, preventDefault]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};

// Pre-defined common shortcuts
export const createNavigationShortcuts = (navigate: (path: string) => void): ShortcutConfig[] => [
  { key: 'h', description: 'Go to Home', action: () => navigate('/') },
  { key: 'd', description: 'Go to Dashboard', action: () => navigate('/dashboard') },
  { key: 'p', description: 'Go to Profile', action: () => navigate('/profile') },
  { key: 't', description: 'Go to Tasks', action: () => navigate('/tasks') },
  { key: 'w', description: 'Go to Wallet', action: () => navigate('/wallet') },
  { key: 'l', description: 'Go to Leaderboard', action: () => navigate('/leaderboard') },
];

export const createActionShortcuts = (actions: {
  openSearch?: () => void;
  openSettings?: () => void;
  toggleTheme?: () => void;
  openHelp?: () => void;
}): ShortcutConfig[] => {
  const shortcuts: ShortcutConfig[] = [];

  if (actions.openSearch) {
    shortcuts.push({
      key: 'k',
      ctrl: true,
      description: 'Open search',
      action: actions.openSearch,
    });
  }

  if (actions.openSettings) {
    shortcuts.push({
      key: ',',
      ctrl: true,
      description: 'Open settings',
      action: actions.openSettings,
    });
  }

  if (actions.toggleTheme) {
    shortcuts.push({
      key: 't',
      ctrl: true,
      shift: true,
      description: 'Toggle theme',
      action: actions.toggleTheme,
    });
  }

  if (actions.openHelp) {
    shortcuts.push({
      key: '?',
      shift: true,
      description: 'Open help',
      action: actions.openHelp,
    });
  }

  return shortcuts;
};

export default useKeyboardShortcuts;
