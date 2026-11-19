import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';
import StickyMobileCta from './StickyMobileCta';

export default function ThankYouPage({ onNavigate }) {
  const handleLaunch = () => {
    if (onNavigate) onNavigate('/app');
  };

  return (
    <div className="min-h-screen bg-bg text-text flex flex-col font-sans transition-colors duration-150">
      <Navbar onNavigate={onNavigate} currentRoute="/thank-you" />

      <main className="flex-1 pb-20">
        <Breadcrumbs
          items={[
            { label: 'Home', path: '/' },
            { label: 'Inquiry Confirmation', path: '/thank-you' },
          ]}
          onNavigate={onNavigate}
        />

        {/* Confirmation Container */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="rounded-lg border border-border bg-surface p-6 sm:p-10 shadow-card text-center">
            
            {/* Success Check Badge */}
            <div className="mx-auto h-14 w-14 rounded-full bg-surface-raised border border-border text-text flex items-center justify-center mb-5 text-xl font-bold">
              ✓
            </div>

            <span className="text-[11px] font-bold uppercase tracking-wider text-text bg-surface-raised border border-border px-2.5 py-1 rounded-md font-mono">
              Inquiry Successfully Logged
            </span>

            <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold text-text tracking-tight">
              Commercial Parts Triage Registered
            </h1>

            <p className="mt-2 text-xs sm:text-sm text-text-secondary leading-relaxed max-w-xl mx-auto">
              Thank you for testing the PrioritiQ evaluation workflow. In an operational commercial deployment, your inquiry is parsed by our ML pipeline and queued based on predicted urgency.
            </p>

            {/* SLA Priority Timeline Table */}
            <div className="mt-8 text-left border border-border rounded-lg overflow-hidden shadow-xs">
              <div className="bg-surface-raised px-4 py-2.5 border-b border-border flex items-center justify-between">
                <span className="text-xs font-bold text-text">Automated Dispatch Response Tiers</span>
                <span className="text-[10px] text-text-muted uppercase tracking-wider font-mono">Standard SLA Standards</span>
              </div>
              <div className="divide-y divide-border bg-surface">
                <div className="p-3.5 flex items-start gap-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 shrink-0">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-600 dark:bg-red-500"></span>
                    <span>High Priority</span>
                  </span>
                  <div className="text-xs">
                    <div className="font-bold text-text">15-Minute Guaranteed Triage Response</div>
                    <div className="text-text-secondary text-[11px]">
                      Vehicle off road (VOR), highway breakdown, express courier parts routing dispatched immediately to nearest parts depot.
                    </div>
                  </div>
                </div>

                <div className="p-3.5 flex items-start gap-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 shrink-0">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                    <span>Medium Priority</span>
                  </span>
                  <div className="text-xs">
                    <div className="font-bold text-text">2-Hour Standard Assessment</div>
                    <div className="text-text-secondary text-[11px]">
                      Impending maintenance wear, workshop bay reservation for upcoming service, quotes for commercial assemblies.
                    </div>
                  </div>
                </div>

                <div className="p-3.5 flex items-start gap-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 shrink-0">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                    <span>Low Priority</span>
                  </span>
                  <div className="text-xs">
                    <div className="font-bold text-text">1-Business-Day Resolution</div>
                    <div className="text-text-secondary text-[11px]">
                      General catalog inquiries, bulk inventory replenishment pricing, retail accessories, exploratory quotes.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Architecture Transparency Note */}
            <div className="mt-6 rounded-lg border border-border bg-surface-raised p-4 text-left">
              <div className="flex items-start gap-2.5">
                <span className="text-text font-bold text-sm shrink-0 font-mono">ℹ</span>
                <div className="text-xs text-text-secondary leading-relaxed">
                  <strong className="text-text font-semibold">Self-Contained Local Environment:</strong> Because this instance runs locally with an embedded SQLite database and local scikit-learn model, no external commercial notification emails have been dispatched. You can immediately launch the live CRM application below to evaluate live lead ingestion, real-time scoring, manual priority overrides, and CSV batch processing.
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleLaunch}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md bg-accent text-accent-contrast hover:bg-accent-hover px-6 py-2.5 text-xs font-bold shadow-xs focus-ring transition-colors"
              >
                <span>Try It Now (Launch Live CRM)</span>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>

              <button
                type="button"
                onClick={() => onNavigate && onNavigate('/')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-md border border-border bg-surface hover:bg-surface-hover text-text px-5 py-2.5 text-xs font-semibold transition-colors focus-ring"
              >
                <span>Return to Home</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate && onNavigate('/features')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-md border border-border bg-surface hover:bg-surface-hover text-text px-5 py-2.5 text-xs font-semibold transition-colors focus-ring"
              >
                <span>View Features</span>
              </button>
            </div>

          </div>
        </div>
      </main>

      <Footer onNavigate={onNavigate} />
      <StickyMobileCta onLaunchMvp={handleLaunch} />
    </div>
  );
}