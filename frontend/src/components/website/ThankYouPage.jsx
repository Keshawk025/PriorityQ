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
    <div className="min-h-screen bg-[#F3F6FA] dark:bg-[#0B132B] text-[#172438] dark:text-[#F8FAFC] flex flex-col font-sans">
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
          <div className="rounded-lg border border-[#DCE4EE] dark:border-[#26354D] bg-white dark:bg-[#162032] p-6 sm:p-10 shadow-card text-center">
            
            {/* Success Check Badge */}
            <div className="mx-auto h-14 w-14 rounded-full bg-[#ECFDF5] dark:bg-[#064E3B]/40 text-[#059669] dark:text-[#34D399] border border-[#6EE7B7] dark:border-[#059669]/50 flex items-center justify-center mb-5">
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <span className="text-[11px] font-bold uppercase tracking-wider text-[#059669] dark:text-[#34D399] bg-[#ECFDF5] dark:bg-[#064E3B]/30 border border-[#6EE7B7] dark:border-[#059669]/50 px-2.5 py-1 rounded-md">
              Inquiry Successfully Logged
            </span>

            <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold text-[#173B67] dark:text-white tracking-tight">
              Commercial Parts Triage Registered
            </h1>

            <p className="mt-2 text-xs sm:text-sm text-[#64748B] dark:text-[#94A3B8] leading-relaxed max-w-xl mx-auto">
              Thank you for testing the PrioritiQ evaluation workflow. In an operational commercial deployment, your inquiry is parsed by our ML pipeline and queued based on predicted urgency.
            </p>

            {/* SLA Priority Timeline Table */}
            <div className="mt-8 text-left border border-[#DCE4EE] dark:border-[#26354D] rounded-lg overflow-hidden shadow-sm">
              <div className="bg-[#F3F6FA] dark:bg-[#0F172A] px-4 py-2.5 border-b border-[#DCE4EE] dark:border-[#26354D] flex items-center justify-between">
                <span className="text-xs font-bold text-[#173B67] dark:text-[#93C5FD]">Automated Dispatch Response Tiers</span>
                <span className="text-[10px] text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider font-mono">Standard SLA Standards</span>
              </div>
              <div className="divide-y divide-[#DCE4EE] dark:divide-[#26354D] bg-white dark:bg-[#162032]">
                <div className="p-3.5 flex items-start gap-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#FEF2F2] dark:bg-[#7F1D1D]/30 text-[#DC2626] dark:text-[#F87171] border border-[#FCA5A5] dark:border-[#DC2626]/50 shrink-0">
                    High Priority
                  </span>
                  <div className="text-xs">
                    <div className="font-bold text-[#172438] dark:text-[#F8FAFC]">15-Minute Guaranteed Triage Response</div>
                    <div className="text-[#64748B] dark:text-[#94A3B8] text-[11px]">
                      Vehicle off road (VOR), highway breakdown, express courier parts routing dispatched immediately to nearest parts depot.
                    </div>
                  </div>
                </div>

                <div className="p-3.5 flex items-start gap-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#FFFBEB] dark:bg-[#78350F]/30 text-[#D97706] dark:text-[#FBBF24] border border-[#FCD34D] dark:border-[#D97706]/50 shrink-0">
                    Medium Priority
                  </span>
                  <div className="text-xs">
                    <div className="font-bold text-[#172438] dark:text-[#F8FAFC]">2-Hour Standard Assessment</div>
                    <div className="text-[#64748B] dark:text-[#94A3B8] text-[11px]">
                      Impending maintenance wear, workshop bay reservation for upcoming service, quotes for commercial assemblies.
                    </div>
                  </div>
                </div>

                <div className="p-3.5 flex items-start gap-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#ECFDF5] dark:bg-[#064E3B]/30 text-[#059669] dark:text-[#34D399] border border-[#6EE7B7] dark:border-[#059669]/50 shrink-0">
                    Low Priority
                  </span>
                  <div className="text-xs">
                    <div className="font-bold text-[#172438] dark:text-[#F8FAFC]">1-Business-Day Resolution</div>
                    <div className="text-[#64748B] dark:text-[#94A3B8] text-[11px]">
                      General catalog inquiries, bulk inventory replenishment pricing, retail accessories, exploratory quotes.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Architecture Transparency Note */}
            <div className="mt-6 rounded-lg border border-[#DCE4EE] dark:border-[#26354D] bg-[#E9EFF8]/50 dark:bg-[#1E293B]/70 p-4 text-left">
              <div className="flex items-start gap-2.5">
                <span className="text-[#3678D4] dark:text-[#60A5FA] font-bold text-sm shrink-0">ℹ</span>
                <div className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                  <strong className="text-[#173B67] dark:text-[#93C5FD] font-semibold">Self-Contained Local Environment:</strong> Because this instance runs locally with an embedded SQLite database and local scikit-learn model, no external commercial notification emails have been dispatched. You can immediately launch the live CRM application below to evaluate live lead ingestion, real-time scoring, manual priority overrides, and CSV batch processing.
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 pt-6 border-t border-[#DCE4EE] dark:border-[#26354D] flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleLaunch}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md bg-[#3678D4] hover:bg-[#2A62B6] text-white px-6 py-2.5 text-xs font-semibold shadow-btn btn-interactive transition-all"
              >
                <span>Try It Now (Launch Live CRM)</span>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>

              <button
                type="button"
                onClick={() => onNavigate && onNavigate('/')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-md border border-[#DCE4EE] dark:border-[#26354D] bg-white dark:bg-[#0F172A] hover:bg-[#F3F6FA] dark:hover:bg-[#1E293B] text-[#172438] dark:text-[#F8FAFC] px-5 py-2.5 text-xs font-semibold transition-colors"
              >
                <span>Return to Home</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate && onNavigate('/features')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-md border border-[#DCE4EE] dark:border-[#26354D] bg-white dark:bg-[#0F172A] hover:bg-[#F3F6FA] dark:hover:bg-[#1E293B] text-[#172438] dark:text-[#F8FAFC] px-5 py-2.5 text-xs font-semibold transition-colors"
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
