import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const THEME_STORAGE_KEY = 'prioritiq_theme';

const ThemeContext = createContext({
  theme: 'light',
  isDark: false,
  toggleTheme: () => {},
  setTheme: () => {},
});

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    if (typeof window === 'undefined') return 'light';
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const queryTheme = urlParams.get('theme');
      if (queryTheme === 'dark' || queryTheme === 'light') {
        try { localStorage.setItem(THEME_STORAGE_KEY, queryTheme); } catch {}
        return queryTheme;
      }
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'dark' || saved === 'light') return saved;
      // Default to system preference if nothing saved
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    } catch {
      return 'light';
    }
  });

  // Apply theme class to documentElement with temporary transition class
  const applyThemeToDOM = useCallback((newTheme, enableTransition = true) => {
    const root = document.documentElement;

    if (enableTransition) {
      root.classList.add('theme-transition');
    }

    if (newTheme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }

    try {
      const metaTheme = document.querySelector('meta[name="theme-color"]');
      if (metaTheme) {
        metaTheme.setAttribute('content', newTheme === 'dark' ? '#000000' : '#ffffff');
      }
    } catch {}

    if (enableTransition) {
      window.setTimeout(() => {
        root.classList.remove('theme-transition');
      }, 200);
    }
  }, []);

  const setTheme = useCallback((themeOrUpdater) => {
    setThemeState((currentTheme) => {
      const nextTheme = typeof themeOrUpdater === 'function' ? themeOrUpdater(currentTheme) : themeOrUpdater;
      if (nextTheme !== 'light' && nextTheme !== 'dark') return currentTheme;
      try {
        localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
      } catch (e) {
        console.warn('Unable to persist theme to localStorage', e);
      }
      applyThemeToDOM(nextTheme, true);
      return nextTheme;
    });
  }, [applyThemeToDOM]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, [setTheme]);

  // Initial sync on mount without transition delay
  useEffect(() => {
    applyThemeToDOM(theme, false);
  }, [theme, applyThemeToDOM]);

  // Listen to OS theme changes if user hasn't explicitly stored a preference
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      try {
        const saved = localStorage.getItem(THEME_STORAGE_KEY);
        if (!saved) {
          const sysTheme = e.matches ? 'dark' : 'light';
          setThemeState(sysTheme);
          applyThemeToDOM(sysTheme, true);
        }
      } catch {}
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [applyThemeToDOM]);

  const isDark = theme === 'dark';

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
