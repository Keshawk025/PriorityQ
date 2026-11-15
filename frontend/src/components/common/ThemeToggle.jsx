import React from 'react';
import { useTheme } from '../../context/ThemeContext';

/**
 * Professional Enterprise Theme Toggle Button
 *
 * Displays a Moon icon in Light Mode to switch to Dark Mode.
 * Displays a Sun icon in Dark Mode to switch to Light Mode.
 */
export default function ThemeToggle({ className = '', showLabel = false }) {
  const { theme, isDark, toggleTheme } = useTheme();

  const label = isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative inline-flex items-center justify-center gap-1.5 rounded-md border p-1.5 text-xs font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3678D4] ${
        isDark
          ? 'border-[#26354D] bg-[#162032] text-[#F8FAFC] hover:bg-[#1A263D] hover:text-[#38BDF8] hover:border-[#38BDF8]/40 shadow-sm'
          : 'border-[#DCE4EE] bg-white text-[#172438] hover:bg-[#E9EFF8] hover:text-[#3678D4] hover:border-[#3678D4]/30 shadow-xs'
      } ${className}`}
      aria-label={label}
      title={label}
    >
      {isDark ? (
        // Sun Icon (Switch to Light Mode)
        <svg
          className="h-4 w-4 text-amber-400 shrink-0 transition-transform duration-200"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ) : (
        // Moon Icon (Switch to Dark Mode)
        <svg
          className="h-4 w-4 text-[#64748B] shrink-0 transition-transform duration-200"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      )}

      {showLabel && (
        <span className="text-[11px] font-semibold">
          {isDark ? 'Light' : 'Dark'}
        </span>
      )}
    </button>
  );
}
