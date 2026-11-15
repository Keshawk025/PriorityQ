import React from 'react';

export default function StickyMobileCta({ onLaunchMvp }) {
  return (
    <aside
      aria-label="Mobile Quick Action"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-[#080D1D]/90 border-t border-[#DCE4EE] dark:border-[#26354D] px-4 py-2.5 shadow-lg backdrop-blur-md transition-colors duration-150"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="text-left leading-tight">
          <p className="text-xs font-bold text-[#173B67] dark:text-[#F8FAFC]">Commercial Parts CRM</p>
          <p className="text-[10px] text-[#64748B] dark:text-[#94A3B8] font-medium">Live AI Priority Triage</p>
        </div>
        <button
          type="button"
          onClick={onLaunchMvp}
          className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded bg-[#3678D4] hover:bg-[#2A62B6] text-white px-5 py-2 text-xs font-bold shadow-btn btn-interactive focus-ring"
          aria-label="Launch CRM Application (Try It Now)"
        >
          <span>Try It Now</span>
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </aside>
  );
}
