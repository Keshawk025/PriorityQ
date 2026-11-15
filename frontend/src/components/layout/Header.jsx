import React, { useState } from 'react';
import ThemeToggle from '../common/ThemeToggle';

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
      {/* Sticky Premium Glassmorphic Top Navbar */}
      <header className="sticky top-0 z-30 w-full border-b border-[#DCE4EE] dark:border-[#26354D] bg-white/85 dark:bg-[#080D1D]/90 backdrop-blur-md supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-[#080D1D]/85 shadow-[0_1px_3px_0_rgba(23,59,103,0.04)] dark:shadow-[0_1px_3px_0_rgba(0,0,0,0.3)] transition-colors duration-150">
        <div className="w-full flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Left: Branding & Mobile Menu Toggle */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="inline-flex items-center justify-center rounded p-1.5 text-[#64748B] dark:text-[#94A3B8] hover:bg-[#E9EFF8] dark:hover:bg-[#162032] hover:text-[#172438] dark:hover:text-[#F8FAFC] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3678D4] md:hidden transition-colors"
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
              className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3678D4] rounded"
              title="PrioritiQ CRM Dashboard"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded bg-[#173B67] dark:bg-[#3678D4] text-white font-bold text-xs group-hover:bg-[#3678D4] dark:group-hover:bg-[#2A62B6] transition-colors shadow-sm">
                P
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#173B67] dark:text-[#F8FAFC] text-sm tracking-tight group-hover:text-[#3678D4] dark:group-hover:text-[#60A5FA] transition-colors">
                  PrioritiQ CRM
                </span>
                <span className="hidden sm:inline-flex rounded border border-[#DCE4EE] dark:border-[#26354D] bg-[#E9EFF8] dark:bg-[#162032] px-1.5 py-0.5 text-[10px] text-[#173B67] dark:text-[#93C5FD] font-semibold">
                  Parts Desk
                </span>
              </div>
            </button>

            {/* Center/Left: Horizontal Navigation Items (Desktop) */}
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
                        ? 'text-[#3678D4] dark:text-[#60A5FA] font-semibold border-b-2 border-[#3678D4] dark:border-[#60A5FA]'
                        : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#172438] dark:hover:text-[#F8FAFC] border-b-2 border-transparent hover:border-[#DCE4EE] dark:hover:border-[#26354D] hover:bg-[#F3F6FA]/60 dark:hover:bg-[#162032]/60'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span className={isActive ? 'text-[#3678D4] dark:text-[#60A5FA]' : 'text-[#64748B] dark:text-[#94A3B8]'}>
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                    {item.badge && (
                      <span className="ml-0.5 rounded bg-[#E9EFF8] dark:bg-[#1E3A8A]/40 border border-[#DCE4EE] dark:border-[#3B82F6]/40 px-1.5 py-0.2 text-[9px] text-[#173B67] dark:text-[#93C5FD] font-semibold">
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

            {/* Separate Product Overview Navigation Link */}
            {onNavigateHome && (
              <button
                type="button"
                onClick={onNavigateHome}
                className="inline-flex items-center gap-1.5 rounded border border-[#DCE4EE] dark:border-[#26354D] bg-white dark:bg-[#162032] hover:bg-[#E9EFF8] dark:hover:bg-[#1A263D] hover:border-[#3678D4]/40 dark:hover:border-[#3678D4]/60 px-2.5 py-1 text-xs font-medium text-[#172438] dark:text-[#F8FAFC] transition-all shadow-sm"
                title="Return to Product Overview & Landing Page"
              >
                <svg className="h-3.5 w-3.5 text-[#3678D4] dark:text-[#60A5FA]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="hidden sm:inline">Product Overview</span>
                <span className="sm:hidden">Overview</span>
              </button>
            )}

            {/* Sales Desk Status / User Badge */}
            <div className="flex items-center gap-2 pl-2 border-l border-[#DCE4EE] dark:border-[#26354D]">
              <div className="flex h-7 w-7 items-center justify-center rounded bg-[#173B67] dark:bg-[#3678D4] text-white font-semibold text-xs shadow-xs">
                SR
              </div>
              <div className="hidden lg:block text-left text-xs leading-tight">
                <p className="font-semibold text-[#172438] dark:text-[#F8FAFC]">Sales Desk</p>
                <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">Commercial Parts</p>
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* Responsive Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop with soft blur */}
          <div
            className="fixed inset-0 z-40 bg-[#173B67]/30 backdrop-blur-xs md:hidden transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Panel with frosted glass */}
          <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white/95 dark:bg-[#0B132B]/95 backdrop-blur-md border-r border-[#DCE4EE] dark:border-[#26354D] shadow-xl flex flex-col md:hidden transition-colors">
            {/* Brand Header & Close Button */}
            <div className="flex h-14 items-center justify-between border-b border-[#DCE4EE] dark:border-[#26354D] px-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded bg-[#173B67] dark:bg-[#3678D4] text-white font-bold text-xs shadow-sm">
                  P
                </div>
                <div>
                  <span className="font-bold text-[#173B67] dark:text-[#F8FAFC] text-sm tracking-tight">PrioritiQ CRM</span>
                  <span className="block text-[10px] text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider font-semibold">Parts Desk</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded p-1 text-[#64748B] dark:text-[#94A3B8] hover:bg-[#E9EFF8] dark:hover:bg-[#162032] hover:text-[#172438] dark:hover:text-[#F8FAFC] transition-colors"
                aria-label="Close navigation menu"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Mobile Navigation Links */}
            <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
              <div className="text-[10px] font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider px-2 pb-1">
                CRM Workspace
              </div>
              {navigationItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavClick(item)}
                    className={`flex w-full items-center justify-between rounded px-3 py-2 text-xs transition-colors ${
                      isActive
                        ? 'bg-[#E9EFF8] dark:bg-[#1E3A8A]/30 text-[#3678D4] dark:text-[#60A5FA] font-semibold border-l-2 border-[#3678D4] dark:border-[#60A5FA] rounded-l-none'
                        : 'text-[#172438] dark:text-[#F8FAFC] hover:bg-[#F3F6FA] dark:hover:bg-[#162032] hover:text-[#3678D4] dark:hover:text-[#60A5FA] font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={isActive ? 'text-[#3678D4] dark:text-[#60A5FA]' : 'text-[#64748B] dark:text-[#94A3B8]'}>
                        {item.icon}
                      </span>
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className="rounded bg-[#E9EFF8] dark:bg-[#1E3A8A]/40 border border-[#DCE4EE] dark:border-[#3B82F6]/40 px-1.5 py-0.5 text-[10px] text-[#173B67] dark:text-[#93C5FD] font-semibold">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}

              {/* Theme Toggle row in Mobile Drawer */}
              <div className="pt-3 mt-3 border-t border-[#DCE4EE] dark:border-[#26354D]">
                <div className="text-[10px] font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider px-2 pb-2">
                  Appearance
                </div>
                <div className="px-2">
                  <ThemeToggle className="w-full justify-start py-2 px-3" showLabel={true} />
                </div>
              </div>

              {/* Product Overview Link in Mobile Menu */}
              <div className="pt-3 mt-3 border-t border-[#DCE4EE] dark:border-[#26354D]">
                <div className="text-[10px] font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider px-2 pb-1">
                  Public Website
                </div>
                {onNavigateHome && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onNavigateHome();
                    }}
                    className="flex w-full items-center gap-2 rounded px-3 py-2 text-xs text-[#172438] dark:text-[#F8FAFC] hover:bg-[#E9EFF8] dark:hover:bg-[#162032] hover:text-[#3678D4] dark:hover:text-[#60A5FA] font-medium transition-colors"
                  >
                    <svg className="h-4 w-4 text-[#3678D4] dark:text-[#60A5FA]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span>Product Overview</span>
                  </button>
                )}
              </div>
            </nav>

            {/* Mobile Footer */}
            <div className="border-t border-[#DCE4EE] dark:border-[#26354D] p-3 bg-[#F3F6FA] dark:bg-[#162032] flex items-center justify-between text-xs transition-colors">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded bg-[#173B67] dark:bg-[#3678D4] text-white font-semibold text-[10px]">
                  SR
                </div>
                <div className="text-[11px] leading-tight text-[#172438] dark:text-[#F8FAFC]">
                  <div className="font-semibold">Sales Desk</div>
                  <div className="text-[10px] text-[#64748B] dark:text-[#94A3B8]">Commercial Parts</div>
                </div>
              </div>
              <span className="rounded bg-[#ECFDF5] dark:bg-[#064E3B]/40 border border-[#6EE7B7] dark:border-[#059669]/50 text-[#059669] dark:text-[#34D399] px-1.5 py-0.5 text-[9px] font-bold">
                Online
              </span>
            </div>
          </div>
        </>
      )}
    </>
  );
}
