import React, { useState } from 'react';
import ThemeToggle from '../common/ThemeToggle';
import { LogoIcon } from '../common/Logo';

export default function Header({
  activeTab = 'dashboard',
  onSelectTab,
  onOpenCsvImport,
  onNavigateHome,
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      id: 'leads',
      name: 'Leads',
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      id: 'import',
      name: 'Import CSV',
      isAction: true,
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
      ),
      badge: 'Batch',
    },
    {
      id: 'analytics',
      name: 'Analytics',
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
  ];

  const handleNavClick = (item) => {
    if (item.id === 'import') {
      if (onOpenCsvImport) onOpenCsvImport();
    } else {
      if (onSelectTab) onSelectTab(item.id);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Sticky AMOLED Glassmorphic Top Navbar */}
      <header className="sticky top-0 z-30 w-full border-b border-border bg-white/80 dark:bg-black/70 backdrop-blur-md transition-colors duration-150">
        <div className="w-full flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Left: Branding & Mobile Menu Toggle */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="inline-flex items-center justify-center rounded-md p-1.5 text-text-muted hover:bg-surface-hover hover:text-text focus-ring md:hidden transition-colors"
              aria-label="Open CRM navigation menu"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* PrioritiQ Branding on the Left */}
            <button
              type="button"
              onClick={() => onSelectTab && onSelectTab('dashboard')}
              className="flex items-center gap-2.5 text-left group focus-ring rounded-md"
              title="PrioritiQ CRM Dashboard"
            >
              <LogoIcon size={28} />
              <div className="flex items-center gap-2">
                <span className="font-bold text-text text-sm tracking-tight transition-colors">
                  PrioritiQ CRM
                </span>
                <span className="hidden sm:inline-flex rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] text-text-muted font-mono">
                  Parts Desk
                </span>
              </div>
            </button>

            {/* Center/Left: Horizontal Navigation Items (Desktop with white/black active underline) */}
            <nav aria-label="CRM Navigation" className="hidden md:flex items-center h-14 gap-1 lg:gap-2 ml-4 lg:ml-6">
              {navigationItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavClick(item)}
                    className={`relative flex items-center gap-1.5 h-14 px-3 text-xs font-medium transition-colors ${
                      isActive
                        ? 'text-text font-bold border-b-2 border-text'
                        : 'text-text-secondary hover:text-text border-b-2 border-transparent hover:border-border hover:bg-surface-hover'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span className={isActive ? 'text-text' : 'text-text-muted'}>
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                    {item.badge && (
                      <span className="ml-0.5 rounded border border-border bg-surface-raised px-1.5 py-0.5 text-[9px] text-text-muted font-mono">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right: Theme Toggle, Product Overview Link & User Badge */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Dark Mode / Light Mode Theme Toggle */}
            <ThemeToggle />

            {/* Product Overview Navigation Link */}
            {onNavigateHome && (
              <button
                type="button"
                onClick={onNavigateHome}
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface hover:bg-surface-hover hover:border-border-strong px-2.5 py-1.5 text-xs font-semibold text-text transition-all focus-ring"
                title="Return to Product Overview & Landing Page"
              >
                <svg className="h-3.5 w-3.5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="hidden sm:inline">Product Overview</span>
                <span className="sm:hidden">Overview</span>
              </button>
            )}

            {/* Sales Desk Status / User Badge */}
            <div className="flex items-center gap-2 pl-2 border-l border-border">
              <div className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-surface-raised text-text font-mono font-bold text-xs shadow-xs">
                SR
              </div>
              <div className="hidden lg:block text-left text-xs leading-tight">
                <p className="font-semibold text-text">Sales Desk</p>
                <p className="text-[11px] text-text-muted font-mono">Commercial Parts</p>
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* Responsive Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop with black blur */}
          <div
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-xs md:hidden transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-border shadow-2xl flex flex-col md:hidden transition-colors">
            {/* Brand Header & Close Button */}
            <div className="flex h-14 items-center justify-between border-b border-border px-4">
              <div className="flex items-center gap-2.5">
                <LogoIcon size={28} />
                <div>
                  <span className="font-bold text-text text-sm tracking-tight">PrioritiQ CRM</span>
                  <span className="block text-[10px] text-text-muted uppercase tracking-wider font-mono">Parts Desk</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-md p-1 text-text-muted hover:bg-surface-hover hover:text-text transition-colors"
                aria-label="Close navigation menu"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Mobile Navigation Links */}
            <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
              <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider px-2 pb-1">
                CRM Workspace
              </div>
              {navigationItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavClick(item)}
                    className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-xs transition-colors ${
                      isActive
                        ? 'bg-surface-raised text-text font-bold border-l-2 border-text rounded-l-none'
                        : 'text-text-secondary hover:bg-surface-hover hover:text-text font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={isActive ? 'text-text' : 'text-text-muted'}>
                        {item.icon}
                      </span>
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className="rounded border border-border bg-surface px-1.5 py-0.5 text-[9px] text-text-muted font-mono">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}

              {/* Theme Toggle row in Mobile Drawer */}
              <div className="pt-3 mt-3 border-t border-border">
                <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider px-2 pb-2">
                  Appearance
                </div>
                <div className="px-2">
                  <ThemeToggle className="w-full justify-start py-2 px-3" showLabel={true} />
                </div>
              </div>

              {/* Product Overview Link in Mobile Menu */}
              <div className="pt-3 mt-3 border-t border-border">
                <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider px-2 pb-1">
                  Public Website
                </div>
                {onNavigateHome && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onNavigateHome();
                    }}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs text-text hover:bg-surface-hover font-medium transition-colors"
                  >
                    <svg className="h-4 w-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span>Product Overview</span>
                  </button>
                )}
              </div>
            </nav>

            {/* Mobile Footer */}
            <div className="border-t border-border p-3 bg-surface-raised flex items-center justify-between text-xs transition-colors">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md border border-border bg-surface text-text font-mono font-semibold text-[10px]">
                  SR
                </div>
                <div className="text-[11px] leading-tight text-text">
                  <div className="font-semibold">Sales Desk</div>
                  <div className="text-[10px] text-text-muted font-mono">Commercial Parts</div>
                </div>
              </div>
              <span className="rounded border border-border bg-surface text-text px-1.5 py-0.5 text-[9px] font-mono">
                Active
              </span>
            </div>
          </div>
        </>
      )}
    </>
  );
}