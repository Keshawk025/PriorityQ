import React from 'react';
import { LogoIcon } from '../common/Logo';

export default function Footer({ onNavigate }) {
  const handleLinkClick = (e, path) => {
    e.preventDefault();
    if (onNavigate) onNavigate(path);
  };

  return (
    <footer className="border-t border-border bg-surface text-text py-12 sm:py-16 transition-colors duration-150">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-border text-xs">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <LogoIcon size={28} />
              <span className="font-bold text-text text-sm tracking-tight">PrioritiQ CRM</span>
            </div>
            <p className="text-text-secondary leading-relaxed text-xs">
              Automated lead triage and priority classification for commercial automotive spare parts sales desks.
            </p>
            <div className="pt-1">
              <button
                type="button"
                onClick={(e) => handleLinkClick(e, '/app')}
                className="inline-flex items-center gap-1.5 rounded-md bg-accent text-accent-contrast hover:bg-accent-hover px-3 py-1.5 text-xs font-bold transition-all shadow-xs focus-ring"
              >
                <span>Try It Now (Launch CRM)</span>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>

          {/* Navigation Column 1: Product */}
          <div className="space-y-2.5">
            <h3 className="font-bold text-text uppercase text-[11px] tracking-wider">Product</h3>
            <ul className="space-y-2 text-text-secondary">
              <li>
                <a href="/" onClick={(e) => handleLinkClick(e, '/')} className="hover:text-text transition-colors">
                  Overview &amp; Home
                </a>
              </li>
              <li>
                <a href="/features" onClick={(e) => handleLinkClick(e, '/features')} className="hover:text-text transition-colors">
                  Product Features
                </a>
              </li>
              <li>
                <a href="/how-it-works" onClick={(e) => handleLinkClick(e, '/how-it-works')} className="hover:text-text transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="/app" onClick={(e) => handleLinkClick(e, '/app')} className="hover:text-text transition-colors">
                  Interactive CRM Workspace
                </a>
              </li>
            </ul>
          </div>

          {/* Navigation Column 2: Governance & Privacy */}
          <div className="space-y-2.5">
            <h3 className="font-bold text-text uppercase text-[11px] tracking-wider">Policy &amp; Compliance</h3>
            <ul className="space-y-2 text-text-secondary">
              <li>
                <a href="/privacy" onClick={(e) => handleLinkClick(e, '/privacy')} className="hover:text-text transition-colors">
                  Privacy Policy &amp; Data Handling
                </a>
              </li>
              <li>
                <a href="/privacy" onClick={(e) => handleLinkClick(e, '/privacy')} className="hover:text-text transition-colors">
                  Inquiry System Scope
                </a>
              </li>
              <li>
                <a href="/thank-you" onClick={(e) => handleLinkClick(e, '/thank-you')} className="hover:text-text transition-colors">
                  Inquiry Confirmation Demo
                </a>
              </li>
            </ul>
          </div>

          {/* Navigation Column 3: System Overview */}
          <div className="space-y-2.5">
            <h3 className="font-bold text-text uppercase text-[11px] tracking-wider">System Architecture</h3>
            <div className="rounded-md border border-border bg-surface-raised p-3 text-[11px] text-text-secondary space-y-1">
              <p className="text-text font-semibold">Local Evaluation MVP</p>
              <p>Inference: Real-time on lead creation</p>
              <p>Model: Multi-class (High, Medium, Low)</p>
              <p>Database: SQLite with audit logging</p>
            </div>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-text-muted">
          <p>© 2026 PrioritiQ CRM • Commercial Automotive Spare Parts Desk</p>
          <p className="text-[11px] text-text-muted">
            Enterprise Sales Prioritization Software • Built with React, Tailwind CSS &amp; FastAPI
          </p>
        </div>
      </div>
    </footer>
  );
}