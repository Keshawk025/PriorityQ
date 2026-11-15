import React, { useState } from 'react';
import ThemeToggle from '../common/ThemeToggle';

export default function Navbar({ currentRoute, onNavigate }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Features', path: '/features' },
    { label: 'How It Works', path: '/how-it-works' },
    { label: 'Privacy Policy', path: '/privacy' },
  ];

  const handleLinkClick = (e, path) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (onNavigate) onNavigate(path);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-[#DCE4EE] dark:border-[#26354D] bg-white/85 dark:bg-[#080D1D]/90 backdrop-blur-md supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-[#080D1D]/85 shadow-[0_1px_3px_0_rgba(23,59,103,0.04)] dark:shadow-[0_1px_3px_0_rgba(0,0,0,0.3)] transition-colors duration-150">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Identity */}
        <a
          href="/"
          onClick={(e) => handleLinkClick(e, '/')}
          className="flex items-center gap-2.5 text-left group focus-ring rounded"
          aria-label="PrioritiQ CRM Home"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded bg-[#173B67] dark:bg-[#3678D4] text-white font-bold text-xs group-hover:bg-[#3678D4] dark:group-hover:bg-[#2A62B6] transition-colors shadow-sm">
            P
          </div>
          <div>
            <span className="font-bold text-[#173B67] dark:text-[#F8FAFC] text-sm tracking-tight group-hover:text-[#3678D4] dark:group-hover:text-[#60A5FA] transition-colors">
              PrioritiQ CRM
            </span>
            <span className="hidden sm:inline-block ml-2 rounded border border-[#DCE4EE] dark:border-[#26354D] bg-[#E9EFF8] dark:bg-[#162032] px-1.5 py-0.2 text-[10px] font-semibold text-[#173B67] dark:text-[#93C5FD]">
              Commercial Parts Desk
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-6 text-xs font-semibold">
          {navLinks.map((link) => {
            const isActive = currentRoute === link.path;
            return (
              <a
                key={link.path}
                href={link.path}
                onClick={(e) => handleLinkClick(e, link.path)}
                className={`transition-colors py-1 ${
                  isActive
                    ? 'text-[#3678D4] dark:text-[#60A5FA] font-bold border-b-2 border-[#3678D4] dark:border-[#60A5FA]'
                    : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#172438] dark:hover:text-[#F8FAFC]'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Desktop Theme Toggle & Primary CTA Button */}
        <div className="hidden sm:flex items-center gap-2.5 sm:gap-3">
          <ThemeToggle />

          <button
            type="button"
            onClick={(e) => handleLinkClick(e, '/app')}
            className="inline-flex items-center gap-1.5 rounded bg-[#3678D4] hover:bg-[#2A62B6] text-white px-3.5 py-1.5 text-xs font-bold shadow-btn btn-interactive focus-ring"
            aria-label="Launch CRM Application (Try It Now)"
          >
            <span>Try It Now</span>
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>

        {/* Mobile controls: Theme toggle + menu toggle */}
        <div className="flex items-center gap-1.5 md:hidden">
          <ThemeToggle />

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded p-1.5 text-[#64748B] dark:text-[#94A3B8] hover:bg-[#E9EFF8] dark:hover:bg-[#162032] hover:text-[#172438] dark:hover:text-[#F8FAFC] focus-ring"
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#DCE4EE] dark:border-[#26354D] bg-white/95 dark:bg-[#0B132B]/95 backdrop-blur-md px-4 py-3 space-y-1 shadow-sm animate-fade-in transition-colors">
          {navLinks.map((link) => {
            const isActive = currentRoute === link.path;
            return (
              <a
                key={link.path}
                href={link.path}
                onClick={(e) => handleLinkClick(e, link.path)}
                className={`block rounded px-3 py-2 text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-[#E9EFF8] dark:bg-[#1E3A8A]/30 text-[#3678D4] dark:text-[#60A5FA]'
                    : 'text-[#172438] dark:text-[#F8FAFC] hover:bg-[#F3F6FA] dark:hover:bg-[#162032]'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {link.label}
              </a>
            );
          })}
          <div className="pt-2 border-t border-[#DCE4EE] dark:border-[#26354D]">
            <button
              type="button"
              onClick={(e) => handleLinkClick(e, '/app')}
              className="flex w-full items-center justify-center gap-1.5 rounded bg-[#3678D4] hover:bg-[#2A62B6] text-white px-3 py-2 text-xs font-bold shadow-btn btn-interactive"
            >
              <span>Try It Now (Launch CRM)</span>
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
