import React, { useState } from 'react';
import ThemeToggle from '../common/ThemeToggle';
import { LogoIcon } from '../common/Logo';

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
    <header className="sticky top-0 z-30 border-b border-border bg-white/80 dark:bg-black/70 backdrop-blur-md transition-colors duration-150">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Identity */}
        <a
          href="/"
          onClick={(e) => handleLinkClick(e, '/')}
          className="flex items-center gap-2.5 text-left group focus-ring rounded-md"
          aria-label="PrioritiQ CRM Home"
        >
          <LogoIcon size={28} />
          <div>
            <span className="font-bold text-text text-sm tracking-tight transition-colors">
              PrioritiQ CRM
            </span>
            <span className="hidden sm:inline-block ml-2 rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] font-mono text-text-muted">
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
                    ? 'text-text font-bold border-b-2 border-text'
                    : 'text-text-secondary hover:text-text'
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
            className="inline-flex items-center gap-1.5 rounded-md bg-accent text-accent-contrast hover:bg-accent-hover px-3.5 py-1.5 text-xs font-bold shadow-xs focus-ring transition-colors"
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
            className="rounded-md p-1.5 text-text-muted hover:bg-surface-hover hover:text-text focus-ring"
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
        <div className="md:hidden border-b border-border bg-surface px-4 py-3 space-y-1 shadow-sm animate-fade-in transition-colors">
          {navLinks.map((link) => {
            const isActive = currentRoute === link.path;
            return (
              <a
                key={link.path}
                href={link.path}
                onClick={(e) => handleLinkClick(e, link.path)}
                className={`block rounded-md px-3 py-2 text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-surface-raised text-text font-bold'
                    : 'text-text-secondary hover:bg-surface-hover hover:text-text'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {link.label}
              </a>
            );
          })}
          <div className="pt-2 border-t border-border">
            <button
              type="button"
              onClick={(e) => handleLinkClick(e, '/app')}
              className="flex w-full items-center justify-center gap-1.5 rounded-md bg-accent text-accent-contrast hover:bg-accent-hover px-3 py-2 text-xs font-bold shadow-xs transition-colors"
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