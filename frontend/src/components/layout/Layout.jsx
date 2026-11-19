import React from 'react';
import Header from './Header';

export default function Layout({
  children,
  activeTab = 'dashboard',
  onSelectTab,
  onOpenCsvImport,
  onNavigateHome,
}) {
  return (
    <div className="flex min-h-screen flex-col bg-bg text-text font-sans antialiased w-full transition-colors duration-150">
      {/* Horizontal Top Navigation Bar */}
      <Header
        activeTab={activeTab}
        onSelectTab={onSelectTab}
        onOpenCsvImport={onOpenCsvImport}
        onNavigateHome={onNavigateHome}
      />

      {/* Main Content Area — Full Available Width */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-5">
        <div className="w-full animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}